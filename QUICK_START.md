# 🚀 Quick Start Guide

## 5-Minute Setup

### Step 1: Add Environment Variables (1 min)

In `.env.local`, add:
```env
PAYSTACK_SECRET_KEY=sk_live_your_actual_key_here
```

**Get your key from**: https://dashboard.paystack.co → Settings → API Keys → Live Secret Key

### Step 2: Run SQL Migration (1 min)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to "SQL Editor"
4. Create new query
5. Copy & paste content from: `db/migrations/20251217-create-donations-table.sql`
6. Click "Run"

✅ Table created!

### Step 3: Test Locally (3 min)

```bash
# 1. Start your dev server
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Wait for donation modal (8 seconds)

# 4. Click "Donate Now"

# 5. Fill form with:
#    - Name: Test Donor
#    - Email: test@example.com
#    - Phone: +2348000000000
#    - Amount: 5000

# 6. Submit → Goes to Paystack

# 7. Use test card:
#    Card: 4111 1111 1111 1111
#    Expiry: Any future date (01/25)
#    CVV: Any 3 digits (123)
#    Amount: 5000

# 8. Complete payment

# 9. See success page ✅
```

## What to Check After Setup

### ✅ Modal Appears
- Homepage loads
- Wait 8 seconds
- Beautiful modal with animations
- Has "Donate Now" button

### ✅ Donation Page Works
- Click "Donate Now"
- Form displays
- All fields are visible
- Sidebar info shows

### ✅ Form Validation
- Try to submit empty form → Error
- Enter amount < 1000 → Error
- Enter invalid email → Error
- Fill correctly → No errors

### ✅ Paystack Integration
- Submit form → Redirected to Paystack
- Payment page loads
- Can enter test card
- After payment → Redirected back
- See success/failure page

### ✅ Database Storage
- Go to Supabase
- Open `donations` table
- See your test donation record
- Status should be `completed` (if payment succeeded)
- `paystack_response` contains full data

## File Locations Reference

```
Components:
├── src/components/TopNotice.tsx          (now in header)
├── src/components/DonationModal.tsx      (beautiful new version)
├── src/components/CustomHeader.tsx       (includes TopNotice)
└── src/components/CustomFooter.tsx       (donation link added)

Pages:
├── src/app/donation/page.tsx             (form page)
├── src/app/donation-success/page.tsx     (success page)
└── src/app/donation-failed/page.tsx      (failure page)

API Routes:
├── src/app/api/donations/route.ts        (create & init payment)
└── src/app/api/donations/verify/route.ts (verify payment)

Database:
└── db/migrations/20251217-create-donations-table.sql

Documentation:
├── DONATION_SYSTEM_README.md
├── PAYSTACK_INTEGRATION.md
├── UPDATES_SUMMARY.md
├── IMPLEMENTATION_CHECKLIST.md
└── VISUAL_GUIDE.md (this guide)
```

## Troubleshooting

### Modal doesn't appear?
```
✓ Check if you're on homepage
✓ Wait 8 seconds (it's delayed)
✓ Check browser console for errors
✓ Check localStorage for 'donationModalLastShown'
```

### Form submission fails?
```
✓ Check PAYSTACK_SECRET_KEY is set
✓ Check internet connection
✓ Check amount is >= 1000
✓ Check Supabase connection
✓ Check database table exists
```

### Paystack redirect fails?
```
✓ Verify PAYSTACK_SECRET_KEY is correct
✓ Verify NEXT_PUBLIC_SITE_URL is set
✓ Check Paystack dashboard for errors
✓ Check if Paystack API is accessible
```

### Payment verification fails?
```
✓ Check Paystack reference in URL
✓ Check if payment actually completed
✓ Check Paystack dashboard transaction
✓ Verify verify endpoint is reachable
```

## Testing Paystack Credentials

**Always use test credentials first!**

### Test Card (for Paystack sandbox)
- **Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 01/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Amount**: Any amount (won't be charged)

### Getting Test Credentials
1. Create Paystack account at https://paystack.com
2. Go to Dashboard
3. Look for "Test" vs "Live" toggle
4. Switch to Test mode for testing
5. Use test credentials above

### Switching to Live
1. Go to Paystack Dashboard
2. Switch to "Live" mode
3. Get your Live Secret Key
4. Update `.env.local` with live key
5. Deploy to production

## Common Questions

**Q: Will the modal show every time?**
A: No, it shows once per day per browser (stored in localStorage)

**Q: Can I customize the modal message?**
A: Yes! Edit `src/components/DonationModal.tsx`

**Q: Does Paystack charge fees?**
A: Yes, Paystack charges ~1.5% + ₦100 per transaction

**Q: Can I accept recurring donations?**
A: Yes! Form has "Monthly Recurring" option (set in database as `donation_type`)

**Q: How do I get donor receipts?**
A: Add email notification system (future enhancement)

**Q: Is the payment secure?**
A: Yes! Paystack is PCI compliant and handles all card data

**Q: Where is donation data stored?**
A: Supabase PostgreSQL `donations` table with encryption

**Q: Can I test without Paystack key?**
A: You need a key to test (get free test key from Paystack)

## Next Steps

1. ✅ Add environment variable
2. ✅ Run SQL migration
3. ✅ Test locally
4. ✅ Check everything works
5. 🚀 Deploy to production

**That's it! You're ready!** 🎉

---

Need more help?
- Read: DONATION_SYSTEM_README.md
- Check: PAYSTACK_INTEGRATION.md
- See: VISUAL_GUIDE.md
- Review: IMPLEMENTATION_CHECKLIST.md
