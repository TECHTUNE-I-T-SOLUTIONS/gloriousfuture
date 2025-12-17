# 🎨 Visual Guide - Donation System

## User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Homepage Visitor                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  👁️  SEES: Top Notice Banner (Animated)                        │
│  📍 "IBA transformer area... new campus"                        │
│  🎯 Always visible at top of header                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    Wait 8 seconds
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎁 SEES: Beautiful Donation Modal (Animated)                   │
│  ✨ Floating emojis (🎓 ✨ 🌟)                                 │
│  ❤️  Pulsing heart icon                                         │
│  📚 Benefits highlighted                                        │
│  🏫 Campus info                                                 │
│  📲 Two CTAs: "Donate Now" | "Not Now"                         │
└────────────────────────┬────────────┬───────────────────────────┘
                    Click "Donate Now"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  📋 GOES TO: Donation Page (/donation)                          │
│  📝 Beautiful form with:                                        │
│     • Full Name input                                           │
│     • Email input                                               │
│     • Phone input                                               │
│     • Amount input (₦1,000+)                                    │
│     • Donation type (one-time/recurring)                        │
│     • Message (optional)                                        │
│  💳 "Donate Now" button                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    Fill & Submit
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  🔄 SERVER: Process Donation                                    │
│  ✅ Validate all fields                                         │
│  💾 Save to database (status: pending)                          │
│  💬 Paystack API initialization                                 │
│  🔗 Generate authorization URL                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  💳 USER: Redirected to Paystack                                │
│  🔐 Secure hosted payment page                                  │
│  💰 Enter card details                                          │
│  ✔️  Complete payment                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
              Paystack redirects back
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  🔍 SERVER: Verify Payment                                      │
│  ✔️  Query Paystack API                                         │
│  📊 Get payment status                                          │
│  💾 Update donation record                                      │
│  🎫 Store transaction reference                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌─────────────┴─────────────┐
          │                           │
      SUCCESS                      FAILED
          │                           │
          ▼                           ▼
   ✅ Success Page           ❌ Failure Page
   /donation-success         /donation-failed
   • Checkmark icon          • X icon
   • Thank you message       • Error message
   • Reference #             • Try again button
   • Next steps              • Support info
```

## Modal Design Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                    TOP NOTICE BANNER                    │
│  🌟 IBA transformer area, IBA village, Ijomu Road      │
│         Oro, Kwara State                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DONATION MODAL                        │
├─────────────────────────────────────────────────────────┤
│                   HEADER SECTION                        │
│           (Gradient: Indigo → Purple → Pink)           │
│                                                         │
│             🎓    ✨      ❤️      🌟                   │
│        (Animated floating emojis)                       │
│                                                         │
│             "Make a Difference!"                        │
│      "Support our students' bright future"             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  CONTENT SECTION                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🏫 OUR NEW CAMPUS                              │   │
│  │ IBA transformer area, IBA village...           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  "We're expanding with world-class facilities..."      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   📚     │  │   🏗️     │  │   🌟     │            │
│  │ Learning │  │  Infra   │  │Excellence│            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💡 Your donation supports:                      │   │
│  │ ✓ State-of-the-art facilities                  │   │
│  │ ✓ Scholarships for students                    │   │
│  │ ✓ Modern technology & equipment                │   │
│  │ ✓ Student welfare programs                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ 🎁 DONATE NOW → │  │  NOT NOW         │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
│              🔒 Secure payments via Paystack           │
└─────────────────────────────────────────────────────────┘
```

## Donation Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      DONATION PAGE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Back to Home                                             │
│                                                              │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  INFO SIDEBAR    │  │   DONATION FORM               │  │
│  │  (Sticky)        │  │                                │  │
│  │                  │  │  Full Name                     │  │
│  │ ❤️ Support       │  │  [________________]            │  │
│  │    Our Mission   │  │                                │  │
│  │                  │  │  Email                         │  │
│  │ 🏫 New Campus    │  │  [________________]            │  │
│  │    Location      │  │                                │  │
│  │                  │  │  Phone                         │  │
│  │ ✨ What Your     │  │  [________________]            │  │
│  │    Donation      │  │                                │  │
│  │    Supports:     │  │  Amount (₦)                    │  │
│  │    ✓ Scholarships│  │  [________________] (min 1000) │  │
│  │    ✓ Learning    │  │                                │  │
│  │    ✓ Resources   │  │  Type                          │  │
│  │    ✓ Facilities  │  │  [One-time ▼]                │  │
│  │                  │  │                                │  │
│  │ 💡 Your details  │  │  Message                       │  │
│  │    are encrypted │  │  [_________________]           │  │
│  │    and secure    │  │                                │  │
│  │                  │  │  [DONATE NOW ➜]               │  │
│  │                  │  │                                │  │
│  └──────────────────┘  └────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Success/Failure Pages

