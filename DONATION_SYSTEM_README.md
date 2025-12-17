# Donation System & New Campus Site Announcement

This document outlines the new donation system and campus announcement features added to Glorious Future Academy's website.

## 🎉 New Features Overview

### 1. **Top Notice Banner**
- **Component**: `src/components/TopNotice.tsx`
- **Location**: Appears at the very top of every page
- **Features**:
  - Animated gradient background (indigo to purple)
  - Floating icon animation
  - Displays the new campus location: "IBA transformer area, IBA village, Ijomu Road, Oro, Kwara State"
  - Fully responsive design

### 2. **Donation Modal**
- **Component**: `src/components/DonationModal.tsx`
- **Features**:
  - Displays automatically after 8 seconds on homepage (once per day per browser)
  - Smooth spring animations and backdrop blur
  - Beautiful gradient header with floating emojis
  - Heart icon that pulses rhythmically
  - Information about facility improvements
  - Two CTAs: "Donate Now" and "Maybe Later"
  - Animated impact points highlighting learning improvements

### 3. **Donation Page**
- **Route**: `/donation`
- **Component**: `src/app/donation/page.tsx`
- **Features**:
  - Comprehensive donation form with:
    - Full Name (required)
    - Email (required)
    - Phone Number (required)
    - Donation Amount in Naira (minimum ₦1,000)
    - Donation Type (One-time or Monthly Recurring)
    - Optional message from donor
  - Sticky information sidebar about the new campus
  - Form validation and error handling
  - Integration with Paystack for secure payments
  - Animated loading states

### 4. **API Endpoints**

#### POST `/api/donations`
Creates a new donation record and initializes Paystack payment.

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+234XXXXXXXXXX",
  "amount": 50000,
  "donationType": "one-time",
  "message": "Supporting education"
}
```

**Response**:
```json
{
  "success": true,
  "donation": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+234XXXXXXXXXX",
    "amount": 50000,
    "donation_type": "one-time",
    "status": "pending",
    "created_at": "2025-12-17T...",
    ...
  },
  "authorizationUrl": "https://checkout.paystack.com/...",
  "paystack": {...}
}
```

#### GET `/api/donations/verify?reference=<reference>`
Verifies payment with Paystack and updates donation status.

**Behavior**:
- Verifies transaction reference with Paystack API
- Updates donation status to "completed" or "failed"
- Stores full Paystack response for records
- Redirects to success or failure page

### 5. **Success & Failure Pages**
- **Success Page**: `/donation-success?reference=<ref>`
  - Celebratory design with animated checkmark
  - Shows transaction reference
  - Lists next steps for donor
  - Link to return home

- **Failure Page**: `/donation-failed?reference=<ref>`
  - Error state with animated X icon
  - Troubleshooting suggestions
  - Option to try again
  - Support contact information

### 6. **Footer Enhancement**
- **File**: `src/components/CustomFooter.tsx`
- **New Feature**:
  - Added "Support Our Mission" button linking to `/donation`
  - Styled with gradient and hover effects
  - Heart icon for visual appeal

## 🗄️ Database Schema

### Donations Table
Run the SQL migration file: `db/migrations/20251217-create-donations-table.sql`

**Table Structure**:
```sql
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount numeric NOT NULL,
  donation_type text NOT NULL CHECK (donation_type IN ('one-time', 'recurring')),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_reference text,
  payment_status text,
  paystack_response jsonb,
  created_at timestamp DEFAULT now(),
  verified_at timestamp
);
```

**Indexes**:
- `idx_donations_email` - For email lookups
- `idx_donations_status` - For filtering by status
- `idx_donations_created_at` - For date-based queries
- `idx_donations_payment_reference` - For Paystack verification

**Policies**:
- Public can insert donations
- All users can read donations (for transparency if needed)

## 🔐 Security Features

1. **Client-Side Validation**:
   - Email format validation
   - Minimum donation amount (₦1,000)
   - Required field checks

2. **Server-Side Validation**:
   - All fields validated in API endpoint
   - Amount range checking
   - Type checking for all inputs

3. **Payment Security**:
   - Paystack handles all sensitive payment data
   - Donation details stored separately from payment data
   - HTTPS-only callbacks
   - Transaction references for verification

4. **RLS (Row Level Security)**:
   - Donations table has RLS enabled
   - Public can insert new donations
   - All users can view donation data

## 🔧 Environment Variables Required

Make sure these are in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_SITE_URL=your_domain.com
```

## 📱 User Flow

1. **User visits homepage**
   ↓
2. **Top notice appears immediately** (showing new campus location)
   ↓
3. **After 8 seconds**, donation modal appears (once per day)
   ↓
4. **User clicks "Donate Now"** → Redirected to `/donation`
   ↓
5. **User fills form** → Submits
   ↓
6. **API endpoint saves donation** → Initializes Paystack payment
   ↓
7. **User redirected to Paystack** → Completes payment
   ↓
8. **Paystack callback** → Verifies transaction
   ↓
9. **User sees success/failure page** → Can return home or try again

## 🎨 Design Features

- **Color Scheme**: 
  - Primary: Indigo (#4f46e5)
  - Secondary: Purple (#a855f7)
  - Accent: Pink (#ec4899)
  - Uses site's existing color palette

- **Animations**:
  - Spring physics for smooth interactions
  - Stagger animations for content appearance
  - Hover scale effects on buttons
  - Pulsing heart icon
  - Floating background elements

- **Responsive Design**:
  - Mobile-first approach
  - Breakpoints for tablet/desktop
  - Touch-friendly interactions
  - Readable on all devices

## 📊 Analytics Considerations

Track these metrics to monitor donation campaign:
- Modal view rate (impressions)
- Modal click-through rate (CTA clicks)
- Donation form completions
- Payment success rate
- Top donation amounts
- Recurring vs one-time ratio
- Donor email domain analysis

## 🚀 Next Steps (Optional Enhancements)

1. **Email Notifications**:
   - Confirmation email when donation received
   - Admin notification for new donations
   - Receipt generation and sending

2. **Analytics Integration**:
   - Track modal interactions
   - Monitor donation conversion rates
   - A/B test different messages

3. **Donor Dashboard** (if authenticated):
   - View donation history
   - Print receipts
   - Tax documentation

4. **Recurring Donation Management**:
   - Cancel subscription
   - Update payment method
   - View billing history

5. **Social Integration**:
   - Share donation achievement on social media
   - Display donation milestones
   - Donor recognition board

## 📝 Notes

- Modal shows once per day (stored in localStorage)
- All currency amounts are in Nigerian Naira (₦)
- Paystack handles the actual payment processing
- All donation data is encrypted and stored securely
- The system is built to be scalable and maintainable
