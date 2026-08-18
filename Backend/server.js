/**
 * nserver.js
 * -----------------------------------------------------------------------
 * Single-file consolidation with keep-alive mechanism to prevent
 * Render free tier from spinning down the server.
 * 
 * Adds a ping endpoint and automatic periodic pinging every 15 seconds.
 * -----------------------------------------------------------------------
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ─── KEEP-ALIVE CONFIG ────────────────────────────────────────────────
// This prevents Render free tier from spinning down the server
// by periodically pinging itself every 15 seconds.
const KEEP_ALIVE_INTERVAL = 15000; // 15 seconds
const PORT = process.env.PORT || 5000;

// ─── MAPS & CONSTANTS ──────────────────────────────────────────────────
const EXPENDITURE_LINE_MAP = {
  "Local Travel & Transport (Lt&T)": "Local Travel and Transport",
  "Electricity Water & Conservancy (Ewc)": "Administration Cost",
  "Administrative Cost": "Administration Cost",
  "Activity": "Activity",
  "Personal Emolument (Salaries)": "Personnel Emoluments",
  "Medical & Insurance/Nhif": "Medical and Insurance",
  "Bank Charges": "Bank Charges",
  "Repair Maintenance & Improvement(Rmi)": "Repairs and Maintenance",
  "Reference Materials": "Teaching/Learning Materials",
  "Exercise Books": "Teaching/Learning Materials",
  "Laboratory Equipment": "Teaching/Learning Materials",
  "Teaching / Learning Materials": "Teaching/Learning Materials",
  "Internal Exams": "Other (specify)",
  "Lunch Programme/Boarding": "Lunch Programme",
  "Maintenance & Improvement": "Infrastructure Maintenance & Improvement",
};

const BALANCE_SHEET_VOTEHEADS = new Set([
  "Sundry Creditors", "Creditors", "Fees Prepayments", "Fees Arrears",
  "NSSF", "SHIF", "PAYE",
]);

const ACCOUNT_REVENUE_LINE = {
  operations: "Capitation Grants for Operations",
  tuition: "Capitation Grants for Tuition",
  "school-fund": "Students' Fees",
  infrastructure: "Revenue for Infrastructure",
};

const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell,
        TextRun, AlignmentType, WidthType, BorderStyle } = require("docx");

function fmt(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

// ─── KEEP-ALIVE: Health Check Endpoint ──────────────────────────────
// This endpoint is used to check if the server is alive.
// It can also be pinged externally to keep the server awake.
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// ─── KEEP-ALIVE: Self-ping every 15 seconds ─────────────────────────
// This ensures the server keeps running on Render free tier.
// It pings the /health endpoint internally every 15 seconds.
function startKeepAlive() {
  console.log(`🔄 Keep-alive enabled: pinging /health every ${KEEP_ALIVE_INTERVAL / 1000}s`);
  
  setInterval(async () => {
    try {
      // Use the base URL from environment or localhost
      const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      const response = await fetch(`${baseUrl}/health`);
      
      if (!response.ok) {
        console.warn(`⚠️ Keep-alive ping failed: ${response.status}`);
      } else {
        console.log(`💓 Keep-alive ping successful at ${new Date().toISOString()}`);
      }
    } catch (error) {
      // Silently fail - the server might still be starting up
      console.log(`🔄 Keep-alive: server not ready yet`);
    }
  }, KEEP_ALIVE_INTERVAL);
}

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Start keep-alive only after DB is connected
    startKeepAlive();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ═══════════════════════════════════════════════════════════════════════
   SCHEMAS (unchanged from original)
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
  principalPassword: String,
});
const School = mongoose.model("School", SchoolSchema);

// ── FinancialYear ───────────────────────────────────────────────────────
const VoteheadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const AccountSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  voteheads: [VoteheadSchema],
});

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
    label: { type: String, required: true },
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
    accountKey: { type: String, required: true },
    rowType: { type: String, enum: ["opening", "votehead", "closing"], required: true },
    voteheadId: { type: mongoose.Schema.Types.ObjectId, default: null },
    voteheadName: { type: String, default: "" },
    estimates: { type: Number, default: 0 },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    commitment: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);
TrialBalanceRowSchema.index(
  { financialYear: 1, accountKey: 1, rowType: 1, voteheadId: 1 },
  { unique: true }
);
const TrialBalanceRow = mongoose.model("TrialBalanceRow", TrialBalanceRowSchema);

/* ═══════════════════════════════════════════════════════════════════════
   AUTH (unchanged from original)
═══════════════════════════════════════════════════════════════════════ */

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
      { expiresIn: "24h" } // Extended to 24h to reduce token refreshes
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

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

app.get("/counties", (req, res) => {
  res.json(counties);
});

/* ═══════════════════════════════════════════════════════════════════════
   FINANCIAL YEARS + TRIAL BALANCE ROUTES (unchanged from original)
═══════════════════════════════════════════════════════════════════════ */

const financialYearsRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

financialYearsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const years = await FinancialYear.find({ school: req.user.id }).sort({ startDate: -1 });
    res.json(years);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

financialYearsRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { label, startDate, endDate } = req.body;
    if (!label || !startDate || !endDate) {
      return res.status(400).json({ error: "label, startDate and endDate are required." });
    }

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
    totals.netAssets = totals.cash;

    res.json({ ...year.toObject(), totals, trialBalanceRows: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
        if (!account) continue;

        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        for (const row of rows) {
          const tag = row[7];
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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check available at /health`);
  console.log(`⏰ Keep-alive interval: ${KEEP_ALIVE_INTERVAL / 1000} seconds`);
});

// ─── OPTIONAL: Also ping from the client side ────────────────────────
// If you want to add client-side keep-alive, uncomment this section
// and add it to your frontend code.
/*
// In your frontend App.jsx or index.js:
setInterval(() => {
  fetch('https://your-server.onrender.com/health')
    .then(res => res.json())
    .then(data => console.log('💓 Server is alive'));
}, 15000);
*/
