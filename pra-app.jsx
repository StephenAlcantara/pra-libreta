import { useState, useEffect, useRef } from "react";
import {
  Heart, Plane, UtensilsCrossed, Film, Star, MapPin, Calendar,
  ChevronRight, ChevronLeft, Search, X, Check, ShoppingCart,
  CreditCard, Smartphone, ArrowLeft, Printer, Bell, Users, Tag as TagIcon,
  LayoutDashboard, Settings, LogOut, ShieldCheck, TrendingUp, Package,
  Plus, Pencil, Trash2, Eye, ReceiptText, UserCircle, Sun, Moon,
  CheckCircle, Lock, Info, ChevronDown, Megaphone, Clock, BarChart2,
  AlertCircle, BadgeCheck, Ticket, Newspaper
} from "lucide-react";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const BENEFITS = [
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
    icon: Heart,
    iconColor: "#e74c3c",
    type: "purchase",
    voucherValidity: "Valid until December 31, 2026",
    active: true,
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
    icon: Heart,
    iconColor: "#e74c3c",
    type: "claim",
    voucherValidity: "Ongoing benefit - no expiry",
    active: true,
  },
  {
    id: "henann",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Staycation Package - 3D2N",
    partner: "Henann Resort Boracay",
    location: "White Beach, Boracay Island",
    description: "Exclusive retiree off-season rate: 3 days, 2 nights in a Deluxe Sea View Room, daily breakfast for 2, complimentary airport transfer, and access to all resort amenities.",
    originalPrice: 22000,
    discountPct: 30,
    tag: "Exclusive retiree off-season rate",
    icon: Plane,
    iconColor: "#3498db",
    type: "purchase",
    voucherValidity: "Valid for bookings until March 31, 2026",
    active: true,
  },
  {
    id: "cebupac",
    category: "travel",
    categoryLabel: "Travel & Hotels",
    title: "Domestic Flight - Zero Booking Fee",
    partner: "Cebu Pacific",
    location: "All domestic routes",
    description: "Book any Cebu Pacific domestic flight with zero booking convenience fees. Available on cebu-air.com and all Cebu Pacific ticketing offices when you present your PRA ID.",
    originalPrice: null,
    discountPct: null,
    tag: "Zero booking fees for retirees",
    icon: Plane,
    iconColor: "#3498db",
    type: "claim",
    voucherValidity: "Valid for travel dates within 2026",
    active: true,
  },
  {
    id: "maxs",
    category: "dining",
    categoryLabel: "Food & Dining",
    title: "Grandparent's Weekend Feast",
    partner: "Max's Restaurant",
    location: "All branches - dine-in and delivery",
    description: "Bring the family every Saturday and Sunday! Enjoy a free appetizer (Spring Roll platter) with any main course order, plus free delivery within 5km radius.",
    originalPrice: 680,
    discountPct: 15,
    tag: "Free appetizer + free delivery",
    icon: UtensilsCrossed,
    iconColor: "#27ae60",
    type: "purchase",
    voucherValidity: "Valid every weekend until Dec 2026",
    active: true,
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
    tag: "PhP 100 flat rate before 5 PM",
    icon: Film,
    iconColor: "#9b59b6",
    type: "purchase",
    voucherValidity: "Valid Jan-Dec 2026, weekdays only",
    active: true,
  },
];

const ANNOUNCEMENTS = [
  {
    id: "ann1",
    title: "New Partner: Robinsons Health Clinics",
    body: "PRA members can now avail of discounted consultations and lab tests at all Robinsons Health Clinics nationwide starting July 2026.",
    date: "June 1, 2026",
    type: "new",
    active: true,
  },
  {
    id: "ann2",
    title: "SRRV Renewal Reminder",
    body: "Members with SRRV expiring before December 2026 are encouraged to begin their renewal process early to avoid service interruptions.",
    date: "May 28, 2026",
    type: "reminder",
    active: true,
  },
  {
    id: "ann3",
    title: "PRA Office Hours Update",
    body: "Our Makati head office will be open on Saturdays from 9:00 AM to 12:00 NN starting June 15, 2026, to accommodate member inquiries.",
    date: "May 20, 2026",
    type: "info",
    active: true,
  },
];

const MOCK_MEMBERS = [
  { id: "m1", firstName: "Maria", lastName: "Santos", email: "maria@example.com", praId: "SRRV-2022-001", age: 68, city: "Makati", province: "Metro Manila", mobile: "09171234567", status: "Active", joinDate: "March 12, 2022" },
  { id: "m2", firstName: "Jose", lastName: "Reyes", email: "jose@example.com", praId: "SRRV-2021-045", age: 72, city: "Cebu City", province: "Cebu", mobile: "09281234567", status: "Active", joinDate: "Jan 5, 2021" },
  { id: "m3", firstName: "Carmen", lastName: "Lim", email: "carmen@example.com", praId: "SRRV-2023-088", age: 65, city: "Davao City", province: "Davao del Sur", mobile: "09391234567", status: "Pending", joinDate: "Nov 18, 2023" },
  { id: "m4", firstName: "Roberto", lastName: "Cruz", email: "roberto@example.com", praId: "SRRV-2020-012", age: 75, city: "Quezon City", province: "Metro Manila", mobile: "09451234567", status: "Active", joinDate: "Feb 22, 2020" },
];

const MOCK_TRANSACTIONS = [
  { id: "t1", member: "Maria Santos", benefit: "Executive Check-up Package", partner: "The Medical City", amount: 6800, method: "GCash", date: "May 30, 2026", voucher: "PRA-XK4L-9P2Q", status: "Completed" },
  { id: "t2", member: "Jose Reyes", benefit: "Staycation Package - 3D2N", partner: "Henann Resort Boracay", amount: 15400, method: "Credit Card", date: "May 28, 2026", voucher: "PRA-BR7M-2N5A", status: "Completed" },
  { id: "t3", member: "Carmen Lim", benefit: "Unlimited Weekday Movie Pass", partner: "SM Cinemas", amount: 100, method: "Maya", date: "May 25, 2026", voucher: "PRA-WT9J-6L3D", status: "Completed" },
  { id: "t4", member: "Roberto Cruz", benefit: "Grandparent's Weekend Feast", partner: "Max's Restaurant", amount: 578, method: "GCash", date: "May 24, 2026", voucher: "PRA-HQ2E-8F7C", status: "Completed" },
];

