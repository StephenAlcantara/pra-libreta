import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    id: "med-city",
    category: "health",
    categoryLabel: "Health & Wellness",
    title: "Executive Check-up Package",
    partner: "The Medical City",
    location: "Ortigas Center, Pasig City",
    description:
      "Comprehensive executive medical check-up including CBC, urinalysis, chest X-ray, ECG, and consultation with an internist. Book at any The Medical City branch nationwide.",
    originalPrice: 8500,
    discountPct: 20,
    tag: "20% off for PRA Members",
    icon: "🏥",
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
    description:
      "Extra 5% discount on top of the standard 20% senior citizen discount on all maintenance medications. Present your PRA Senior Benefits Card upon purchase.",
    originalPrice: null,
    discountPct: 5,
    tag: "Extra 5% on senior discount",
    icon: "💊",
    type: "claim",
    voucherValidity: "Ongoing benefit – no expiry",
  },
  {
    id: "henann",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Staycation Package – 3D2N",
    partner: "Henann Resort Boracay",
    location: "White Beach, Boracay Island",
    description:
      "Exclusive retiree off-season rate: 3 days, 2 nights in a Deluxe Sea View Room, daily breakfast for 2, complimentary airport transfer, and access to all resort amenities.",
    originalPrice: 22000,
    discountPct: 30,
    tag: "Exclusive retiree off-season rate",
    icon: "🏝️",
    type: "purchase",
    voucherValidity: "Valid for bookings until March 31, 2026",
  },
  {
    id: "cebupac",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Domestic Flight – Zero Booking Fee",
    partner: "Cebu Pacific",
    location: "All domestic routes",
    description:
      "Book any Cebu Pacific domestic flight with zero booking convenience fees. Available on cebu-air.com and all Cebu Pacific ticketing offices when you present your PRA ID.",
    originalPrice: null,
    discountPct: null,
    tag: "Zero booking fees for retirees",
    icon: "✈️",
    type: "claim",
    voucherValidity: "Valid for travel dates within 2025",
  },
  {
    id: "maxs",
    category: "dining",
    categoryLabel: "Food & Dining",
    title: "Grandparent's Weekend Feast",
    partner: "Max's Restaurant",
    location: "All branches – dine-in & delivery",
    description:
      "Bring the family every Saturday and Sunday! Enjoy a free appetizer (Spring Roll platter) with any main course order, plus free delivery within 5km radius. Valid for tables of 2 or more.",
    originalPrice: 680,
    discountPct: 15,
    tag: "Free appetizer + free delivery",
    icon: "🍽️",
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
    description:
      "Watch any movie on any weekday before 5:00 PM for only PhP 100 flat rate. No blackout dates, valid for all regular screenings. Not valid for 3D, IMAX, or special screenings.",
    originalPrice: 350,
    discountPct: null,
    fixedPrice: 100,
    tag: "₱100 flat rate before 5 PM",
    icon: "🎬",
    type: "purchase",
    voucherValidity: "Valid Jan–Dec 2025, weekdays only",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Benefits", icon: "✦" },
  { id: "health", label: "Health & Wellness", icon: "🏥" },
  { id: "travel", label: "Travel & Hotels", icon: "✈️" },
  { id: "dining", label: "Food & Dining", icon: "🍽️" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  "₱" +
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

// ─── STYLES ──────────────────────────────────────────────────────────────────
const C = {
  navy: "#0A2540",
  navyLight: "#163A5F",
  navyMid: "#1E4D7B",
  orange: "#FF8C00",
  orangeLight: "#FFA733",
  orangePale: "#FFF5E6",
  white: "#FFFFFF",
  gray50: "#F8F9FA",
  gray100: "#F0F2F5",
  gray200: "#E4E8EE",
  gray400: "#9AA5B4",
  gray600: "#4A5568",
  gray700: "#2D3748",
  green: "#1A7A4A",
  greenLight: "#E6F4EC",
  red: "#C0392B",
  redLight: "#FDECEA",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
  
  :root {
    --bg-main: #F0F2F5;
    --bg-card: #FFFFFF;
    --text-main: #2D3748;
    --text-muted: #4A5568;
    --border-color: #E4E8EE;
    --bg-input: #FFFFFF;
  }
  
  [data-theme="dark"] {
    --bg-main: #0B0F19;
    --bg-card: #161F30;
    --text-main: #F8FAFC;
    --text-muted: #94A3B8;
    --border-color: #2E3F5B;
    --bg-input: #1E293B;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: var(--bg-main); color: var(--text-main); transition: background 0.3s, color 0.3s; }
  input, select, textarea { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }

  .fade-in { animation: fadeIn 0.45s ease both; }
  .slide-up { animation: slideUp 0.5s ease both; }
  .spin { animation: spin 1s linear infinite; }

  .btn-primary {
    background: ${C.orange};
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    padding: 16px 32px;
    min-height: 56px;
    transition: background 0.2s, transform 0.1s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: ${C.orangeLight}; }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: ${C.gray400}; cursor: not-allowed; }

  .btn-secondary {
    background: transparent;
    color: ${C.navyMid};
    border: 2px solid ${C.navyMid};
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    padding: 14px 28px;
    min-height: 52px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-secondary:hover { background: ${C.navyMid}; color: white; }

  .btn-claim {
    background: ${C.greenLight};
    color: ${C.green};
    border: 2px solid ${C.green};
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 24px;
    min-height: 52px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-claim:hover { background: ${C.green}; color: white; }

  .form-input {
    width: 100%;
    padding: 14px 18px;
    font-size: 17px;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-input);
    color: var(--text-main);
    transition: border-color 0.2s, background 0.2s;
    min-height: 52px;
  }
  .form-input:focus { outline: none; border-color: ${C.orange}; box-shadow: 0 0 0 3px rgba(255,140,0,0.15); }
  .form-input.error { border-color: ${C.red}; }
  .form-label { font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; display: block; }
  .form-error { font-size: 14px; color: ${C.red}; margin-top: 6px; font-weight: 500; }
  .form-hint { font-size: 14px; color: var(--text-muted); margin-top: 6px; }

  .card {
    background: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,30,0.05);
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition: background 0.3s, border-color 0.3s;
  }

  .nav-link {
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
    background: none;
    border: none;
  }
  .nav-link:hover, .nav-link.active { color: white; background: rgba(255,255,255,0.15); }

  .benefit-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(10,37,64,0.12); }
  .benefit-card { transition: transform 0.2s, box-shadow 0.2s; }

  .payment-option { transition: all 0.2s; cursor: pointer; }
  .payment-option:hover { border-color: ${C.orange} !important; background: ${C.orangePale} !important; }
  .payment-option.selected { border-color: ${C.orange} !important; background: ${C.orangePale} !important; box-shadow: 0 0 0 3px rgba(255,140,0,0.2); }
`;

// ─── EMBEDDED SVG PRIVILEGE ICONS ──────────────────────────────────────────────
function Sun({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function Moon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

function ChevronLeft({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function ChevronRight({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function Bell({ size = 20, style }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}

function Search({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function Shield({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function Trash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
    </svg>
  );
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
function Spinner({ size = 28, color = "white" }) {
  return (
    <div
      className="spin"
      style={{
        width: size,
        height: size,
        border: `3px solid rgba(255,255,255,0.3)`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
      }}
    />
  );
}

function Tag({ children, color = "orange" }) {
  const bg = color === "orange" ? C.orangePale : C.greenLight;
  const text = color === "orange" ? C.orange : C.green;
  return (
    <span
      style={{
        background: bg,
        color: text,
        fontSize: 13,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 20,
        display: "inline-block",
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, background: i < step ? C.orange : "var(--border-color)", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

function PRACard({ member }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.navyLight} 100%)`,
        borderRadius: 20,
        padding: "28px 28px 24px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        maxWidth: 380,
        width: "100%",
        boxShadow: "0 8px 32px rgba(10,37,64,0.35)",
      }}
    >
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", bottom: -40, right: 20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,140,0,0.08)" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>Republic of the Philippines</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2, color: C.orangeLight }}>Philippine Retirement Authority</div>
        </div>
        <div style={{ background: C.orange, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "white" }}>PRA</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Senior Benefits Card</div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", letterSpacing: 0.5 }}>
          {member.firstName} {member.lastName}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>PRA ID Number</div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>{member.praId}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Valid Until</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>12/2027</div>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTRATION FLOW ───────────────────────────────────────────────────────
