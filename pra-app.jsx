import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Pill, Plane, Utensils, Film, Ticket, 
  Sparkles, CheckCircle2, Hand, ShoppingCart, 
  Info, Lock, Printer, Wallet, CreditCard, 
  ChevronRight, Sun, Moon, User, Home, Gift, 
  Plus, Shield, Users, Activity, FileText 
} from "lucide-react";

// MOCK DATA 
const ANNOUNCEMENTS = [
  { id: 1, title: "New Partnership with Philippine Airlines", date: "June 1, 2026", text: "Enjoy exclusive base fare discounts starting next month." },
  { id: 2, title: "Updated OSCA ID Requirements", date: "May 28, 2026", text: "Please ensure your senior citizen IDs are updated for verification." }
];

const INITIAL_BENEFITS = [
  {
    id: "med-city",
    category: "health",
    categoryLabel: "Health & Wellness",
    title: "Executive Check-up Package",
    partner: "The Medical City",
    location: "Ortigas Center, Pasig City",
    description: "Comprehensive executive medical check-up including CBC, urinalysis, chest X-ray, ECG, and consultation with an internist. Book at any The Medical City branch nationwide.",
    originalPrice: 8500,
    discountPct: 20,
    tag: "20% off for PRA Members",
    iconId: "heart",
    type: "purchase",
    voucherValidity: "Valid until December 31, 2025",
  },
  {
    id: "mercury",
    category: "health",
    categoryLabel: "Health & Wellness",
    title: "Maintenance Medication Discount",
    partner: "Mercury Drug",
    location: "All branches nationwide",
    description: "Extra 5% discount on top of the standard 20% senior citizen discount on all maintenance medications. Present your PRA Senior Benefits Card upon purchase.",
    originalPrice: null,
    discountPct: 5,
    tag: "Extra 5% on senior discount",
    iconId: "pill",
    type: "claim",
    voucherValidity: "Ongoing benefit no expiry",
  },
  {
    id: "henann",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Staycation Package 3D2N",
    partner: "Henann Resort Boracay",
    location: "White Beach, Boracay Island",
    description: "Exclusive retiree off-season rate: 3 days, 2 nights in a Deluxe Sea View Room, daily breakfast for 2, complimentary airport transfer, and access to all resort amenities.",
    originalPrice: 22000,
    discountPct: 30,
    tag: "Exclusive retiree off-season rate",
    iconId: "plane",
    type: "purchase",
    voucherValidity: "Valid for bookings until March 31, 2026",
  },
  {
    id: "cebupac",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Domestic Flight Zero Booking Fee",
    partner: "Cebu Pacific",
    location: "All domestic routes",
    description: "Book any Cebu Pacific domestic flight with zero booking convenience fees. Available on cebu-air.com and all Cebu Pacific ticketing offices when you present your PRA ID.",
    originalPrice: null,
    discountPct: null,
    tag: "Zero booking fees for retirees",
    iconId: "plane",
    type: "claim",
    voucherValidity: "Valid for travel dates within 2025",
  },
  {
    id: "maxs",
    category: "dining",
    categoryLabel: "Food & Dining",
    title: "Grandparent's Weekend Feast",
    partner: "Max's Restaurant",
    location: "All branches dine-in & delivery",
    description: "Bring the family every Saturday and Sunday! Enjoy a free appetizer (Spring Roll platter) with any main course order, plus free delivery within 5km radius. Valid for tables of 2 or more.",
    originalPrice: 680,
    discountPct: 15,
    tag: "Free appetizer + free delivery",
    iconId: "utensils",
    type: "purchase",
    voucherValidity: "Valid every weekend until Dec 2025",
  },
  {
    id: "sm-cinema",
    category: "entertainment",
    categoryLabel: "Entertainment & Leisure",
    title: "Unlimited Weekday Movie Pass",
    partner: "SM Cinemas",
    location: "All SM Cinema branches",
    description: "Watch any movie on any weekday before 5:00 PM for only PhP 100 flat rate. No blackout dates, valid for all regular screenings. Not valid for 3D, IMAX, or special screenings.",
    originalPrice: 350,
    discountPct: null,
    fixedPrice: 100,
    tag: "P100 flat rate before 5 PM",
    iconId: "film",
    type: "purchase",
    voucherValidity: "Valid Jan to Dec 2025, weekdays only",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Benefits", iconId: "ticket" },
  { id: "health", label: "Health & Wellness", iconId: "heart" },
  { id: "travel", label: "Travel & Hotels", iconId: "plane" },
  { id: "dining", label: "Food & Dining", iconId: "utensils" },
  { id: "entertainment", label: "Entertainment", iconId: "film" },
];

const MOCK_USERS = [
  { id: "U001", name: "Maria Santos", email: "maria@example.com", status: "Active" },
  { id: "U002", name: "Jose Rizal", email: "jose@example.com", status: "Active" },
  { id: "U003", name: "Andres Bonifacio", email: "andres@example.com", status: "Pending" }
];

const MOCK_TRANSACTIONS = [
  { id: "TX-1001", user: "Maria Santos", item: "Staycation Package", amount: 15400, date: "2026-06-01" },
  { id: "TX-1002", user: "Jose Rizal", item: "Executive Check-up", amount: 6800, date: "2026-05-29" },
];

// HELPERS 
const fmt = (n) =>
  "P" +
  Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const calcFinal = (item) => {
  if (item.fixedPrice) return item.fixedPrice;
  if (item.originalPrice && item.discountPct)
    return item.originalPrice * (1 - item.discountPct / 100);
  return null;
};

const genVoucher = () =>
  "PRA-" +
  Math.random().toString(36).substring(2, 6).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

const IconMap = {
  heart: Heart,
  pill: Pill,
  plane: Plane,
  utensils: Utensils,
  film: Film,
  ticket: Ticket,
  sparkles: Sparkles
};

function getIcon(id, size = 24, className = "") {
  const IconCmp = IconMap[id] || Ticket;
  return <IconCmp size={size} className={className} />;
}

// STYLES 
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
  
  :root {
    --bg-main: #FFFFFF;
    --bg-surface: #F8F9FA;
    --bg-elevated: #FFFFFF;
    --text-primary: #2D3748;
    --text-secondary: #4A5568;
    --text-muted: #9AA5B4;
    --border: #E4E8EE;
    --navy: #0A2540;
    --navy-mid: #1E4D7B;
    --navy-light: #163A5F;
    --orange: #FF8C00;
    --orange-light: #FFA733;
    --orange-pale: #FFF5E6;
    --green: #1A7A4A;
    --green-light: #E6F4EC;
    --red: #C0392B;
    --red-light: #FDECEA;
    --shadow-sm: 0 2px 12px rgba(10,37,64,0.07);
    --shadow-md: 0 8px 24px rgba(10,37,64,0.12);
  }

  [data-theme="dark"] {
    --bg-main: #121212;
    --bg-surface: #1E1E1E;
    --bg-elevated: #2A2A2A;
    --text-primary: #F0F2F5;
    --text-secondary: #CBD5E1;
    --text-muted: #94A3B8;
    --border: #333333;
    --navy: #1A202C;
    --navy-mid: #2D3748;
    --navy-light: #3A4A5A;
    --orange: #FF9800;
    --orange-light: #FFB74D;
    --orange-pale: rgba(255, 140, 0, 0.1);
    --green: #4ADE80;
    --green-light: rgba(74, 222, 128, 0.15);
    --red: #F87171;
    --red-light: rgba(248, 113, 113, 0.15);
    --shadow-sm: 0 2px 12px rgba(0,0,0,0.5);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.7);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: var(--bg-main); color: var(--text-primary); transition: background 0.3s, color 0.3s; }
  input, select, textarea { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fade-in { animation: fadeIn 0.45s ease both; }
  .spin { animation: spin 1s linear infinite; }

  .btn-primary {
    background: var(--orange);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 28px;
    min-height: 52px;
    transition: background 0.2s, transform 0.1s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--orange-light); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: var(--text-muted); cursor: not-allowed; }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    min-height: 48px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-secondary:hover { background: var(--bg-surface); border-color: var(--text-muted); }

  .btn-claim {
    background: var(--green-light);
    color: var(--green);
    border: 2px solid var(--green);
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 24px;
    min-height: 52px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-claim:hover { background: var(--green); color: white; }

  .form-input {
    width: 100%;
    padding: 14px 18px;
    font-size: 16px;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-elevated);
    color: var(--text-primary);
    transition: border-color 0.2s;
    min-height: 52px;
  }
  .form-input:focus { outline: none; border-color: var(--orange); }
  .form-input.error { border-color: var(--red); }
  .form-label { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; display: block; }
  .form-error { font-size: 14px; color: var(--red); margin-top: 6px; font-weight: 500; }
  .form-hint { font-size: 14px; color: var(--text-secondary); margin-top: 6px; }

  .card {
    background: var(--bg-elevated);
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .benefit-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--orange-pale); }
  .benefit-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }

  .payment-option { transition: all 0.2s; cursor: pointer; }
  .payment-option:hover, .payment-option.selected { border-color: var(--orange) !important; background: var(--orange-pale) !important; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 6px; }
  
  .carousel-container {
    display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; scroll-snap-type: x mandatory;
  }
  .carousel-item {
    min-width: 280px; max-width: 300px; flex-shrink: 0; scroll-snap-align: start;
  }