const CATEGORIES = [
  { id: "all", label: "All Benefits", Icon: Star },
  { id: "health", label: "Health & Wellness", Icon: Heart },
  { id: "travel", label: "Travel & Hotels", Icon: Plane },
  { id: "dining", label: "Food & Dining", Icon: UtensilsCrossed },
  { id: "entertainment", label: "Entertainment", Icon: Film },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────

const fmt = (n) => "PhP " + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcFinal = (item) => {
  if (item.fixedPrice) return item.fixedPrice;
  if (item.originalPrice && item.discountPct) return item.originalPrice * (1 - item.discountPct / 100);
  return null;
};
const genVoucher = () => "PRA-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

// ── THEME ──────────────────────────────────────────────────────────────────────

const getTheme = (dark) => ({
  navy: "#0A2540",
  navyLight: "#163A5F",
  navyMid: "#1E4D7B",
  orange: "#E8730A",
  orangeLight: "#F08030",
  orangePale: dark ? "rgba(232,115,10,0.15)" : "#FFF5E6",
  white: dark ? "#1A1F2E" : "#FFFFFF",
  surface: dark ? "#242938" : "#FFFFFF",
  surfaceAlt: dark ? "#1E2433" : "#F8F9FA",
  border: dark ? "rgba(255,255,255,0.1)" : "#E4E8EE",
  gray50: dark ? "#2A3040" : "#F8F9FA",
  gray100: dark ? "#2A3040" : "#F0F2F5",
  gray200: dark ? "rgba(255,255,255,0.12)" : "#E4E8EE",
  gray400: dark ? "rgba(255,255,255,0.4)" : "#9AA5B4",
  gray600: dark ? "rgba(255,255,255,0.6)" : "#4A5568",
  gray700: dark ? "rgba(255,255,255,0.87)" : "#2D3748",
  green: "#1A7A4A",
  greenLight: dark ? "rgba(26,122,74,0.2)" : "#E6F4EC",
  greenText: "#1A7A4A",
  red: "#C0392B",
  redLight: dark ? "rgba(192,57,43,0.2)" : "#FDECEA",
  bg: dark ? "#141824" : "#FFFFFF",
  text: dark ? "rgba(255,255,255,0.87)" : "#2D3748",
  textSub: dark ? "rgba(255,255,255,0.55)" : "#4A5568",
  isDark: dark,
});

// ── GLOBAL STYLE ───────────────────────────────────────────────────────────────

const makeGlobalStyle = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: ${C.bg}; color: ${C.text}; transition: background 0.3s, color 0.3s; }
  input, select, textarea { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  @keyframes slideLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }

  .fade-in { animation: fadeIn 0.4s ease both; }
  .slide-up { animation: slideUp 0.45s ease both; }
  .spin { animation: spin 1s linear infinite; }
  .pulse { animation: pulse 1.5s ease infinite; }
  .slide-left { animation: slideLeft 0.35s ease both; }

  .btn-primary {
    background: ${C.orange};
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 28px;
    min-height: 52px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(232,115,10,0.25);
  }
  .btn-primary:hover { background: ${C.orangeLight}; box-shadow: 0 4px 14px rgba(232,115,10,0.35); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: ${C.gray400}; cursor: not-allowed; box-shadow: none; }

  .btn-secondary {
    background: transparent;
    color: ${C.navyMid};
    border: 2px solid ${C.navyMid};
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 24px;
    min-height: 48px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-secondary:hover { background: ${C.navyMid}; color: white; }

  .btn-ghost {
    background: transparent;
    color: ${C.gray600};
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 18px;
    min-height: 44px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  }
  .btn-ghost:hover { border-color: ${C.orange}; color: ${C.orange}; background: ${C.orangePale}; }

  .btn-claim {
    background: ${C.greenLight};
    color: ${C.greenText};
    border: 2px solid ${C.greenText};
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    padding: 12px 22px;
    min-height: 48px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  }
  .btn-claim:hover { background: ${C.greenText}; color: white; }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    background: ${C.surface};
    color: ${C.text};
    transition: border-color 0.2s, box-shadow 0.2s;
    min-height: 48px;
  }
  .form-input:focus { outline: none; border-color: ${C.orange}; box-shadow: 0 0 0 3px rgba(232,115,10,0.15); }
  .form-input.error { border-color: ${C.red}; }
  .form-label { font-size: 14px; font-weight: 600; color: ${C.gray700}; margin-bottom: 6px; display: block; }
  .form-error { font-size: 13px; color: ${C.red}; margin-top: 5px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
  .form-hint { font-size: 13px; color: ${C.textSub}; margin-top: 5px; }

  .card {
    background: ${C.surface};
    border-radius: 14px;
    border: 1px solid ${C.border};
    box-shadow: 0 1px 8px rgba(10,37,64,0.06);
    overflow: hidden;
  }

  .benefit-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .benefit-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10,37,64,0.1); border-color: ${C.orange}; }

  .carousel-btn {
    background: ${C.surface};
    border: 1.5px solid ${C.border};
    border-radius: 50%;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .carousel-btn:hover { border-color: ${C.orange}; color: ${C.orange}; background: ${C.orangePale}; }
  .carousel-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.gray200}; border-radius: 6px; }

  @media (max-width: 640px) {
    .btn-primary { font-size: 15px; padding: 13px 20px; }
    .form-input { font-size: 15px; }
  }
`;

// ── SHARED SUBCOMPONENTS ───────────────────────────────────────────────────────

function Spinner({ size = 22, color = "white" }) {
  return (
    <div className="spin" style={{ width: size, height: size, border: `2.5px solid rgba(255,255,255,0.25)`, borderTop: `2.5px solid ${color}`, borderRadius: "50%", flexShrink: 0 }} />
  );
}

function StatusBadge({ children, type = "orange" }) {
  const map = {
    orange: { bg: "rgba(232,115,10,0.12)", text: "#E8730A" },
    green: { bg: "rgba(26,122,74,0.12)", text: "#1A7A4A" },
    blue: { bg: "rgba(30,77,123,0.12)", text: "#1E4D7B" },
    red: { bg: "rgba(192,57,43,0.12)", text: "#C0392B" },
    gray: { bg: "rgba(74,85,104,0.12)", text: "#4A5568" },
  };
  const s = map[type] || map.orange;
  return (
    <span style={{ background: s.bg, color: s.text, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "inline-block", letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < step ? "#E8730A" : "rgba(0,0,0,0.1)", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

function PRACard({ member, C }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.navyLight} 100%)`, borderRadius: 18, padding: "26px 26px 22px", color: "white", position: "relative", overflow: "hidden", maxWidth: 380, width: "100%", boxShadow: "0 8px 28px rgba(10,37,64,0.3)" }}>
      <div style={{ position: "absolute", top: -28, right: -28, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", bottom: -36, right: 16, width: 150, height: 150, borderRadius: "50%", background: "rgba(232,115,10,0.08)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase" }}>Republic of the Philippines</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: "#F08030" }}>Philippine Retirement Authority</div>
        </div>
        <div style={{ background: "#E8730A", borderRadius: 7, padding: "5px 9px", fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "white" }}>PRA</div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 3 }}>Senior Benefits Card</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", letterSpacing: 0.3 }}>{member.firstName} {member.lastName}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>PRA ID Number</div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>{member.praId}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>Valid Until</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>12/2027</div>
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "8px 0 0", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>
        SPECIAL RESIDENT RETIREE'S VISA - SRRV HOLDER
      </div>
    </div>
  );
}

// ── BENEFIT CARD ───────────────────────────────────────────────────────────────

