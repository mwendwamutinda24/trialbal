/**
 * nserver.js
 * -----------------------------------------------------------------------
 * Single-file consolidation of:
 *   server.js
 *   models/School.js
 *   models/FinancialYear.js
 *   models/TrialBalanceRow.js
 *   routes/financialYears.js
 *
 * Behavior is unchanged from the original multi-file version — this just
 * inlines the three schemas and the financial-years router into one file.
 * `./data/counties.js` is left as a separate require since it's plain
 * data, not a schema or route.
 *
 * Run with: node nserver.js
 * -----------------------------------------------------------------------
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // force Google DNS for SRV lookups

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const XLSX = require("xlsx");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas (no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ═══════════════════════════════════════════════════════════════════════
   SCHEMAS
   (previously models/School.js, models/FinancialYear.js,
   models/TrialBalanceRow.js)
═══════════════════════════════════════════════════════════════════════ */

// ── School ──────────────────────────────────────────────────────────────
const SchoolSchema = new mongoose.Schema({
  schoolName: String,
  regNumber: String,
  schoolType: String,
  county: String,
  subCounty: String,
  principalName: String,
  principalEmail: { type: String, unique: true },
  principalPhone: String,
  principalPassword: String, // hashed
});
const School = mongoose.model("School", SchoolSchema);

// ── FinancialYear ───────────────────────────────────────────────────────
const VoteheadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const AccountSchema = new mongoose.Schema({
  key: { type: String, required: true }, // slug e.g. "operations"
  name: { type: String, required: true }, // "Operations"
  voteheads: [VoteheadSchema],
});

// Sensible defaults matching the standard IPSAS school accounts template.
// A school can still customise voteheads later via the accounts array.
// NOTE: voteheads must be objects matching VoteheadSchema ({ name, order }),
// not plain strings — Mongoose can't cast a bare string into an embedded
// subdocument, which is what previously caused ObjectParameterError on
// financial year creation.
const DEFAULT_ACCOUNTS = [
  {
    key: "operations",
    name: "Operations",
    voteheads: [
      "Local Travel & Transport (Lt&T)",
      "Electricity Water & Conservancy (Ewc)",
      "Administrative Cost",
      "Activity",
      "Personal Emolument (Salaries)",
      "Medical & Insurance/Nhif",
      "Bank Charges",
      "Repair Maintenance & Improvement(Rmi)",
      "Sundry Creditors",
    ].map((name, order) => ({ name, order })),
  },
  {
    key: "tuition",
    name: "Tuition",
    voteheads: [
      "Reference Materials",
      "Exercise Books",
      "Laboratory Equipment",
      "Teaching / Learning Materials",
      "Internal Exams",
      "Bank Charges",
      "Creditors",
    ].map((name, order) => ({ name, order })),
  },
  {
    key: "school-fund",
    name: "School Fund",
    voteheads: [
      "Lunch Programme/Boarding",
      "Local Travel & Transport (Lt&T)",
      "Electricity Water & Conservancy (Ewc)",
      "Administrative Cost",
      "Personal Emolument (Salaries)",
      "Activity",
      "Repair Maintenance & Improvement(Rmi)",
      "Fees Prepayments",
      "Fees Arrears",
      "Creditors",
      "Bank Charges",
      "NSSF",
      "SHIF",
      "PAYE",
    ].map((name, order) => ({ name, order })),
  },
  {
    key: "infrastructure",
    name: "Infrastructure",
    voteheads: ["Maintenance & Improvement", "Bank Charges"].map((name, order) => ({
      name,
      order,
    })),
  },
];

const FinancialYearSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    label: { type: String, required: true }, // e.g. "2026/27"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["draft", "finalized"], default: "draft" },
    accounts: { type: [AccountSchema], default: DEFAULT_ACCOUNTS },
  },
  { timestamps: true }
);
FinancialYearSchema.statics.DEFAULT_ACCOUNTS = DEFAULT_ACCOUNTS;
const FinancialYear = mongoose.model("FinancialYear", FinancialYearSchema);