function RegistrationPage({ onComplete }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", province: "", city: "", barangay: "", street: "", mobile: "",
    praId: "", seniorId: "", email: "", password: "", confirmPassword: "",
  });

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.dob) { e.dob = "Date of birth is required."; }
    else {
      const age = Math.floor((Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25));
      if (age < 60) e.dob = `You must be at least 60 years old to register. Calculated age: ${age}.`;
    }
    if (!form.province.trim()) e.province = "Province is required.";
    if (!form.city.trim()) e.city = "City/Municipality is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g, "")))
      e.mobile = "Enter a valid Philippine mobile number (e.g. 09171234567).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.praId.trim()) e.praId = "PRA ID Number is required.";
    else if (form.praId.trim().length < 6) e.praId = "PRA ID must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
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

  const STEPS = ["Personal Details", "PRA Information", "Account Setup"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.navy, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ background: C.orange, borderRadius: 10, padding: "8px 12px", fontWeight: 800, fontSize: 16, color: "white", letterSpacing: 1 }}>PRA</div>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 17 }}>Philippine Retirement Authority</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Senior Benefits Platform</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px 48px" }}>
        <div style={{ width: "100%", maxWidth: 560 }} className="fade-in">
          <div className="card" style={{ padding: "28px 28px 0", marginBottom: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 4, fontFamily: "'Libre Baskerville', serif" }}>
                {STEPS[step - 1]}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 16 }}>Step {step} of 3</div>
            </div>
            <ProgressBar step={step} total={3} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingBottom: 20 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: i + 1 <= step ? 700 : 400, color: i + 1 <= step ? C.orange : "var(--text-muted)" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="card fade-in" style={{ padding: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="form-label">First Name</label>
                  <input className={`form-input${errors.firstName ? " error" : ""}`} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Maria" />
                  {errors.firstName && <div className="form-error">⚠ {errors.firstName}</div>}
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input className={`form-input${errors.lastName ? " error" : ""}`} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Santos" />
                  {errors.lastName && <div className="form-error">⚠ {errors.lastName}</div>}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" className={`form-input${errors.dob ? " error" : ""}`} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                {errors.dob && <div className="form-error">⚠ {errors.dob}</div>}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Province</label>
                <input className={`form-input${errors.province ? " error" : ""}`} value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="Metro Manila" />
                {errors.province && <div className="form-error">⚠ {errors.province}</div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="form-label">City / Municipality</label>
                  <input className={`form-input${errors.city ? " error" : ""}`} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Makati City" />
                  {errors.city && <div className="form-error">⚠ {errors.city}</div>}
                </div>
                <div>
                  <label className="form-label">Barangay</label>
                  <input className="form-input" value={form.barangay} onChange={(e) => set("barangay", e.target.value)} placeholder="Bel-Air" />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Mobile Number</label>
                <input className={`form-input${errors.mobile ? " error" : ""}`} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="09171234567" maxLength={11} />
                {errors.mobile && <div className="form-error">⚠ {errors.mobile}</div>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card fade-in" style={{ padding: 28 }}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">PRA ID Number *</label>
                <input className={`form-input${errors.praId ? " error" : ""}`} value={form.praId} onChange={(e) => set("praId", e.target.value)} placeholder="SRRV-2024-123456" />
                {errors.praId && <div className="form-error">⚠ {errors.praId}</div>}
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="form-label">Senior Citizen ID Number (Optional)</label>
                <input className="form-input" value={form.seniorId} onChange={(e) => set("seniorId", e.target.value)} placeholder="OSCA-456789" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card fade-in" style={{ padding: 28 }}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Email Address</label>
                <input type="email" className={`form-input${errors.email ? " error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" />
                {errors.email && <div className="form-error">⚠ {errors.email}</div>}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Password</label>
                <input type="password" className={`form-input${errors.password ? " error" : ""}`} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimum 8 characters" />
                {errors.password && <div className="form-error">⚠ {errors.password}</div>}
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="form-label">Confirm Password</label>
                <input type="password" className={`form-input${errors.confirmPassword ? " error" : ""}`} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter password" />
                {errors.confirmPassword && <div className="form-error">⚠ {errors.confirmPassword}</div>}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, gap: 12 }}>
            {step > 1 ? (
              <button className="btn-secondary" onClick={() => setStep((s) => s - 1)} style={{ minWidth: 120 }}>← Back</button>
            ) : <div />}
            <button className="btn-primary" onClick={nextStep} style={{ minWidth: 200, flex: step === 1 ? 1 : "auto" }}>
              {step < 3 ? "Continue →" : "✅ Complete Registration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ member, onNavigate, benefits, announcements }) {
  const featuredItems = benefits.filter(b => b.originalPrice && b.discountPct);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (featuredItems.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };
  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const currentSlide = featuredItems[carouselIndex];

  const quickLinks = [
    { label: "Health & Wellness", icon: "🏥", cat: "health", color: "rgba(232,244,248,0.15)" },
    { label: "Travel & Hotels", icon: "✈️", cat: "travel", color: "rgba(255,243,224,0.15)" },
    { label: "Food & Dining", icon: "🍽️", cat: "dining", color: "rgba(240,255,244,0.15)" },
    { label: "Entertainment", icon: "🎬", cat: "entertainment", color: "rgba(243,232,255,0.15)" },
  ];

  return (
    <div className="fade-in" style={{ padding: "8px 0" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-main)", marginBottom: 4, fontFamily: "'Libre Baskerville', serif" }}>
          Welcome back, {member.firstName}!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>PRA Retiree Member Code: <strong>{member.praId}</strong></p>
      </div>

      {/* Featured Carousel Banner */}
      {currentSlide && (
        <>
          <div className="card" style={{ position: "relative", borderLeft: `6px solid ${C.orange}`, padding: 24, minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <Tag color="orange">{currentSlide.tag}</Tag>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Featured Deal</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6, paddingRight: 80 }}>{currentSlide.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.4 }}>{currentSlide.description}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.orange }}>{fmt(calcFinal(currentSlide))}</span>
                <span style={{ fontSize: 13, textDecoration: "line-through", color: "var(--text-muted)", marginLeft: 8 }}>{fmt(currentSlide.originalPrice)}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handlePrevSlide} style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={16} /></button>
                <button onClick={handleNextSlide} style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
          {/* Carousel Indicator Dots */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: -6, marginBottom: 24 }}>
            {featuredItems.map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: idx === carouselIndex ? C.orange : "var(--border-color)", transition: "background-color 0.2s" }} />
            ))}
          </div>
        </>
      )}

      {/* Announcements Block */}
      <div className="card" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Bell size={20} style={{ color: C.orange }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Libre Baskerville', serif" }}>Official Notices</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {announcements.map((ann, idx) => (
            <div key={ann.id} style={{ paddingBottom: idx === announcements.length - 1 ? 0 : 12, borderBottom: idx === announcements.length - 1 ? "none" : "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{ann.title}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{ann.date}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.4 }}>{ann.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Categories */}
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, fontFamily: "'Libre Baskerville', serif" }}>Explore Privileges</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {quickLinks.map((link, idx) => (
          <div key={idx} className="card benefit-card" onClick={() => onNavigate("benefits", link.cat)} style={{ padding: 20, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", background: "var(--bg-card)" }}>
            <span style={{ fontSize: 28, background: link.color, padding: 8, borderRadius: 12 }}>{link.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{link.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BENEFITS HUB ────────────────────────────────────────────────────────────
function BenefitsHub({ member, initialCategory, onPurchase, benefits }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");

  const filtered = benefits.filter((b) => {
    const matchesCat = activeCategory === "all" || b.category === activeCategory;
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.partner.toLowerCase().includes(search.toLowerCase()) ||
                          b.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, fontFamily: "'Libre Baskerville', serif" }}>Privileges & Vouchers</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Discover live partner offers valid for your account.</p>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
          <Search size={18} />
        </div>
        <input className="form-input" style={{ paddingLeft: 46 }} placeholder="Search medical networks, hotels, food hubs..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "8px 16px", borderRadius: 20, border: "none", whiteSpace: "nowrap", fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: activeCategory === cat.id ? C.orange : "var(--bg-card)",
              color: activeCategory === cat.id ? "white" : "var(--text-main)",
              border: `1px solid ${activeCategory === cat.id ? C.orange : "var(--border-color)"}`,
              transition: "all 0.2s"
            }}
          >
            <span style={{ marginRight: 6 }}>{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map(item => {
          const finalPrice = calcFinal(item);
          return (
            <div key={item.id} className="card benefit-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 30 }}>{item.icon}</span>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.partner} • {item.location}</p>
                  </div>
                </div>
                <Tag color={item.type === "purchase" ? "orange" : "green"}>{item.tag}</Tag>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.45, marginBottom: 16 }}>{item.description}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
                <div>
                  {item.type === "purchase" ? (
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: C.orange }}>{fmt(finalPrice)}</div>
                      {item.originalPrice && <div style={{ fontSize: 12, textDecoration: "line-through", color: "var(--text-muted)" }}>Original: {fmt(item.originalPrice)}</div>}
                    </div>
                  ) : <div style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>Complimentary Claim</div>}
                </div>
                <button className={item.type === "purchase" ? "btn-primary" : "btn-claim"} style={{ minHeight: 38, height: 38, padding: "0 16px", fontSize: 14, borderRadius: 8 }} onClick={() => onPurchase(item)}>
                  {item.type === "purchase" ? "Secure Pass" : "Claim Code"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ───────────────────────────────────────────────────────────
function CheckoutPage({ item, member, onSuccess, onBack }) {
  const [method, setMethod] = useState("gcash");
  const [loading, setLoading] = useState(false);
  const finalPrice = calcFinal(item);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({ voucherCode: genVoucher(), item, method, date: new Date().toLocaleString("en-PH"), amount: finalPrice || 0 });
    }, 1500);
  };

  return (
    <div className="card fade-in" style={{ padding: 24 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.orange, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
        ← Back to Privileges
      </button>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, fontFamily: "'Libre Baskerville', serif" }}>Checkout Authorization</h2>
      
      <div style={{ display: "flex", gap: 12, padding: 14, background: "rgba(0,0,0,0.02)", borderRadius: 12, marginBottom: 20, border: "1px solid var(--border-color)" }}>
        <span style={{ fontSize: 28 }}>{item.icon}</span>
        <div>
          <div style={{ fontWeight: 700 }}>{item.title}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Partner: {item.partner}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Select Payment Mode</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className={`payment-option ${method === "gcash" ? "selected" : ""}`} onClick={() => setMethod("gcash")} style={{ display: "flex", justifyContent: "space-between", padding: 12, border: "2px solid var(--border-color)", borderRadius: 12, background: "var(--bg-card)" }}>
            <span style={{ fontWeight: 600, color: "#005CE6" }}>GCash Wallet</span>
            <input type="radio" checked={method === "gcash"} readOnly />
          </div>
          <div className={`payment-option ${method === "maya" ? "selected" : ""}`} onClick={() => setMethod("maya")} style={{ display: "flex", justifyContent: "space-between", padding: 12, border: "2px solid var(--border-color)", borderRadius: 12, background: "var(--bg-card)" }}>
            <span style={{ fontWeight: 600, color: "#00E676" }}>Maya Gateway</span>
            <input type="radio" checked={method === "maya"} readOnly />
          </div>
        </div>
      </div>

      <div style={{ borderTop: "2px dashed var(--border-color)", paddingTop: 14, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
          <span style={{ color: "var(--text-muted)" }}>Standard Price</span>
          <span>{item.originalPrice ? fmt(item.originalPrice) : "₱0.00"}</span>
        </div>
        {item.discountPct && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14, color: C.green }}>
            <span>PRA Member Discount (-{item.discountPct}%)</span>
            <span>-{fmt(item.originalPrice - finalPrice)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, marginTop: 10 }}>
          <span>Total Payable</span>
          <span>{finalPrice ? fmt(finalPrice) : "₱0.00"}</span>
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%" }} onClick={handlePay} disabled={loading}>
        {loading ? <Spinner /> : `Verify Secure Authorization`}
      </button>
    </div>
  );
}

// ─── PAYMENT SUCCESS ─────────────────────────────────────────────────────────
function PaymentSuccess({ result, member, onDone }) {
  return (
    <div className="card fade-in" style={{ padding: 32, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.greenLight, color: C.green, display: "flex", alignItems: "center", margin: "0 auto 16px", fontSize: 26, justifyContent: "center" }}>✓</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.green, marginBottom: 4, fontFamily: "'Libre Baskerville', serif" }}>Voucher Activated!</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>Present this reference code to the partner merchant establishment.</p>

      <div style={{ background: "rgba(0,0,0,0.02)", borderRadius: 12, padding: 16, marginBottom: 24, border: "1px solid var(--border-color)", textAlign: "left" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Active Voucher Code</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1.5, color: C.navy, fontFamily: "monospace" }}>{result.voucherCode}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>Benefit Offer</span><span style={{ fontWeight: 600 }}>{result.item.title}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>Merchant</span><span style={{ fontWeight: 600 }}>{result.item.partner}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-muted)" }}>Authorized Holder</span><span style={{ fontWeight: 600 }}>{member.firstName} {member.lastName}</span></div>
        </div>
      </div>
      <button className="btn-primary" style={{ width: "100%" }} onClick={onDone}>Return to Home Dashboard</button>
    </div>
  );
}

// ─── PROFILE PAGE ────────────────────────────────────────────────────────────
function ProfilePage({ member }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <PRACard member={member} />
      <div className="card" style={{ width: "100%", padding: 20 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, borderBottom: "1px solid var(--border-color)", paddingBottom: 6 }}>Retiree Membership Account</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}><span style={{ color: "var(--text-muted)" }}>Full Name:</span><span style={{ fontWeight: 600 }}>{member.firstName} {member.lastName}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}><span style={{ color: "var(--text-muted)" }}>PRA Code:</span><span style={{ fontWeight: 600 }}>{member.praId}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}><span style={{ color: "var(--text-muted)" }}>Calculated Age:</span><span style={{ fontWeight: 600 }}>{member.age} years old</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}><span style={{ color: "var(--text-muted)" }}>Mobile Link:</span><span style={{ fontWeight: 600 }}>{member.mobile}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}><span style={{ color: "var(--text-muted)" }}>Location:</span><span style={{ fontWeight: 600 }}>{member.city}, {member.province}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN CONSOLE ───────────────────────────────────────────────────────────
function AdminConsole({ benefits, setBenefits, announcements, setAnnouncements }) {
  const [bTitle, setBTitle] = useState("");
  const [bPartner, setBPartner] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bPrice, setBPrice] = useState("");
  const [bDisc, setBDisc] = useState("");
  const [bCat, setBCat] = useState("health");
  const [bTag, setBTag] = useState("");
  
  const [aTitle, setATitle] = useState("");
  const [aContent, setAContent] = useState("");

  const handleAddBenefit = (e) => {
    e.preventDefault();
    if (!bTitle || !bPartner) return;
    const newB = {
      id: "custom-" + Date.now(),
      category: bCat,
      categoryLabel: bCat.charAt(0).toUpperCase() + bCat.slice(1),
      title: bTitle,
      partner: bPartner,
      location: "Nationwide Offers",
      description: bDesc,
      originalPrice: bPrice ? Number(bPrice) : null,
      discountPct: bDisc ? Number(bDisc) : null,
      tag: bTag || `${bDisc}% Off Partner Rate`,
      icon: bCat === "health" ? "🏥" : bCat === "travel" ? "✈️" : bCat === "dining" ? "🍽️" : "🎬",
      type: bPrice ? "purchase" : "claim",
      voucherValidity: "Ongoing Active Offer"
    };
    setBenefits([newB, ...benefits]);
    setBTitle(""); setBPartner(""); setBDesc(""); setBPrice(""); setBDisc(""); setBTag("");
    alert("New benefit published to hub!");
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!aTitle || !aContent) return;
    const newA = {
      id: Date.now(),
      title: aTitle,
      content: aContent,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };
    setAnnouncements([newA, ...announcements]);
    setATitle(""); setAContent("");
    alert("Notice broadcast live to members!");
  };

  const handleDeleteBenefit = (id) => {
    if(window.confirm("Archive this voucher offer?")) {
      setBenefits(benefits.filter(b => b.id !== id));
    }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, fontFamily: "'Libre Baskerville', serif" }}>PRA Admin Terminal</h2>
      
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Broadcast Live Notice</h3>
        <form onSubmit={handleAddAnnouncement}>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Notice Header</label>
            <input className="form-input" value={aTitle} onChange={e => setATitle(e.target.value)} placeholder="System Upgrades Notice" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Description Body</label>
            <textarea className="form-input" style={{ minHeight: 64, resize: "none" }} value={aContent} onChange={e => setAContent(e.target.value)} placeholder="Enter instructions for retirees..." />
          </div>
          <button type="submit" className="btn-primary" style={{ minHeight: 40, height: 40, padding: "0 16px", fontSize: 14 }}>Publish Notice</button>
        </form>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Inject New Benefit Voucher</h3>
        <form onSubmit={handleAddBenefit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label className="form-label">Offer Title</label>
              <input className="form-input" value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="Free Dental Check" />
            </div>
            <div>
              <label className="form-label">Partner Brand</label>
              <input className="form-input" value={bPartner} onChange={e => setBPartner(e.target.value)} placeholder="Healthway Medical" />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Voucher Group</label>
            <select className="form-input" value={bCat} onChange={e => setBCat(e.target.value)}>
              <option value="health">Health & Wellness</option>
              <option value="travel">Travel & Hotels</option>
              <option value="dining">Food & Dining</option>
              <option value="entertainment">Entertainment & Leisure</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label className="form-label">Base Rate (₱)</label>
              <input className="form-input" value={bPrice} onChange={e => setBPrice(e.target.value)} placeholder="1200" />
            </div>
            <div>
              <label className="form-label">Discount (%)</label>
              <input className="form-input" value={bDisc} onChange={e => setBDisc(e.target.value)} placeholder="20" />
            </div>
            <div>
              <label className="form-label">Badge Tag</label>
              <input className="form-input" value={bTag} onChange={e => setBTag(e.target.value)} placeholder="Special Privilege" />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Voucher Details</label>
            <textarea className="form-input" style={{ minHeight: 64, resize: "none" }} value={bDesc} onChange={e => setBDesc(e.target.value)} placeholder="Enter package terms..." />
          </div>
          <button type="submit" className="btn-primary" style={{ minHeight: 40, height: 40, padding: "0 16px", fontSize: 14 }}>Inject Offer</button>
        </form>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Live Catalog ({benefits.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {benefits.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 8, border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.01)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.partner} • {b.categoryLabel}</div>
              </div>
              <button onClick={() => handleDeleteBenefit(b.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 4 }}><Trash size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
function NavBar({ active, onNavigate, memberName, theme, onToggleTheme }) {
  return (
    <div style={{ background: C.navy, color: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: C.orange, borderRadius: 6, padding: "4px 8px", fontWeight: 800, fontSize: 13 }}>PRA</div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>Hub</span>
        </div>
        
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button className={`nav-link ${active === "dashboard" ? "active" : ""}`} onClick={() => onNavigate("dashboard")}>Home</button>
          <button className={`nav-link ${active === "benefits" ? "active" : ""}`} onClick={() => onNavigate("benefits")}>Offers</button>
          <button className={`nav-link ${active === "profile" ? "active" : ""}`} onClick={() => onNavigate("profile")}>ID</button>
          <button className={`nav-link ${active === "admin" ? "active" : ""}`} onClick={() => onNavigate("admin")} style={{ display: "flex", alignItems: "center", gap: 4, color: C.orangeLight }}>
            <Shield size={14} />Admin
          </button>
          
          <button onClick={onToggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", marginLeft: 4 }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APPLICATION COMPONENT ──────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("register");
  const [member, setMember] = useState(null);
  const [benefitCategory, setBenefitCategory] = useState("all");
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [theme, setTheme] = useState("light");
  
  const [benefits, setBenefits] = useState(BENEFITS);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Annual Validation Reminder", content: "All active SRRV cardholders are advised to complete their validation protocols before the compliance deadline.", date: "May 15" },
    { id: 2, title: "Visayas Health Partnerships", content: "We have updated three premium medical facilities in Cebu offering extra outpatient care privileges.", date: "May 28" }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  const handleRegistered = (data) => {
    setMember(data);
    setView("dashboard");
  };

  const handleNavigate = (destination, category = "all") => {
    setBenefitCategory(category);
    setView(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePurchase = (item) => {
    setSelectedBenefit(item);
    setView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaySuccess = (result) => {
    setSuccessResult(result);
    setView("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{globalStyle}</style>

      {view === "register" && <RegistrationPage onComplete={handleRegistered} />}

      {view !== "register" && member && (
        <div style={{ paddingBottom: 80 }}>
          <NavBar
            active={["checkout", "success"].includes(view) ? "benefits" : view}
            onNavigate={handleNavigate}
            memberName={member.firstName}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px" }}>
            {view === "dashboard" && (
              <Dashboard member={member} onNavigate={handleNavigate} benefits={benefits} announcements={announcements} />
            )}
            {view === "benefits" && (
              <BenefitsHub member={member} initialCategory={benefitCategory} onPurchase={handlePurchase} benefits={benefits} />
            )}
            {view === "checkout" && selectedBenefit && (
              <CheckoutPage item={selectedBenefit} member={member} onSuccess={handlePaySuccess} onBack={() => setView("benefits")} />
            )}
            {view === "success" && successResult && (
              <PaymentSuccess result={successResult} member={member} onDone={() => { setView("benefits"); window.scrollTo({ top: 0 }); }} />
            )}
            {view === "profile" && <ProfilePage member={member} />}
            {view === "admin" && (
              <AdminConsole benefits={benefits} setBenefits={setBenefits} announcements={announcements} setAnnouncements={setAnnouncements} />
            )}
          </div>
        </div>
      )}
    </>
  );
}