```
SUCCESS PAGE                           FAILURE PAGE
(/donation-success)                    (/donation-failed)

┌─────────────────────────┐            ┌─────────────────────────┐
│         ✅ THANK YOU!   │            │        ❌ FAILED        │
│        🎉 🎉 🎉         │            │                         │
│                         │            │   Payment could not     │
│  Your donation has      │            │   be processed          │
│  been received          │            │                         │
│  successfully!          │            │   Reference:            │
│                         │            │   [xxxxx]               │
│  Reference:             │            │                         │
│  [xxxxx]                │            │   What you can do:      │
│                         │            │   • Check details       │
│  What happens next:     │            │   • Verify funds        │
│  • Email confirmation   │            │   • Try another method  │
│  • Donation supports    │            │   • Contact bank        │
│  • Facility updates     │            │                         │
│  • Thank you note       │            │   [TRY AGAIN]           │
│                         │            │   [BACK HOME]           │
│  [BACK HOME]            │            │                         │
│                         │            │   Need help?            │
│  Contact: support@...   │            │   support@...           │
└─────────────────────────┘            └─────────────────────────┘
```

## Database Schema Visualization

```
DONATIONS TABLE
┌─────────────────────────────────────────────────────────────┐
│ ID (UUID)                                                   │
│ FULL_NAME (text) ........... "John Doe"                     │
│ EMAIL (text) ............... "john@example.com"            │
│ PHONE (text) ............... "+2348035770623"              │
│ AMOUNT (numeric) ........... 50000                          │
│ DONATION_TYPE (text) ....... "one-time" | "recurring"     │
│ MESSAGE (text) ............. "Supporting education"        │
│ STATUS (text) .............. "pending|completed|failed"   │
│ PAYMENT_REFERENCE (text) ... "sk_live_xxxxx"             │
│ PAYMENT_STATUS (text) ....... "success|failed"            │
│ PAYSTACK_RESPONSE (jsonb) ... {full_paystack_data}       │
│ CREATED_AT (timestamp) ...... 2025-12-17T10:30:00Z       │
│ VERIFIED_AT (timestamp) ..... 2025-12-17T10:35:00Z       │
└─────────────────────────────────────────────────────────────┘

INDEXES:
  • idx_donations_email
  • idx_donations_status
  • idx_donations_created_at
  • idx_donations_payment_reference
```

## API Endpoints Flow

```
1. DONATION SUBMISSION
   POST /api/donations
   ├─ Validate input
   ├─ Save to database (status: pending)
   ├─ Initialize Paystack
   └─ Return authorization URL
                    │
                    ▼
   Client redirects to Paystack
                    │
                    ▼
2. PAYMENT COMPLETION
   Paystack redirects with reference
   ├─ GET /api/donations/verify?reference=xyz
   ├─ Query Paystack API
   ├─ Update donation status
   ├─ Store transaction
   └─ Redirect to success/failure page
```

## Component Hierarchy

```
ROOT LAYOUT
├── CLIENT STARTUP
│   └── DONATION MODAL (shows once/day)
│
├── CUSTOM HEADER
│   ├── TOP NOTICE (animated banner)
│   └── NAVIGATION + MENUS
│
├── PAGE CONTENT
│   ├── Homepage
│   ├── Donation Page
│   ├── Success Page
│   └── Failed Page
│
└── CUSTOM FOOTER
    └── DONATION LINK
```

## Color Scheme

```
PRIMARY GRADIENT:
  Indigo (#4f46e5) ──→ Purple (#a855f7) ──→ Pink (#ec4899)

ACCENT COLORS:
  Success Green: #10b981
  Error Red: #ef4444
  Warning Yellow: #f59e0b
  Info Blue: #3b82f6

BACKGROUNDS:
  Light Mode: #ffffff, #f1f5f9
  Dark Mode: #1e293b, #0f172a

TEXT:
  Primary: #1f2937
  Secondary: #6b7280
  Light: #d1d5db
```

## Animation Timings

```
Modal entrance:     300-400ms (spring physics)
Stagger children:   100-150ms delay between
Emoji float:        4-6s (infinite, gentle)
Heart pulse:        2s (infinite)
Button hover:       200ms scale
Backdrop blur:      smooth transition
```

---

**Everything is designed for beautiful user experience! 🎨**
