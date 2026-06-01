# 🇵🇭 Philippine Retirement Authority — Senior Benefits Platform

A fully interactive, production-ready single-page application for PRA senior citizen members in the Philippines. Built with React (JSX) + zero external dependencies beyond React itself and Google Fonts.

## 🚀 Quick Deploy to Vercel

### Option A – React/Vite (Recommended)

```bash
# 1. Scaffold a new Vite project
npm create vite@latest pra-benefits -- --template react
cd pra-benefits

# 2. Replace src/App.jsx with pra-app.jsx
cp path/to/pra-app.jsx src/App.jsx

# 3. Run locally
npm install
npm run dev

# 4. Deploy to Vercel
npm install -g vercel
vercel
```

### Option B – Next.js

```bash
npx create-next-app@latest pra-benefits --no-typescript --no-tailwind --no-app
cd pra-benefits

# Replace pages/index.js
cp path/to/pra-app.jsx pages/index.jsx

# Update the export to be default export (already is)
npm run dev

# Deploy
vercel
```

### Option C – Standalone HTML (No build step)
Open `pra-standalone.html` directly in any browser. No server needed. Also deployable to Vercel as a static site.

---

## 📁 Project Structure

```
pra-benefits/
├── src/
│   └── App.jsx          ← Main application (pra-app.jsx)
├── public/
│   └── index.html
├── package.json
└── README.md
```

---

## ✨ Features

### Registration Flow (3 Steps)
- **Step 1:** Personal Details — Full name, Date of Birth (validated ≥60 yrs), Philippine address, mobile number
- **Step 2:** PRA Information — PRA ID / Senior Citizen ID
- **Step 3:** Account Setup — Email, password with confirmation
- All fields validated with clear, large error messages
- Smooth transition to dashboard on completion

### Member Dashboard
- Personalized welcome banner with member details
- Digital PRA Senior Benefits Card (dark navy design with gold accents)
- Quick-access grid to all benefit categories
- Member stats: active status, number of available offers

### Benefits & Promos Hub (6 Mock Offers)
| Benefit | Partner | Type |
|---|---|---|
| Executive Check-up Package | The Medical City | Purchase (20% off) |
| Maintenance Medication Discount | Mercury Drug | Claim (free) |
| 3D2N Staycation Package | Henann Resort Boracay | Purchase (30% off) |
| Domestic Flight Zero Booking Fee | Cebu Pacific | Claim (free) |
| Grandparent's Weekend Feast | Max's Restaurant | Purchase |
| Unlimited Weekday Movie Pass | SM Cinemas | Purchase (₱100 flat) |

### Checkout & Payment Gateway
- Full itemized price breakdown (Original → Discount → Final)
- 3 payment methods: GCash, Maya, Credit/Debit Card
- GCash/Maya: Mock OTP verification flow (demo OTP: `123456`)
- Credit Card: Full card form with validation
- 2.5-second processing animation
- Payment Success screen with printable voucher

### My Profile Page
- All member details displayed clearly
- Digital benefits card preview
- Initials avatar

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Navy) | `#0A2540` |
| Accent (Orange) | `#FF8C00` |
| Body Font | Source Sans 3 (Google Fonts) |
| Display Font | Libre Baskerville (Google Fonts) |
| Min button height | 52–56px (accessibility) |
| Min font size | 14px (accessibility) |

---

## ♿ Accessibility

- All interactive elements ≥48px touch target height
- High-contrast color pairs throughout (WCAG AA/AAA)
- Large, readable font sizes (17–18px body, 22–30px headings)
- Clear inline validation errors with ⚠ prefix
- No gesture-based navigation; all actions use large buttons
- Sticky top navigation + bottom tab bar for mobile

---

## 🛠 Tech Stack

- React 18 (functional components + hooks)
- No external UI library (zero Tailwind, zero MUI)
- Google Fonts: Source Sans 3 + Libre Baskerville
- All state managed with `useState` and prop drilling
- No backend required — all mock data and logic is client-side

---

## 📝 Customization

### Adding a new benefit
Edit the `BENEFITS` array in `pra-app.jsx`:
```js
{
  id: "unique-id",
  category: "health", // health | travel | dining | entertainment
  categoryLabel: "Health & Wellness",
  title: "Your Offer Title",
  partner: "Partner Name",
  location: "Location",
  description: "Full description...",
  originalPrice: 5000,    // null if no fixed price
  discountPct: 25,        // null if no % discount
  fixedPrice: null,       // null unless it's a flat rate
  tag: "Tag text",
  icon: "🏥",
  type: "purchase",       // purchase | claim
  voucherValidity: "Valid until Dec 2025",
}
```

### Connecting a real backend
Replace the `handleRegistered` and `handlePaySuccess` functions in the `App` component with `fetch()` calls to your API endpoints.

---

## 📜 License
Internal use by Philippine Retirement Authority. All mock data is for demonstration purposes only.