function BenefitCard({ item, onPurchase, onClaim, claimed, compact = false, C }) {
  const IconComp = item.icon;
  const finalPrice = calcFinal(item);
  const isClaimed = claimed;

  return (
    <div className="card benefit-card" style={{ overflow: "visible", cursor: "default" }}>
      <div style={{ padding: compact ? "16px 18px" : "20px 22px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: C.orangePale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconComp size={22} color={item.iconColor} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 1 }}>{item.title}</div>
            <div style={{ fontSize: 14, color: C.orange, fontWeight: 600 }}>{item.partner}</div>
            <div style={{ fontSize: 12, color: C.textSub, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={11} /> {item.location}
            </div>
          </div>
        </div>

        <StatusBadge type="orange">{item.tag}</StatusBadge>

        {!compact && (
          <div style={{ marginTop: 10, marginBottom: 14, fontSize: 14, color: C.textSub, lineHeight: 1.65 }}>{item.description}</div>
        )}

        {!compact && item.originalPrice && (
          <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 13, color: C.textSub }}>Original Price</span>
              <span style={{ fontSize: 13, color: C.textSub, textDecoration: "line-through" }}>{fmt(item.originalPrice)}</span>
            </div>
            {item.discountPct && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, color: C.greenText, fontWeight: 600 }}>PRA Discount ({item.discountPct}%)</span>
                <span style={{ fontSize: 13, color: C.greenText, fontWeight: 600 }}>-{fmt(item.originalPrice * item.discountPct / 100)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Your Price</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: C.orange }}>{item.fixedPrice ? fmt(item.fixedPrice) : fmt(finalPrice)}</span>
            </div>
          </div>
        )}

        {!compact && (
          <div style={{ fontSize: 12, color: C.textSub, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={12} /> {item.voucherValidity}
          </div>
        )}

        {item.type === "purchase" ? (
          <button className="btn-primary" style={{ width: "100%", fontSize: compact ? 14 : 15 }} onClick={() => onPurchase(item)}>
            <ShoppingCart size={16} /> {compact ? "Book" : "Purchase / Secure Voucher"}
          </button>
        ) : (
          <button className="btn-claim" style={{ width: "100%", opacity: isClaimed ? 0.75 : 1, fontSize: compact ? 14 : 15 }} onClick={() => !isClaimed && onClaim(item)}>
            {isClaimed ? <><CheckCircle size={16} /> Benefit Claimed</> : <><BadgeCheck size={16} /> Claim This Benefit</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ── REGISTRATION PAGE ──────────────────────────────────────────────────────────

function RegistrationPage({ onComplete, C }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", province: "", city: "", barangay: "", street: "", mobile: "", praId: "", seniorId: "", email: "", password: "", confirmPassword: "" });

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); if (errors[key]) setErrors((e) => ({ ...e, [key]: "" })); };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.dob) { e.dob = "Date of birth is required."; }
    else { const age = Math.floor((Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25)); if (age < 60) e.dob = `You must be at least 60 years old. Calculated age: ${age}.`; }
    if (!form.province.trim()) e.province = "Province is required.";
    if (!form.city.trim()) e.city = "City/Municipality is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g, ""))) e.mobile = "Enter a valid Philippine mobile number (e.g. 09171234567).";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep2 = () => { const e = {}; if (!form.praId.trim()) e.praId = "PRA ID Number is required."; else if (form.praId.trim().length < 6) e.praId = "PRA ID must be at least 6 characters."; setErrors(e); return Object.keys(e).length === 0; };
  const validateStep3 = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required."; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required."; else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    if (step === 2) valid = validateStep2();
    if (step === 3) {
      valid = validateStep3();
      if (valid) { const age = Math.floor((Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25)); onComplete({ ...form, age, praId: form.praId.trim().toUpperCase() }); return; }
    }
    if (valid) setStep((s) => s + 1);
  };

  const STEPS = ["Personal Details", "PRA Information", "Account Setup"];
  const Err = ({ field }) => errors[field] ? <div className="form-error"><AlertCircle size={12} /> {errors[field]}</div> : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.navy, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ background: C.orange, borderRadius: 8, padding: "6px 10px", fontWeight: 800, fontSize: 14, color: "white", letterSpacing: 1 }}>PRA</div>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>Philippine Retirement Authority</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>Senior Benefits Platform</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px 48px" }}>
        <div style={{ width: "100%", maxWidth: 540 }} className="fade-in">
          <div className="card" style={{ padding: "24px 28px", marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 2, fontFamily: "'Libre Baskerville', serif" }}>
                {["Personal Details", "PRA Information", "Account Setup"][step - 1]}
              </div>
              <div style={{ color: C.textSub, fontSize: 14 }}>Step {step} of 3</div>
            </div>
            <ProgressBar step={step} total={3} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ fontSize: 12, fontWeight: i + 1 <= step ? 700 : 400, color: i + 1 <= step ? C.orange : C.textSub }}>{s}</div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="card fade-in" style={{ padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label className="form-label">First Name</label><input className={`form-input${errors.firstName ? " error" : ""}`} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="e.g. Maria" /><Err field="firstName" /></div>
                <div><label className="form-label">Last Name</label><input className={`form-input${errors.lastName ? " error" : ""}`} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="e.g. Santos" /><Err field="lastName" /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label className="form-label">Date of Birth</label><input type="date" className={`form-input${errors.dob ? " error" : ""}`} value={form.dob} onChange={(e) => set("dob", e.target.value)} max={new Date(Date.now() - 60 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} /><div className="form-hint">You must be at least 60 years old to register.</div><Err field="dob" /></div>
              <div style={{ marginBottom: 14 }}><label className="form-label">Province</label><input className={`form-input${errors.province ? " error" : ""}`} value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="e.g. Metro Manila" /><Err field="province" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label className="form-label">City / Municipality</label><input className={`form-input${errors.city ? " error" : ""}`} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Makati City" /><Err field="city" /></div>
                <div><label className="form-label">Barangay</label><input className="form-input" value={form.barangay} onChange={(e) => set("barangay", e.target.value)} placeholder="e.g. Bel-Air" /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label className="form-label">Street Address</label><input className="form-input" value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="House No., Street Name (optional)" /></div>
              <div><label className="form-label">Mobile Number</label><input className={`form-input${errors.mobile ? " error" : ""}`} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="09171234567" maxLength={13} /><div className="form-hint">Philippine mobile number format: 09XXXXXXXXX</div><Err field="mobile" /></div>
            </div>
          )}

          {step === 2 && (
            <div className="card fade-in" style={{ padding: "24px 28px" }}>
              <div style={{ background: C.orangePale, border: `1px solid rgba(232,115,10,0.3)`, borderRadius: 10, padding: 14, marginBottom: 22, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Info size={18} color={C.orange} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 14, color: C.gray700, lineHeight: 1.6 }}>Your <strong>PRA ID</strong> or <strong>Senior Citizen ID Number</strong> can be found on your OSCA-issued identification card or PRA membership certificate.</div>
              </div>
              <div style={{ marginBottom: 18 }}><label className="form-label">PRA ID Number *</label><input className={`form-input${errors.praId ? " error" : ""}`} value={form.praId} onChange={(e) => set("praId", e.target.value)} placeholder="e.g. SRRV-2024-123456" /><div className="form-hint">Enter the ID number exactly as it appears on your PRA card.</div><Err field="praId" /></div>
              <div><label className="form-label">Senior Citizen ID Number (Optional)</label><input className="form-input" value={form.seniorId} onChange={(e) => set("seniorId", e.target.value)} placeholder="e.g. OSCA-01-2024-456789" /><div className="form-hint">If you have a separate OSCA / Senior Citizen ID, enter it here for additional discounts.</div></div>
            </div>
          )}

          {step === 3 && (
            <div className="card fade-in" style={{ padding: "24px 28px" }}>
              <div style={{ marginBottom: 18 }}><label className="form-label">Email Address</label><input type="email" className={`form-input${errors.email ? " error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="yourname@email.com" /><div className="form-hint">You will use this email to log in to your PRA account.</div><Err field="email" /></div>
              <div style={{ marginBottom: 18 }}><label className="form-label">Password</label><input type="password" className={`form-input${errors.password ? " error" : ""}`} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 8 characters" /><div className="form-hint">Minimum 8 characters.</div><Err field="password" /></div>
              <div style={{ marginBottom: 18 }}><label className="form-label">Confirm Password</label><input type="password" className={`form-input${errors.confirmPassword ? " error" : ""}`} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter your password" /><Err field="confirmPassword" /></div>
              <div style={{ background: C.gray50, borderRadius: 10, padding: 14, fontSize: 13, color: C.textSub, lineHeight: 1.7, border: `1px solid ${C.border}` }}>By completing registration, you agree to the <span style={{ color: C.orange, fontWeight: 700 }}>PRA Terms and Conditions</span> and confirm that all information provided is true and accurate.</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, gap: 12 }}>
            {step > 1 ? (
              <button className="btn-ghost" onClick={() => setStep((s) => s - 1)} style={{ minWidth: 110 }}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}
            <button className="btn-primary" onClick={nextStep} style={{ minWidth: 180, flex: step === 1 ? 1 : "auto" }}>
              {step < 3 ? <>Continue <ChevronRight size={16} /></> : <><CheckCircle size={16} /> Complete Registration</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ANNOUNCEMENT BADGE ─────────────────────────────────────────────────────────

function AnnBadge({ type }) {
  const map = { new: { label: "New", color: "green" }, reminder: { label: "Reminder", color: "orange" }, info: { label: "Info", color: "blue" } };
  const { label, color } = map[type] || map.info;
  return <StatusBadge type={color}>{label}</StatusBadge>;
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────

function Dashboard({ member, onNavigate, onPurchase, onClaim, claimedIds, benefits, announcements, C }) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const featured = benefits.slice(0, 5);
  const maxIdx = Math.max(0, featured.length - 1);

  return (
    <div className="fade-in" style={{ padding: "24px 18px" }}>
      {/* Welcome Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, borderRadius: 18, padding: "26px 26px 22px", color: "white", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -36, right: -16, width: 160, height: 160, borderRadius: "50%", background: "rgba(232,115,10,0.1)" }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Good day</div>
        <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Libre Baskerville', serif", marginBottom: 4 }}>{member.firstName} {member.lastName}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>PRA Member · Age {member.age} · {member.city}, {member.province}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Member Status</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F08030", display: "flex", alignItems: "center", gap: 5 }}><ShieldCheck size={13} /> Active SRRV Holder</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Benefits Available</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{benefits.length} Offers</div>
          </div>
        </div>
      </div>

      {/* Announcements / News Section */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
              <Newspaper size={18} color={C.orange} /> News &amp; Announcements
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="card" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{ann.title}</div>
                  <AnnBadge type={ann.type} />
                </div>
                <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 4 }}>{ann.body}</div>
                <div style={{ fontSize: 11, color: C.textSub, display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {ann.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits Carousel - 5 items */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Featured Benefits</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="carousel-btn" onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))} disabled={carouselIdx === 0}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 12, color: C.textSub, minWidth: 36, textAlign: "center" }}>{carouselIdx + 1} / {featured.length}</span>
            <button className="carousel-btn" onClick={() => setCarouselIdx(Math.min(maxIdx, carouselIdx + 1))} disabled={carouselIdx >= maxIdx}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 14, transition: "transform 0.35s ease", transform: `translateX(calc(-${carouselIdx * 100}% - ${carouselIdx * 14}px))` }}>
            {featured.map((item) => (
              <div key={item.id} style={{ minWidth: "100%", maxWidth: "100%" }}>
                <BenefitCard item={item} onPurchase={onPurchase} onClaim={onClaim} claimed={claimedIds.includes(item.id)} compact={false} C={C} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {featured.map((_, i) => (
            <button key={i} onClick={() => setCarouselIdx(i)} style={{ width: i === carouselIdx ? 20 : 7, height: 7, borderRadius: 4, background: i === carouselIdx ? C.orange : C.gray200, border: "none", transition: "all 0.25s", padding: 0 }} />
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btn-ghost" style={{ width: "100%", fontSize: 14 }} onClick={() => onNavigate("benefits", "all")}>
            View All Benefits <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Category Quick Access */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 14 }}>Browse by Category</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Health & Wellness", Icon: Heart, cat: "health", color: C.isDark ? "rgba(231,76,60,0.12)" : "#FEF2F2" },
            { label: "Travel & Hotels", Icon: Plane, cat: "travel", color: C.isDark ? "rgba(52,152,219,0.12)" : "#EFF6FF" },
            { label: "Food & Dining", Icon: UtensilsCrossed, cat: "dining", color: C.isDark ? "rgba(39,174,96,0.12)" : "#F0FDF4" },
            { label: "Entertainment", Icon: Film, cat: "entertainment", color: C.isDark ? "rgba(155,89,182,0.12)" : "#FAF5FF" },
          ].map((q) => (
            <button key={q.cat} onClick={() => onNavigate("benefits", q.cat)} style={{ background: q.color, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              <q.Icon size={26} color={C.orange} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{q.label}</span>
              <span style={{ fontSize: 12, color: C.textSub }}>{benefits.filter((b) => b.category === q.cat).length} offers</span>
            </button>
          ))}
        </div>
      </div>

      {/* PRA Card */}
      <div style={{ marginTop: 24, marginBottom: 8 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 14 }}>Your Digital Benefits Card</div>
        <PRACard member={member} C={C} />
      </div>
    </div>
  );
}

// ── BENEFITS HUB ───────────────────────────────────────────────────────────────

function BenefitsHub({ member, initialCategory = "all", onPurchase, C }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [claimedIds, setClaimedIds] = useState([]);
  const [claimFeedback, setClaimFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const handleClaim = (item) => { setClaimedIds((ids) => [...ids, item.id]); setClaimFeedback(item.partner); setTimeout(() => setClaimFeedback(null), 3000); };

  const filtered = BENEFITS.filter((b) => {
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.partner.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fade-in" style={{ padding: "24px 18px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif", marginBottom: 2 }}>Benefits &amp; Promos</div>
        <div style={{ color: C.textSub, fontSize: 14 }}>Exclusive offers for PRA Members</div>
      </div>

      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textSub }} />
        <input
          className="form-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search benefits, partners..."
          style={{ paddingLeft: 40, paddingRight: search ? 40 : 14 }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.textSub, display: "flex", padding: 4 }}>
            <X size={15} />
          </button>
        )}
      </div>

      {claimFeedback && (
        <div style={{ background: C.greenLight, border: `1.5px solid ${C.greenText}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={18} color={C.greenText} />
          <div>
            <strong style={{ color: C.greenText, fontSize: 14 }}>Benefit Claimed!</strong>
            <div style={{ fontSize: 13, color: C.gray700, marginTop: 1 }}>Show your PRA Card at <strong>{claimFeedback}</strong> to avail this discount.</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ background: activeCategory === c.id ? C.navy : C.surface, color: activeCategory === c.id ? "white" : C.textSub, border: `1.5px solid ${activeCategory === c.id ? C.navy : C.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, minHeight: 40 }}>
            <c.Icon size={14} /> {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", color: C.textSub }}>
          <Search size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>No results found</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search or category</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((item) => (
            <BenefitCard key={item.id} item={item} onPurchase={onPurchase} onClaim={handleClaim} claimed={claimedIds.includes(item.id)} C={C} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── CHECKOUT ───────────────────────────────────────────────────────────────────

function CheckoutPage({ item, member, onSuccess, onBack, C }) {
  const [payMethod, setPayMethod] = useState(null);
  const [cardNum, setCardNum] = useState(""); const [cardName, setCardName] = useState(""); const [cardExp, setCardExp] = useState(""); const [cardCvv, setCardCvv] = useState("");
  const [otpInput, setOtpInput] = useState(""); const [otpSent, setOtpSent] = useState(false); const [processing, setProcessing] = useState(false); const [otpError, setOtpError] = useState(""); const [errors, setErrors] = useState({});

  const finalPrice = calcFinal(item) || item.originalPrice;
  const discount = item.originalPrice ? item.originalPrice - finalPrice : 0;
  const MOCK_OTP = "123456";

  const handlePay = () => {
    const e = {};
    if (!payMethod) { alert("Please select a payment method."); return; }
    if ((payMethod === "gcash" || payMethod === "maya") && !otpSent) { alert("Please request and enter your OTP first."); return; }
    if ((payMethod === "gcash" || payMethod === "maya") && otpInput !== MOCK_OTP) { setOtpError("Incorrect OTP. For this demo, use: 123456"); return; }
    if (payMethod === "card") {
      if (!cardNum || cardNum.replace(/\s/g, "").length < 12) e.cardNum = "Enter a valid card number.";
      if (!cardName.trim()) e.cardName = "Cardholder name is required.";
      if (!cardExp) e.cardExp = "Expiry date is required.";
      if (!cardCvv || cardCvv.length < 3) e.cardCvv = "Enter a valid CVV.";
    }
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess({ item, payMethod, voucher: genVoucher(), amount: finalPrice }); }, 2500);
  };

  const Err = ({ field }) => errors[field] ? <div className="form-error"><AlertCircle size={12} /> {errors[field]}</div> : null;
  const fmtCardNum = (val) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const IconComp = item.icon;

  return (
    <div className="fade-in" style={{ padding: "24px 18px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.orange, fontSize: 14, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Benefits
      </button>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif", marginBottom: 2 }}>Secure Your Voucher</div>
      <div style={{ color: C.textSub, fontSize: 14, marginBottom: 22 }}>Review your order and complete payment below.</div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>Order Summary</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: C.orangePale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconComp size={20} color={item.iconColor} /></div>
          <div><div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{item.title}</div><div style={{ fontSize: 13, color: C.orange, fontWeight: 600 }}>{item.partner}</div></div>
        </div>
        <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}>
          {item.originalPrice && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, color: C.textSub }}>Original Price</span><span style={{ fontSize: 13, color: C.textSub, textDecoration: "line-through" }}>{fmt(item.originalPrice)}</span></div>}
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, color: C.greenText, fontWeight: 600 }}>PRA Discount {item.discountPct ? `(${item.discountPct}%)` : ""}</span><span style={{ fontSize: 13, color: C.greenText, fontWeight: 600 }}>-{fmt(discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Total Amount</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.orange }}>{fmt(finalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14 }}>Select Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { id: "gcash", label: "GCash", desc: "Pay via GCash wallet", Icon: Smartphone, color: "#00B14F" },
            { id: "maya", label: "Maya", desc: "Pay via Maya e-wallet", Icon: Smartphone, color: "#6B21C6" },
            { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, JCB", Icon: CreditCard, color: C.navyMid },
          ].map((pm) => (
            <div key={pm.id} onClick={() => { setPayMethod(pm.id); setOtpSent(false); setOtpInput(""); setOtpError(""); }} style={{ border: `1.5px solid ${payMethod === pm.id ? C.orange : C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, background: payMethod === pm.id ? C.orangePale : C.surface, cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: pm.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><pm.Icon size={20} color={pm.color} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{pm.label}</div><div style={{ fontSize: 13, color: C.textSub }}>{pm.desc}</div></div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payMethod === pm.id ? C.orange : C.gray400}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{payMethod === pm.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.orange }} />}</div>
            </div>
          ))}
        </div>
      </div>

      {(payMethod === "gcash" || payMethod === "maya") && (
        <div className="card fade-in" style={{ padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{payMethod === "gcash" ? "GCash" : "Maya"} Verification</div>
          <div style={{ fontSize: 14, color: C.textSub, marginBottom: 14 }}>A 6-digit OTP will be sent to <strong style={{ color: C.text }}>{member.mobile}</strong>.</div>
          {!otpSent ? (
            <button className="btn-primary" style={{ width: "100%", background: payMethod === "gcash" ? "#00B14F" : "#6B21C6" }} onClick={() => setOtpSent(true)}>
              <Smartphone size={16} /> Send OTP to {member.mobile}
            </button>
          ) : (
            <>
              <div style={{ background: C.greenLight, border: `1px solid ${C.greenText}`, borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 13, color: C.greenText, fontWeight: 600 }}>OTP sent! For this demo, the code is: <strong>123456</strong></div>
              <div>
                <label className="form-label">Enter 6-Digit OTP</label>
                <input className={`form-input${otpError ? " error" : ""}`} value={otpInput} onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }} placeholder="- - - - - -" style={{ fontSize: 22, letterSpacing: 10, textAlign: "center" }} maxLength={6} />
                {otpError && <div className="form-error"><AlertCircle size={12} /> {otpError}</div>}
              </div>
            </>
          )}
        </div>
      )}

      {payMethod === "card" && (
        <div className="card fade-in" style={{ padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14 }}>Card Details</div>
          <div style={{ marginBottom: 14 }}><label className="form-label">Card Number</label><input className={`form-input${errors.cardNum ? " error" : ""}`} value={cardNum} onChange={(e) => setCardNum(fmtCardNum(e.target.value))} placeholder="1234 5678 9012 3456" /><Err field="cardNum" /></div>
          <div style={{ marginBottom: 14 }}><label className="form-label">Cardholder Name</label><input className={`form-input${errors.cardName ? " error" : ""}`} value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As printed on card" /><Err field="cardName" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label className="form-label">Expiry Date</label><input type="month" className={`form-input${errors.cardExp ? " error" : ""}`} value={cardExp} onChange={(e) => setCardExp(e.target.value)} /><Err field="cardExp" /></div>
            <div><label className="form-label">CVV / CVC</label><input className={`form-input${errors.cardCvv ? " error" : ""}`} value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="..." style={{ letterSpacing: 4 }} /><Err field="cardCvv" /></div>
          </div>
        </div>
      )}

      <button className="btn-primary" style={{ width: "100%", fontSize: 17, padding: "16px 28px", minHeight: 58 }} onClick={handlePay} disabled={processing}>
        {processing ? <><Spinner /> Processing Payment...</> : <><Lock size={16} /> Confirm Payment - {fmt(finalPrice)}</>}
      </button>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.textSub, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        <Lock size={12} /> Secured by PRA Digital Platform - SSL Encrypted
      </div>
    </div>
  );
}