// ── TrialBalanceRow ─────────────────────────────────────────────────────
const TrialBalanceRowSchema = new mongoose.Schema(
  {
    financialYear: { type: mongoose.Schema.Types.ObjectId, ref: "FinancialYear", required: true },
    accountKey: { type: String, required: true }, // matches FinancialYear.accounts[].key
    rowType: { type: String, enum: ["opening", "votehead", "closing"], required: true },
    voteheadId: { type: mongoose.Schema.Types.ObjectId, default: null }, // null for opening/closing rows
    voteheadName: { type: String, default: "" },
    estimates: { type: Number, default: 0 },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    commitment: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);
// One row per (financialYear, accountKey, rowType, voteheadId) — re-uploads overwrite, not duplicate.
TrialBalanceRowSchema.index(
  { financialYear: 1, accountKey: 1, rowType: 1, voteheadId: 1 },
  { unique: true }
);
const TrialBalanceRow = mongoose.model("TrialBalanceRow", TrialBalanceRowSchema);

/* ═══════════════════════════════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════════════════════════════ */

// ✅ Register Endpoint
app.post("/register", async (req, res) => {
  try {
    const { principalPassword, principalEmail, schoolName, ...rest } = req.body;

    if (!schoolName || !principalEmail || !principalPassword) {
      return res.status(400).json({ error: "School name, email, and password are required." });
    }

    const hashedPassword = await bcrypt.hash(principalPassword, 10);

    const school = new School({
      ...rest,
      schoolName,
      principalEmail,
      principalPassword: hashedPassword,
    });
    await school.save();

    res.json({ message: "School registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const school = await School.findOne({ principalEmail: email });
    if (!school) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, school.principalPassword);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: school._id, email: school.principalEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Middleware for Protected Routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ✅ Verify Endpoint (for ProtectedRoute to check token validity)
app.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ✅ Current school/user data (for dashboard)
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const school = await School.findById(req.user.id).select("-principalPassword");
    if (!school) return res.status(404).json({ error: "School not found" });
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const counties = require("./data/counties");

// ✅ Counties + Sub-counties Endpoint
app.get("/counties", (req, res) => {
  res.json(counties);
});

/* ═══════════════════════════════════════════════════════════════════════
   FINANCIAL YEARS + TRIAL BALANCE ROUTES
   (previously routes/financialYears.js — mounted at /financial-years)
═══════════════════════════════════════════════════════════════════════ */

const financialYearsRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------------------------------------------------
// GET /financial-years — list all financial years for the logged-in school
// ---------------------------------------------------------------------
financialYearsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const years = await FinancialYear.find({ school: req.user.id }).sort({ startDate: -1 });
    res.json(years);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// POST /financial-years — create a new financial year for the logged-in school
// body: { label, startDate, endDate }
// ---------------------------------------------------------------------
financialYearsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { label, startDate, endDate } = req.body;
    if (!label || !startDate || !endDate) {
      return res.status(400).json({ error: "label, startDate and endDate are required." });
    }

    // Deep-clone the shared DEFAULT_ACCOUNTS array so every financial year
    // gets its own independent copy. Without this, Mongoose assigns _ids
    // to the subdocuments in place on save, which would otherwise leak
    // across every FinancialYear document created from the same reference.
    const accounts = JSON.parse(JSON.stringify(FinancialYear.DEFAULT_ACCOUNTS));

    const year = new FinancialYear({
      school: req.user.id,
      label,
      startDate,
      endDate,
      accounts,
    });
    await year.save();
    res.status(201).json(year);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// GET /financial-years/:id — one financial year (scoped to logged-in school)
// includes summary totals aggregated from TrialBalanceRow
// ---------------------------------------------------------------------
financialYearsRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const year = await FinancialYear.findOne({ _id: req.params.id, school: req.user.id });
    if (!year) return res.status(404).json({ error: "Financial year not found." });

    const rows = await TrialBalanceRow.find({ financialYear: year._id });

    const totals = rows.reduce(
      (acc, r) => {
        if (r.rowType === "votehead") {
          acc.receipts += r.credit || 0;
          acc.payments += r.debit || 0;
        }
        if (r.rowType === "closing") acc.cash += r.balance || 0;
        return acc;
      },
      { receipts: 0, payments: 0, cash: 0 }
    );
    totals.surplus = totals.receipts - totals.payments;
    totals.netAssets = totals.cash; // extend later once receivables/payables exist

    res.json({ ...year.toObject(), totals, trialBalanceRows: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// PATCH /financial-years/:id/finalize — lock the year
// ---------------------------------------------------------------------
financialYearsRouter.patch("/:id/finalize", authMiddleware, async (req, res) => {
  try {
    const year = await FinancialYear.findOneAndUpdate(
      { _id: req.params.id, school: req.user.id },
      { status: "finalized" },
      { new: true }
    );
    if (!year) return res.status(404).json({ error: "Financial year not found." });
    res.json(year);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// GET /financial-years/:id/trial-balance/template?account_keys[]=operations&account_keys[]=tuition
// Generates one combined .xlsx with one sheet per requested account,
// pre-filled with opening/closing balance rows and voteheads. Each data
// row carries a hidden tag in the last column so the upload parser can
// reliably map it back regardless of row order or relabeling.
// ---------------------------------------------------------------------
financialYearsRouter.get("/:id/trial-balance/template", authMiddleware, async (req, res) => {
  try {
    const year = await FinancialYear.findOne({ _id: req.params.id, school: req.user.id });
    if (!year) return res.status(404).json({ error: "Financial year not found." });

    let requestedKeys = req.query.account_keys || req.query["account_keys[]"];
    if (!requestedKeys) requestedKeys = year.accounts.map((a) => a.key);
    if (!Array.isArray(requestedKeys)) requestedKeys = [requestedKeys];

    const school = await School.findById(req.user.id);

    const wb = XLSX.utils.book_new();

    for (const account of year.accounts) {
      if (!requestedKeys.includes(account.key)) continue;

      const asAt = new Date(year.endDate).toLocaleDateString("en-GB").split("/").join(".");
      const rows = [];
      rows.push([]);
      rows.push([]);
      rows.push([school.schoolName]);
      rows.push([`TRIAL BALANCE - ${account.name.toUpperCase()} ACCOUNT`]);
      rows.push([`AS AT ${asAt}`]);
      rows.push([]);
      rows.push([null, "L/F NO.", "ESTIMATES", "DEBIT", "CREDIT", "COMMITMENT", "BALANCE", null]);
      rows.push([
        "OPENING BALANCE - BANK",
        null,
        null,
        null,
        0,
        null,
        0,
        `BANKDEFAULT:${account.key}:OPENING`,
      ]);

      account.voteheads.forEach((vh, idx) => {
        rows.push([vh.name, idx + 1, 0, 0, 0, 0, 0, `VOTEHEAD:${vh._id}`]);
      });

      rows.push([
        "CLOSING BALANCE - BANK",
        null,
        null,
        0,
        null,
        null,
        0,
        `BANKDEFAULT:${account.key}:CLOSING`,
      ]);
      rows.push(["GRAND TOTALS", null, 0, 0, 0, 0, 0]);
      rows.push([]);
      rows.push(["Debit should equal Credit (Total Debit - Total Credit):", null, null, 0]);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      // Sheet names must be <=31 chars and unique — account.name already satisfies both here.
      XLSX.utils.book_append_sheet(wb, ws, account.name.substring(0, 31));
    }

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="TrialBalance_${year.label.replace("/", "_")}.xlsx"`
    );
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// POST /financial-years/:id/trial-balance/upload
// Accepts the filled-in .xlsx (multipart field name "template") and
// upserts TrialBalanceRow documents by reading the hidden tag column.
// ---------------------------------------------------------------------
financialYearsRouter.post(
  "/:id/trial-balance/upload",
  authMiddleware,
  upload.single("template"),
  async (req, res) => {
    try {
      const year = await FinancialYear.findOne({ _id: req.params.id, school: req.user.id });
      if (!year) return res.status(404).json({ error: "Financial year not found." });
      if (!req.file) return res.status(400).json({ error: "No file uploaded." });

      const wb = XLSX.read(req.file.buffer, { type: "buffer" });
      const accountByName = new Map(year.accounts.map((a) => [a.name, a]));

      const ops = [];

      for (const sheetName of wb.SheetNames) {
        const account = accountByName.get(sheetName);
        if (!account) continue; // skip sheets that don't match a known account

        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        for (const row of rows) {
          const tag = row[7]; // hidden tag column (index 7 = column H)
          if (!tag || typeof tag !== "string") continue;

          const [estimates, debit, credit, commitment, balance] = [
            Number(row[2]) || 0,
            Number(row[3]) || 0,
            Number(row[4]) || 0,
            Number(row[5]) || 0,
            Number(row[6]) || 0,
          ];

          if (tag.startsWith("VOTEHEAD:")) {
            const voteheadId = tag.split(":")[1];
            ops.push({
              updateOne: {
                filter: {
                  financialYear: year._id,
                  accountKey: account.key,
                  rowType: "votehead",
                  voteheadId,
                },
                update: {
                  $set: {
                    voteheadName: row[0],
                    estimates,
                    debit,
                    credit,
                    commitment,
                    balance,
                  },
                },
                upsert: true,
              },
            });
          } else if (tag.startsWith("BANKDEFAULT:")) {
            const rowType = tag.endsWith("OPENING") ? "opening" : "closing";
            ops.push({
              updateOne: {
                filter: {
                  financialYear: year._id,
                  accountKey: account.key,
                  rowType,
                  voteheadId: null,
                },
                update: {
                  $set: { voteheadName: row[0], debit, credit, balance },
                },
                upsert: true,
              },
            });
          }
        }
      }

      if (ops.length === 0) {
        return res
          .status(400)
          .json({ error: "No recognisable rows found. Please use the downloaded template." });
      }

      await TrialBalanceRow.bulkWrite(ops);
      res.json({ success: true, rowsProcessed: ops.length });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.use("/financial-years", financialYearsRouter);

/* ═══════════════════════════════════════════════════════════════════════
   START SERVER
═══════════════════════════════════════════════════════════════════════ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