`;

// SUBCOMPONENTS 

function Spinner({ size = 24 }) {
  return (
    <div
      className="spin"
      style={{
        width: size, height: size,
        border: `3px solid var(--border)`,
        borderTop: `3px solid var(--orange)`,
        borderRadius: "50%",
      }}
    />
  );
}

function Tag({ children, color = "orange" }) {
  const bg = color === "orange" ? "var(--orange-pale)" : "var(--green-light)";
  const text = color === "orange" ? "var(--orange)" : "var(--green)";
  return (
    <span style={{ background: bg, color: text, fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 20, display: "inline-block" }}>
      {children}
    </span>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, background: i < step ? "var(--orange)" : "var(--border)", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

function PRACard({ member }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)`,
        borderRadius: 20,
        padding: "24px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>Republic of the Philippines</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, color: "var(--orange-light)" }}>Philippine Retirement Authority</div>
        </div>
        <div style={{ background: "var(--orange)", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "white" }}>PRA</div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Senior Benefits Card</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", letterSpacing: 0.5 }}>
          {member.firstName} {member.lastName}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>PRA ID Number</div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>{member.praId}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Valid Until</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>12/2027</div>
        </div>
      </div>
    </div>
  );
}

// REGISTRATION FLOW 

function RegistrationPage({ onComplete }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", province: "", city: "", mobile: "", praId: "", email: "", password: "", confirmPassword: "",
  });

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim()) e.lastName = "Required.";
    if (!form.dob) { e.dob = "Required."; }
    else {
      const age = Math.floor((Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25));
      if (age < 60) e.dob = `Must be at least 60 years old. Calculated age: ${age}.`;
    }
    if (!form.mobile.trim()) e.mobile = "Required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.praId.trim()) e.praId = "Required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Required.";
    if (!form.password) e.password = "Required.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (step === 3) {
      valid = validateStep3();
      if (valid) {
        const age = Math.floor((Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25));
        onComplete({ ...form, age, praId: form.praId.trim().toUpperCase() });
        return;
      }
    }
    if (valid) setStep((s) => s + 1);
  };

  const STEPS = ["Personal", "PRA Info", "Account"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "32px 16px", flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 480 }} className="fade-in">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Libre Baskerville', serif", color: "var(--navy)", marginBottom: 8 }}>Create Account</h1>
            <p style={{ color: "var(--text-secondary)" }}>Register for your PRA Digital Benefits</p>
          </div>
          
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <ProgressBar step={step} total={3} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, marginBottom: 24 }}>
              {STEPS.map((s, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: i + 1 <= step ? 700 : 500, color: i + 1 <= step ? "var(--orange)" : "var(--text-muted)" }}>{s}</span>
              ))}
            </div>

            {step === 1 && (
              <div className="fade-in">
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">First Name</label>
                  <input className={`form-input${errors.firstName ? " error" : ""}`} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                  {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Last Name</label>
                  <input className={`form-input${errors.lastName ? " error" : ""}`} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className={`form-input${errors.dob ? " error" : ""}`} value={form.dob} onChange={(e) => set("dob", e.target.value)} max={new Date(Date.now() - 60 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
                  {errors.dob && <div className="form-error">{errors.dob}</div>}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Mobile Number</label>
                  <input className={`form-input${errors.mobile ? " error" : ""}`} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in">
                <div style={{ background: "var(--orange-pale)", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
                  <Info size={24} color="var(--orange)" />
                  <div style={{ fontSize: 14, color: "var(--text-primary)" }}>Find your PRA ID on your membership certificate.</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">PRA ID Number</label>
                  <input className={`form-input${errors.praId ? " error" : ""}`} value={form.praId} onChange={(e) => set("praId", e.target.value)} placeholder="SRRV-XXXXX" />
                  {errors.praId && <div className="form-error">{errors.praId}</div>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="fade-in">
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" className={`form-input${errors.email ? " error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Password</label>
                  <input type="password" className={`form-input${errors.password ? " error" : ""}`} value={form.password} onChange={(e) => set("password", e.target.value)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className={`form-input${errors.confirmPassword ? " error" : ""}`} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
                  {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {step > 1 && <button className="btn-secondary" onClick={() => setStep((s) => s - 1)}>Back</button>}
              <button className="btn-primary" onClick={nextStep} style={{ flex: 1 }}>{step < 3 ? "Continue" : "Complete Registration"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD 

function Dashboard({ member, benefits, onNavigate }) {
  const featured = benefits.slice(0, 5);

  return (
    <div className="fade-in" style={{ padding: "24px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 24, marginBottom: 4 }}>Welcome back, {member.firstName}</h2>
        <p style={{ color: "var(--text-secondary)" }}>Here is what is new for you today.</p>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 28, background: "var(--orange-pale)", border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Info size={20} color="var(--orange)" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Announcements</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ANNOUNCEMENTS.map(ann => (
            <div key={ann.id} style={{ paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{ann.date}</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--navy)", marginBottom: 4 }}>{ann.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{ann.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Featured Benefits</h3>
          <button onClick={() => onNavigate("benefits", "all")} style={{ background: "none", border: "none", color: "var(--orange)", fontWeight: 600, display: "flex", alignItems: "center" }}>
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="carousel-container">
          {featured.map(item => (
            <div key={item.id} className="card carousel-item" style={{ padding: 16 }}>
              <div style={{ width: 40, height: 40, background: "var(--bg-surface)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                {getIcon(item.iconId, 20, "var(--orange)")}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>{item.partner}</div>
              <Tag color="orange">{item.tag}</Tag>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Digital Card</h3>
        <PRACard member={member} />
      </div>
    </div>
  );
}

// BENEFITS HUB 

function BenefitsHub({ benefits, initialCategory = "all", onPurchase }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [claimedIds, setClaimedIds] = useState([]);

  const filtered = activeCategory === "all" ? benefits : benefits.filter((b) => b.category === activeCategory);

  const handleClaim = (item) => {
    setClaimedIds((ids) => [...ids, item.id]);
    alert(`Benefit at ${item.partner} claimed! Check your email for details.`);
  };

  return (
    <div className="fade-in" style={{ padding: "24px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", marginBottom: 4 }}>Benefits & Promos</h2>
        <p style={{ color: "var(--text-secondary)" }}>Exclusive offers for PRA Members</p>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
        {CATEGORIES.map((c) => {
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                background: isActive ? "var(--navy)" : "var(--bg-elevated)",
                color: isActive ? "white" : "var(--text-secondary)",
                border: `1px solid ${isActive ? "var(--navy)" : "var(--border)"}`,
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {getIcon(c.iconId, 16)} {c.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((item) => {
          const finalPrice = calcFinal(item);
          const claimed = claimedIds.includes(item.id);
          return (
            <div key={item.id} className="card benefit-card">
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--orange)" }}>
                    {getIcon(item.iconId, 24)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: "var(--orange)", fontWeight: 600 }}>{item.partner}</div>
                  </div>
                </div>

                <Tag>{item.tag}</Tag>
                <div style={{ marginTop: 12, marginBottom: 16, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.description}</div>

                {item.originalPrice && (
                  <div style={{ background: "var(--bg-surface)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Original Price</span>
                      <span style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "line-through" }}>{fmt(item.originalPrice)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid var(--border)`, paddingTop: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>Your Price</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "var(--orange)" }}>
                        {item.fixedPrice ? fmt(item.fixedPrice) : fmt(finalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {item.type === "purchase" ? (
                  <button className="btn-primary" style={{ width: "100%" }} onClick={() => onPurchase(item)}>
                    <ShoppingCart size={18} /> Purchase Voucher
                  </button>
                ) : (
                  <button className="btn-claim" style={{ width: "100%", opacity: claimed ? 0.7 : 1 }} onClick={() => !claimed && handleClaim(item)} disabled={claimed}>
                    {claimed ? <><CheckCircle2 size={18} /> Claimed</> : <><Hand size={18} /> Claim Benefit</>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CHECKOUT FLOW 

function CheckoutPage({ item, member, onSuccess, onBack }) {
  const [payMethod, setPayMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const finalPrice = calcFinal(item) || item.originalPrice;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess({ item, payMethod, voucher: genVoucher(), amount: finalPrice });
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ padding: "24px 20px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, marginBottom: 24, padding: 0 }}>
        Back to Benefits
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", marginBottom: 24 }}>Secure Voucher</h2>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>Order Summary</h3>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.partner}</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--orange)" }}>{fmt(finalPrice)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Method</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { id: "card", label: "Credit/Debit Card", icon: CreditCard },
            { id: "wallet", label: "E-Wallet", icon: Wallet }
          ].map(pm => (
            <div key={pm.id} onClick={() => setPayMethod(pm.id)} className={`payment-option ${payMethod === pm.id ? 'selected' : ''}`} style={{ border: `2px solid ${payMethod === pm.id ? 'var(--orange)' : 'var(--border)'}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <pm.icon size={20} color={payMethod === pm.id ? 'var(--orange)' : 'var(--text-muted)'} />
              <div style={{ fontWeight: 600 }}>{pm.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%", minHeight: 56 }} onClick={handlePay} disabled={processing}>
        {processing ? <Spinner /> : <><Lock size={18} /> Confirm Payment</>}
      </button>
    </div>
  );
}

function PaymentSuccess({ result, onDone }) {
  return (
    <div className="fade-in" style={{ padding: "32px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-light)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <CheckCircle2 size={32} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>Payment Successful</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Your voucher has been confirmed.</p>

      <div className="card" style={{ padding: 24, marginBottom: 32, border: "2px solid var(--orange)" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Voucher Code</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--orange)", fontFamily: "monospace", letterSpacing: 2, marginBottom: 24 }}>{result.voucher}</div>
        
        <div style={{ background: "var(--bg-surface)", borderRadius: 8, padding: 16, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Amount Paid</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(result.amount)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Item</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{result.item.title}</span>
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%", marginBottom: 12 }} onClick={() => window.print()}><Printer size={18} /> Print Voucher</button>
      <button className="btn-secondary" style={{ width: "100%" }} onClick={onDone}>Back to Home</button>
    </div>
  );
}

// PROFILE PAGE 

function ProfilePage({ member, onToggleAdmin }) {
  return (
    <div className="fade-in" style={{ padding: "24px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", marginBottom: 24 }}>My Profile</h2>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--orange)", fontSize: 20, fontWeight: 700 }}>
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{member.firstName} {member.lastName}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{member.email}</div>
          </div>
        </div>

        <button className="btn-secondary" style={{ width: "100%", color: "var(--navy)" }} onClick={onToggleAdmin}>
          <Shield size={18} /> Switch to Admin Demo
        </button>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Card Details</h3>
      <PRACard member={member} />
    </div>
  );
}

// ADMIN DASHBOARD

function AdminDashboard({ benefits, onToggleAdmin, onAddPromo }) {
  const [view, setView] = useState("overview");

  return (
    <div className="fade-in" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Libre Baskerville', serif" }}>Admin Portal</h2>
        <button onClick={onToggleAdmin} style={{ background: "var(--navy)", color: "white", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>
          Switch to Member
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}>
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "users", label: "Members", icon: Users },
          { id: "promos", label: "Promos", icon: Gift },
          { id: "transactions", label: "Transactions", icon: FileText }
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{ background: view === t.id ? "var(--orange-pale)" : "transparent", color: view === t.id ? "var(--orange)" : "var(--text-secondary)", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--orange)" }}>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Total Members</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{MOCK_USERS.length}</div>
          </div>
          <div className="card" style={{ padding: 20, borderLeft: "4px solid var(--navy)" }}>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Active Promos</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{benefits.length}</div>
          </div>
        </div>
      )}

      {view === "users" && (
        <div className="card">
          {MOCK_USERS.map(u => (
            <div key={u.id} style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{u.email}</div>
              </div>
              <Tag color={u.status === "Active" ? "green" : "orange"}>{u.status}</Tag>
            </div>
          ))}
        </div>
      )}

      {view === "promos" && (
        <>
          <button className="btn-primary" style={{ marginBottom: 16, width: "100%" }} onClick={() => {
            const title = prompt("Enter Promo Title");
            if(title) onAddPromo(title);
          }}><Plus size={18} /> Add New Promo</button>
          <div className="card">
            {benefits.map(b => (
              <div key={b.id} style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{b.partner}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "transactions" && (
        <div className="card">
          {MOCK_TRANSACTIONS.map(tx => (
            <div key={tx.id} style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{tx.user}</span>
                <span style={{ fontWeight: 700, color: "var(--orange)" }}>{fmt(tx.amount)}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{tx.item} | {tx.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// NAVIGATION BAR 

function NavBar({ active, onNavigate, theme, onToggleTheme, isAdmin }) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "benefits", label: "Benefits", icon: Gift },
    { id: "profile", label: "Account", icon: User },
  ];

  return (
    <>
      <div style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "var(--orange)", borderRadius: 8, padding: "6px 10px", fontWeight: 800, fontSize: 14, color: "white", letterSpacing: 1 }}>PRA</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{isAdmin ? "Admin Portal" : "Senior Benefits"}</div>
        </div>
        <button onClick={onToggleTheme} style={{ background: "none", border: "none", color: "var(--text-primary)" }}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {!isAdmin && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg-elevated)", borderTop: "1px solid var(--border)", display: "flex", zIndex: 100 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              style={{
                flex: 1, background: "none", border: "none", padding: "12px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                color: active === t.id ? "var(--orange)" : "var(--text-muted)",
              }}
            >
              <t.icon size={22} strokeWidth={active === t.id ? 2.5 : 2} />
              <span style={{ fontSize: 11, fontWeight: active === t.id ? 700 : 500 }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// MAIN APP 

export default function App() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("register");
  const [member, setMember] = useState(null);
  const [benefits, setBenefits] = useState(INITIAL_BENEFITS);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [benefitCategory, setBenefitCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  const handleRegistered = (data) => {
    setMember(data);
    setView("dashboard");
  };

  const handleNavigate = (page, cat = "all") => {
    setBenefitCategory(cat);
    setView(page);
    window.scrollTo(0, 0);
  };

  const handlePurchase = (item) => {
    setSelectedBenefit(item);
    setView("checkout");
    window.scrollTo(0, 0);
  };

  const handleAddPromo = (title) => {
    const newPromo = {
      id: "promo-" + Date.now(),
      category: "entertainment",
      categoryLabel: "Custom Promo",
      title: title,
      partner: "New Partner",
      location: "Nationwide",
      description: "Added by admin.",
      originalPrice: 1000,
      discountPct: 10,
      tag: "New",
      iconId: "ticket",
      type: "purchase",
      voucherValidity: "Valid until end of year",
    };
    setBenefits([newPromo, ...benefits]);
  };

  return (
    <>
      <style>{globalStyle}</style>

      {view === "register" && !isAdmin && <RegistrationPage onComplete={handleRegistered} />}

      {(view !== "register" || isAdmin) && member && (
        <div style={{ paddingBottom: isAdmin ? 20 : 80 }}>
          <NavBar active={["checkout", "success"].includes(view) ? "benefits" : view} onNavigate={handleNavigate} theme={theme} onToggleTheme={toggleTheme} isAdmin={isAdmin} />

          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {isAdmin ? (
              <AdminDashboard benefits={benefits} onToggleAdmin={() => setIsAdmin(false)} onAddPromo={handleAddPromo} />
            ) : (
              <>
                {view === "dashboard" && <Dashboard member={member} benefits={benefits} onNavigate={handleNavigate} />}
                {view === "benefits" && <BenefitsHub benefits={benefits} initialCategory={benefitCategory} onPurchase={handlePurchase} />}
                {view === "checkout" && selectedBenefit && <CheckoutPage item={selectedBenefit} member={member} onSuccess={(res) => { setSuccessResult(res); setView("success"); }} onBack={() => setView("benefits")} />}
                {view === "success" && successResult && <PaymentSuccess result={successResult} onDone={() => setView("benefits")} />}
                {view === "profile" && <ProfilePage member={member} onToggleAdmin={() => setIsAdmin(true)} />}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}