// ── PAYMENT SUCCESS ────────────────────────────────────────────────────────────

function PaymentSuccess({ result, member, onDone, C }) {
  const methodLabel = { gcash: "GCash", maya: "Maya", card: "Credit/Debit Card" };
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
  const IconComp = result.item.icon;

  return (
    <div className="slide-up" style={{ padding: "32px 18px", textAlign: "center" }}>
      <div className="pulse" style={{ width: 88, height: 88, borderRadius: "50%", background: C.greenLight, border: `3px solid ${C.greenText}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <CheckCircle size={42} color={C.greenText} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.greenText, fontFamily: "'Libre Baskerville', serif", marginBottom: 4 }}>Payment Successful!</div>
      <div style={{ fontSize: 15, color: C.textSub, marginBottom: 26 }}>Your voucher has been confirmed. Save or print the details below.</div>

      <div className="card" style={{ padding: 0, marginBottom: 24, overflow: "hidden", border: `2px solid ${C.orange}` }}>
        <div style={{ background: C.navy, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>PRA Digital Voucher</div><div style={{ color: "white", fontWeight: 700, fontSize: 15, marginTop: 1 }}>Philippine Retirement Authority</div></div>
          <StatusBadge type="green">CONFIRMED</StatusBadge>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.orange, fontFamily: "monospace", letterSpacing: 3, marginBottom: 2, textAlign: "center" }}>{result.voucher}</div>
          <div style={{ fontSize: 12, color: C.textSub, textAlign: "center", marginBottom: 18 }}>Voucher Reference Number</div>
          <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}>
            {[["Benefit", result.item.title], ["Partner", result.item.partner], ["Member", `${member.firstName} ${member.lastName}`], ["PRA ID", member.praId], ["Amount Paid", fmt(result.amount)], ["Payment Via", methodLabel[result.payMethod]], ["Date and Time", `${dateStr}, ${timeStr}`], ["Validity", result.item.voucherValidity]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, color: C.textSub, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: C.textSub, lineHeight: 1.6 }}>Present this voucher code at the partner establishment. Take a screenshot or print this page. This voucher is non-transferable.</div>
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => window.print()}>
        <Printer size={16} /> Print / Save Voucher
      </button>
      <button className="btn-ghost" style={{ width: "100%" }} onClick={onDone}>
        <ArrowLeft size={16} /> Back to Benefits
      </button>
    </div>
  );
}

// ── PROFILE PAGE ───────────────────────────────────────────────────────────────

function ProfilePage({ member, onSwitchToAdmin, darkMode, toggleDark, C }) {
  return (
    <div className="fade-in" style={{ padding: "24px 18px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif", marginBottom: 18 }}>My Profile</div>

      <div className="card" style={{ marginBottom: 18, padding: "22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.orangePale, border: `2.5px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: C.orange, flexShrink: 0 }}>{member.firstName[0]}{member.lastName[0]}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{member.firstName} {member.lastName}</div>
            <StatusBadge type="green">SRRV Active Member</StatusBadge>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>{member.email}</div>
          </div>
        </div>
        {[["Full Name", `${member.firstName} ${member.lastName}`], ["Date of Birth", member.dob], ["Age", `${member.age} years old`], ["Address", [member.street, member.barangay, member.city, member.province].filter(Boolean).join(", ")], ["Mobile Number", member.mobile], ["Email Address", member.email], ["PRA ID", member.praId], ["Senior ID", member.seniorId || "Not provided"]].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 14, color: C.textSub, flexShrink: 0, minWidth: 130 }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 18 }}><PRACard member={member} C={C} /></div>

      {/* Preferences */}
      <div className="card" style={{ marginBottom: 18, overflow: "visible" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: 0.5 }}>Preferences</div>
        </div>
        <div style={{ padding: "4px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {darkMode ? <Moon size={18} color={C.orange} /> : <Sun size={18} color={C.orange} />}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Appearance</div>
                <div style={{ fontSize: 12, color: C.textSub }}>{darkMode ? "Dark mode is on" : "Light mode is on"}</div>
              </div>
            </div>
            <button onClick={toggleDark} style={{ background: darkMode ? C.orange : C.gray200, border: "none", borderRadius: 12, width: 44, height: 24, position: "relative", transition: "background 0.3s", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: darkMode ? 23 : 3, transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Admin switch */}
      <button onClick={onSwitchToAdmin} style={{ width: "100%", background: C.navy, color: "white", border: "none", borderRadius: 12, padding: "16px 20px", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", transition: "opacity 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        <ShieldCheck size={18} /> Switch to Admin Demo
      </button>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────

function NavBar({ active, onNavigate, memberName, C }) {
  const tabs = [
    { id: "dashboard", label: "Home", Icon: LayoutDashboard },
    { id: "benefits", label: "Benefits", Icon: Ticket },
    { id: "profile", label: "Profile", Icon: UserCircle },
  ];
  return (
    <>
      <div style={{ background: C.navy, padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.orange, borderRadius: 7, padding: "5px 9px", fontWeight: 800, fontSize: 13, color: "white", letterSpacing: 1 }}>PRA</div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 15 }}>Senior Benefits</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <UserCircle size={14} /> {memberName}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1.5px solid ${C.border}`, display: "flex", zIndex: 100, boxShadow: "0 -3px 12px rgba(0,0,0,0.06)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => onNavigate(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 4px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active === t.id ? C.orange : C.gray400, cursor: "pointer", transition: "color 0.2s", borderTop: active === t.id ? `2.5px solid ${C.orange}` : "2.5px solid transparent" }}>
            <t.Icon size={21} />
            <span style={{ fontSize: 11, fontWeight: active === t.id ? 700 : 500 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ── ADMIN PANEL ────────────────────────────────────────────────────────────────

function AdminPanel({ onSwitchToMember, darkMode, toggleDark, C }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [benefits, setBenefits] = useState(BENEFITS);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [showAddBenefit, setShowAddBenefit] = useState(false);
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [newBenefit, setNewBenefit] = useState({ title: "", partner: "", category: "health", location: "", description: "", originalPrice: "", discountPct: "", tag: "", type: "purchase", voucherValidity: "" });
  const [newAnn, setNewAnn] = useState({ title: "", body: "", type: "info" });

  const adminTabs = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "members", label: "Members", Icon: Users },
    { id: "transactions", label: "Transactions", Icon: ReceiptText },
    { id: "benefits", label: "Benefits", Icon: Ticket },
    { id: "announcements", label: "News", Icon: Megaphone },
  ];

  const totalRevenue = MOCK_TRANSACTIONS.reduce((s, t) => s + t.amount, 0);

  const handleSaveBenefit = () => {
    if (!newBenefit.title || !newBenefit.partner) return;
    const iconMap = { health: Heart, travel: Plane, dining: UtensilsCrossed, entertainment: Film };
    const colorMap = { health: "#e74c3c", travel: "#3498db", dining: "#27ae60", entertainment: "#9b59b6" };
    const catLabelMap = { health: "Health & Wellness", travel: "Travel & Hotels", dining: "Food & Dining", entertainment: "Entertainment & Leisure" };
    if (editingBenefit) {
      setBenefits((bs) => bs.map((b) => b.id === editingBenefit ? { ...b, ...newBenefit, icon: iconMap[newBenefit.category], iconColor: colorMap[newBenefit.category], categoryLabel: catLabelMap[newBenefit.category], originalPrice: newBenefit.originalPrice ? Number(newBenefit.originalPrice) : null, discountPct: newBenefit.discountPct ? Number(newBenefit.discountPct) : null } : b));
      setEditingBenefit(null);
    } else {
      setBenefits((bs) => [...bs, { ...newBenefit, id: "b" + Date.now(), icon: iconMap[newBenefit.category], iconColor: colorMap[newBenefit.category], categoryLabel: catLabelMap[newBenefit.category], originalPrice: newBenefit.originalPrice ? Number(newBenefit.originalPrice) : null, discountPct: newBenefit.discountPct ? Number(newBenefit.discountPct) : null, active: true }]);
    }
    setNewBenefit({ title: "", partner: "", category: "health", location: "", description: "", originalPrice: "", discountPct: "", tag: "", type: "purchase", voucherValidity: "" });
    setShowAddBenefit(false);
  };

  const handleSaveAnn = () => {
    if (!newAnn.title || !newAnn.body) return;
    setAnnouncements((as) => [...as, { ...newAnn, id: "a" + Date.now(), date: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }), active: true }]);
    setNewAnn({ title: "", body: "", type: "info" });
    setShowAddAnn(false);
  };

  const InputRow = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 12 }}>
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Admin top bar */}
      <div style={{ background: C.navy, padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.orange, borderRadius: 7, padding: "5px 9px", fontWeight: 800, fontSize: 13, color: "white", letterSpacing: 1 }}>PRA</div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 15 }}>Admin Console</div>
          <StatusBadge type="orange">Demo</StatusBadge>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={toggleDark} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 10px", color: "white", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={onSwitchToMember} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, padding: "7px 12px", color: "white", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <UserCircle size={14} /> Switch to Member Demo
          </button>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 960, margin: "0 auto", minHeight: "calc(100vh - 56px)" }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, padding: "20px 0", position: "sticky", top: 56, height: "calc(100vh - 56px)", overflowY: "auto" }}>
          {adminTabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ width: "100%", background: activeTab === t.id ? C.orangePale : "none", color: activeTab === t.id ? C.orange : C.textSub, border: "none", borderLeft: activeTab === t.id ? `3px solid ${C.orange}` : "3px solid transparent", padding: "12px 20px", fontSize: 14, fontWeight: activeTab === t.id ? 700 : 500, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
              <t.Icon size={17} /> {t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 24px", overflowY: "auto" }}>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="fade-in">
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20, fontFamily: "'Libre Baskerville', serif" }}>Admin Dashboard</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Total Members", value: MOCK_MEMBERS.length, sub: `${MOCK_MEMBERS.filter(m => m.status === "Active").length} active`, Icon: Users, color: "#3498db" },
                  { label: "Total Transactions", value: MOCK_TRANSACTIONS.length, sub: "This month", Icon: ReceiptText, color: "#27ae60" },
                  { label: "Total Revenue", value: "PhP " + totalRevenue.toLocaleString(), sub: "All time", Icon: TrendingUp, color: C.orange },
                  { label: "Active Benefits", value: benefits.filter(b => b.active).length, sub: `${CATEGORIES.length - 1} categories`, Icon: Ticket, color: "#9b59b6" },
                ].map((stat) => (
                  <div key={stat.label} className="card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</div>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><stat.Icon size={16} color={stat.color} /></div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Recent Transactions</div>
              <div className="card" style={{ overflow: "hidden" }}>
                {MOCK_TRANSACTIONS.slice(0, 3).map((tx, i) => (
                  <div key={tx.id} style={{ padding: "13px 18px", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{tx.member}</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{tx.benefit}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.orange }}>PhP {tx.amount.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: C.textSub }}>{tx.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {activeTab === "members" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif" }}>Members</div>
                <StatusBadge type="blue">{MOCK_MEMBERS.length} Total</StatusBadge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {MOCK_MEMBERS.map((m) => (
                  <div key={m.id} className="card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.orangePale, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: C.orange, flexShrink: 0 }}>{m.firstName[0]}{m.lastName[0]}</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{m.firstName} {m.lastName}</div>
                          <div style={{ fontSize: 13, color: C.textSub }}>{m.email}</div>
                          <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>{m.praId} · Age {m.age} · {m.city}</div>
                        </div>
                      </div>
                      <StatusBadge type={m.status === "Active" ? "green" : "gray"}>{m.status}</StatusBadge>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textSub }}>
                      Member since: {m.joinDate} · {m.province}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRANSACTIONS */}
          {activeTab === "transactions" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif" }}>Transactions</div>
                <StatusBadge type="green">PhP {totalRevenue.toLocaleString()} total</StatusBadge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{tx.benefit}</div>
                        <div style={{ fontSize: 13, color: C.orange, fontWeight: 600 }}>{tx.partner}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>PhP {tx.amount.toLocaleString()}</div>
                        <StatusBadge type="green">{tx.status}</StatusBadge>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.textSub, display: "flex", flexWrap: "wrap", gap: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={11} />{tx.member}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CreditCard size={11} />{tx.method}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} />{tx.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ticket size={11} />{tx.voucher}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BENEFITS MANAGEMENT */}
          {activeTab === "benefits" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif" }}>Benefits / Promos</div>
                <button className="btn-primary" style={{ fontSize: 13, padding: "9px 16px", minHeight: 38 }} onClick={() => { setShowAddBenefit(true); setEditingBenefit(null); setNewBenefit({ title: "", partner: "", category: "health", location: "", description: "", originalPrice: "", discountPct: "", tag: "", type: "purchase", voucherValidity: "" }); }}>
                  <Plus size={15} /> Add Benefit
                </button>
              </div>

              {showAddBenefit && (
                <div className="card fade-in" style={{ padding: "20px 22px", marginBottom: 18, border: `2px solid ${C.orange}` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>{editingBenefit ? "Edit Benefit" : "Add New Benefit"}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <InputRow label="Title *" value={newBenefit.title} onChange={(v) => setNewBenefit(b => ({ ...b, title: v }))} placeholder="Benefit title" />
                    <InputRow label="Partner *" value={newBenefit.partner} onChange={(v) => setNewBenefit(b => ({ ...b, partner: v }))} placeholder="Partner name" />
                    <div>
                      <label className="form-label">Category</label>
                      <select className="form-input" value={newBenefit.category} onChange={(e) => setNewBenefit(b => ({ ...b, category: e.target.value }))}>
                        <option value="health">Health & Wellness</option>
                        <option value="travel">Travel & Hotels</option>
                        <option value="dining">Food & Dining</option>
                        <option value="entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Type</label>
                      <select className="form-input" value={newBenefit.type} onChange={(e) => setNewBenefit(b => ({ ...b, type: e.target.value }))}>
                        <option value="purchase">Purchase</option>
                        <option value="claim">Claim (Free)</option>
                      </select>
                    </div>
                    <InputRow label="Location" value={newBenefit.location} onChange={(v) => setNewBenefit(b => ({ ...b, location: v }))} placeholder="e.g. All branches nationwide" />
                    <InputRow label="Tag" value={newBenefit.tag} onChange={(v) => setNewBenefit(b => ({ ...b, tag: v }))} placeholder="e.g. 20% off for PRA Members" />
                    <InputRow label="Original Price (leave blank if none)" value={newBenefit.originalPrice} onChange={(v) => setNewBenefit(b => ({ ...b, originalPrice: v }))} placeholder="e.g. 8500" type="number" />
                    <InputRow label="Discount %" value={newBenefit.discountPct} onChange={(v) => setNewBenefit(b => ({ ...b, discountPct: v }))} placeholder="e.g. 20" type="number" />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" value={newBenefit.description} onChange={(e) => setNewBenefit(b => ({ ...b, description: e.target.value }))} placeholder="Full benefit description..." rows={3} style={{ resize: "vertical" }} />
                  </div>
                  <InputRow label="Voucher Validity" value={newBenefit.voucherValidity} onChange={(v) => setNewBenefit(b => ({ ...b, voucherValidity: v }))} placeholder="e.g. Valid until December 31, 2026" />
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn-ghost" onClick={() => { setShowAddBenefit(false); setEditingBenefit(null); }}>Cancel</button>
                    <button className="btn-primary" onClick={handleSaveBenefit}><Check size={15} /> {editingBenefit ? "Save Changes" : "Add Benefit"}</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {benefits.map((b) => {
                  const IconComp = b.icon;
                  return (
                    <div key={b.id} className="card" style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.orangePale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <IconComp size={18} color={b.iconColor} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{b.title}</div>
                          <div style={{ fontSize: 13, color: C.orange }}>{b.partner}</div>
                          <div style={{ fontSize: 12, color: C.textSub }}>{b.categoryLabel}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <StatusBadge type={b.type === "purchase" ? "orange" : "green"}>{b.type}</StatusBadge>
                          <button onClick={() => { setEditingBenefit(b.id); setNewBenefit({ title: b.title, partner: b.partner, category: b.category, location: b.location, description: b.description, originalPrice: b.originalPrice || "", discountPct: b.discountPct || "", tag: b.tag, type: b.type, voucherValidity: b.voucherValidity }); setShowAddBenefit(true); }} style={{ background: "none", border: "none", color: C.textSub, cursor: "pointer", padding: 6 }}><Pencil size={15} /></button>
                          <button onClick={() => setBenefits((bs) => bs.filter((item) => item.id !== b.id))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 6 }}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Libre Baskerville', serif" }}>Announcements</div>
                <button className="btn-primary" style={{ fontSize: 13, padding: "9px 16px", minHeight: 38 }} onClick={() => setShowAddAnn(true)}>
                  <Plus size={15} /> Add Announcement
                </button>
              </div>

              {showAddAnn && (
                <div className="card fade-in" style={{ padding: "20px 22px", marginBottom: 18, border: `2px solid ${C.orange}` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14 }}>New Announcement</div>
                  <InputRow label="Title *" value={newAnn.title} onChange={(v) => setNewAnn(a => ({ ...a, title: v }))} placeholder="Announcement title" />
                  <div style={{ marginBottom: 14 }}>
                    <label className="form-label">Body *</label>
                    <textarea className="form-input" value={newAnn.body} onChange={(e) => setNewAnn(a => ({ ...a, body: e.target.value }))} placeholder="Announcement content..." rows={3} style={{ resize: "vertical" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Type</label>
                    <select className="form-input" value={newAnn.type} onChange={(e) => setNewAnn(a => ({ ...a, type: e.target.value }))}>
                      <option value="info">Info</option>
                      <option value="new">New</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn-ghost" onClick={() => setShowAddAnn(false)}>Cancel</button>
                    <button className="btn-primary" onClick={handleSaveAnn}><Check size={15} /> Post Announcement</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {announcements.map((ann) => (
                  <div key={ann.id} className="card" style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ann.title}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <AnnBadge type={ann.type} />
                        <button onClick={() => setAnnouncements((as) => as.filter((a) => a.id !== ann.id))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 4 }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 4 }}>{ann.body}</div>
                    <div style={{ fontSize: 11, color: C.textSub, display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {ann.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("register");
  const [mode, setMode] = useState("member");
  const [member, setMember] = useState(null);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [benefitCategory, setBenefitCategory] = useState("all");
  const [claimedIds, setClaimedIds] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const C = getTheme(darkMode);

  const handleRegistered = (data) => { setMember(data); setView("dashboard"); };
  const handleNavigate = (page, cat = "all") => { setBenefitCategory(cat); setView(page); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handlePurchase = (item) => { setSelectedBenefit(item); setView("checkout"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handlePaySuccess = (result) => { setSuccessResult(result); setView("success"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleClaim = (item) => setClaimedIds((ids) => [...ids, item.id]);
  const toggleDark = () => setDarkMode((d) => !d);

  return (
    <>
      <style>{makeGlobalStyle(C)}</style>

      {view === "register" && <RegistrationPage onComplete={handleRegistered} C={C} />}

      {view !== "register" && member && mode === "member" && (
        <div style={{ paddingBottom: 80 }}>
          <NavBar active={["checkout", "success"].includes(view) ? "benefits" : view} onNavigate={handleNavigate} memberName={member.firstName} C={C} />
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {view === "dashboard" && <Dashboard member={member} onNavigate={handleNavigate} onPurchase={handlePurchase} onClaim={handleClaim} claimedIds={claimedIds} benefits={BENEFITS} announcements={ANNOUNCEMENTS} C={C} />}
            {view === "benefits" && <BenefitsHub member={member} initialCategory={benefitCategory} onPurchase={handlePurchase} C={C} />}
            {view === "checkout" && selectedBenefit && <CheckoutPage item={selectedBenefit} member={member} onSuccess={handlePaySuccess} onBack={() => setView("benefits")} C={C} />}
            {view === "success" && successResult && <PaymentSuccess result={successResult} member={member} onDone={() => { setView("benefits"); window.scrollTo({ top: 0 }); }} C={C} />}
            {view === "profile" && <ProfilePage member={member} onSwitchToAdmin={() => setMode("admin")} darkMode={darkMode} toggleDark={toggleDark} C={C} />}
          </div>
        </div>
      )}

      {mode === "admin" && member && (
        <AdminPanel onSwitchToMember={() => setMode("member")} darkMode={darkMode} toggleDark={toggleDark} C={C} />
      )}
    </>
  );
}
