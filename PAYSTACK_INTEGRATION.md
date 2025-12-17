# Paystack Integration Guide

## Overview
The donation system uses Paystack for secure payment processing. This guide explains how it all works together.

## 🔄 Payment Flow

### 1. User Fills Donation Form
- Navigate to `/donation`
- Fill in full name, email, phone, amount, type, and optional message
- Client-side validation checks:
  - All required fields are filled
  - Email is valid format
  - Amount is at least ₦1,000
  - Phone is provided

### 2. Form Submission to API
**Endpoint**: `POST /api/donations`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+2348035770623",
  "amount": 50000,
  "donationType": "one-time",
  "message": "Supporting education"
}
```

### 3. Server-Side Processing

The API endpoint (`src/app/api/donations/route.ts`) does the following:

a. **Validates Input**:
   - Checks all required fields
   - Validates amount (must be > 1000)
   - Validates donation type (one-time or recurring)

b. **Saves to Database**:
   - Inserts donation record to Supabase `donations` table
   - Status set to `pending`
   - Returns donation with generated UUID

c. **Initializes Paystack Payment**:
   - Converts amount to Kobo (₦1 = 100 Kobo)
   - Calls `https://api.paystack.co/transaction/initialize`
   - Passes authorization URL back to client

**Response**:
```json
{
  "success": true,
  "donation": {
    "id": "uuid-string",
    "full_name": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "amount": 50000,
    ...
  },
  "authorizationUrl": "https://checkout.paystack.com/...",
  "paystack": { ...paystack_response }
}
```

### 4. User Redirected to Paystack
- Client receives `authorizationUrl`
- User is redirected to Paystack's hosted payment page
- User enters card details securely on Paystack's servers
- After payment, user is redirected back to your app

### 5. Payment Verification

**Endpoint**: `GET /api/donations/verify?reference=<paystack_reference>`

Paystack redirects the user with a reference parameter:
- `reference` - Unique transaction reference from Paystack

The verify endpoint:
- Queries Paystack API to verify the transaction
- Gets payment status (success/failed)
- Updates donation record with status and Paystack response
- Redirects user to appropriate page

### 6. Success/Failure Pages
- **Success**: `/donation-success?reference=<ref>`
  - Shows confirmation
  - Displays transaction reference
  - Next steps information

- **Failure**: `/donation-failed?reference=<ref>`
  - Shows error message
  - Troubleshooting tips
  - Option to try again

## 🔐 Environment Variables

Required in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# Site URL (for Paystack callbacks)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 💾 Database Storage

### Donations Table Structure

```sql
CREATE TABLE donations (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount numeric NOT NULL,
  donation_type text CHECK (value IN ('one-time', 'recurring')),
  message text,
  status text CHECK (value IN ('pending', 'completed', 'failed')),
  payment_reference text,
  payment_status text,
  paystack_response jsonb,
  created_at timestamp,
  verified_at timestamp
);
```

### What Gets Stored

1. **Donation Details**:
   - Full name, email, phone
   - Amount and type (one-time/recurring)
   - Donor's message
   - Timestamps

2. **Payment Information**:
   - Paystack reference (transaction ID)
   - Payment status from Paystack
   - Full Paystack response (JSON)
   - Verification timestamp

## ✅ Testing Paystack Integration

### Paystack Test Credentials
Use these for testing (available in Paystack dashboard):

**Test Cards**:
- Visa: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Amount: Any amount (will show as test transaction)

### Test Transaction Flow

1. Go to `/donation`
2. Fill form with test data:
   - Name: Test Name
   - Email: test@example.com
   - Phone: +2348000000000
   - Amount: 5000 (₦5,000)
3. Click "Donate Now"
4. Use test card details
5. Verify transaction completes
6. Check database for donation record

## 🛡️ Security Measures

### 1. API Security
- Service role key only used server-side
- Never expose keys to client
- All inputs validated before processing
- Error handling without exposing sensitive info

### 2. Payment Security
- Paystack handles all card details
- Your app never touches card information
- HTTPS-only callbacks
- Transaction reference verification

### 3. Data Security
- Donation records encrypted at rest (Supabase)
- RLS policies prevent unauthorized access
- Paystack response stored for audit trail
- All timestamps tracked

## 🐛 Troubleshooting

### "Payment initialization failed"
- Check `PAYSTACK_SECRET_KEY` is correct
- Verify Paystack API is accessible
- Check network connectivity

### "Donation record not found"
- Verify Supabase connection
- Check `SUPABASE_SERVICE_ROLE_KEY`
- Ensure `donations` table exists

### User redirected to failure page
- Check Paystack reference in URL
- Verify Paystack payment was actually completed
- Check Paystack dashboard for transaction

### Duplicate donations
- Each form submission creates one record
- Use payment_reference to deduplicate if needed
- Check for rapid form submissions

## 📊 Monitoring

### What to Monitor

1. **Donation Rate**:
   - Track monthly donations
   - Monitor success rate
   - Identify drop-off points

2. **Payment Issues**:
   - Count failed vs completed
   - Monitor error messages
   - Track failed email domains

3. **Donor Information**:
   - Geographic distribution
   - Donation amount distribution
   - One-time vs recurring ratio

### Useful Queries

```sql
-- Total donations received
SELECT SUM(amount) FROM donations WHERE status = 'completed';

-- Donations by type
SELECT donation_type, COUNT(*), SUM(amount) 
FROM donations 
WHERE status = 'completed'
GROUP BY donation_type;

-- Average donation
SELECT AVG(amount) FROM donations WHERE status = 'completed';

-- Donations this month
SELECT COUNT(*), SUM(amount) 
FROM donations 
WHERE status = 'completed' 
AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
```

## 🚀 Production Checklist

- [ ] Paystack account created and verified
- [ ] Live API keys obtained from Paystack
- [ ] `PAYSTACK_SECRET_KEY` set with live key
- [ ] `NEXT_PUBLIC_SITE_URL` points to production domain
- [ ] Database `donations` table created
- [ ] HTTPS enabled on domain
- [ ] Email notifications configured (optional)
- [ ] Donation page tested end-to-end
- [ ] Success/failure pages tested
- [ ] Error handling verified
- [ ] Admin monitoring set up

## 📞 Support

For Paystack-related issues:
- [Paystack Dashboard](https://dashboard.paystack.co)
- [Paystack API Documentation](https://paystack.com/docs)
- [Paystack Support](https://support.paystack.com)

For application issues:
- Check server logs
- Review Paystack response in `paystack_response` JSONB field
- Test with Paystack test credentials first
