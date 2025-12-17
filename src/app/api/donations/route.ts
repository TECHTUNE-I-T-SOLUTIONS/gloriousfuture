import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, amount, donationType, message } = body || {}

    // Validate required fields
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: 'Donation amount must be at least ₦1,000' },
        { status: 400 }
      )
    }
    if (!donationType || !['one-time', 'recurring'].includes(donationType)) {
      return NextResponse.json(
        { error: 'Invalid donation type' },
        { status: 400 }
      )
    }

    // Parse amount as number
    const amountValue = Number(amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      )
    }

    // Save donation to database
    const { data: donation, error: dbError } = await supabase
      .from('donations')
      .insert({
        full_name: fullName,
        email,
        phone,
        amount: amountValue,
        donation_type: donationType,
        message: message || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save donation details' },
        { status: 500 }
      )
    }

    // Convert to Kobo for Paystack (Paystack uses the smallest currency unit)
    const amountKobo = Math.round(amountValue * 100)

    // Build callback URL
    const host =
      req.headers.get('x-forwarded-host') ||
      req.headers.get('host') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      ''
    const protocol = host && host.includes('localhost') ? 'http' : 'https'
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`

    // Initialize Paystack transaction
    const paystackRes = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountKobo,
          callback_url: `${base}/api/donations/verify`,
          metadata: {
            donation_id: donation.id,
            full_name: fullName,
            donation_type: donationType,
          },
        }),
      }
    )

    const paystackData = await paystackRes.json()

    if (!paystackData || !paystackData.status) {
      console.error('Paystack error:', paystackData)
      return NextResponse.json(
        { error: 'Failed to initialize payment', details: paystackData },
        { status: 502 }
      )
    }

    // Store Paystack reference in donation record
    const reference = paystackData?.data?.reference || null
    if (reference) {
      try {
        await supabase
          .from('donations')
          .update({ payment_reference: reference })
          .eq('id', donation.id)
      } catch (e) {
        console.error('Failed to update donation reference:', e)
      }
    }

    return NextResponse.json({
      success: true,
      donation,
      paystack: paystackData,
      authorizationUrl: paystackData?.data?.authorization_url,
      amount: amountValue,
      amountKobo,
      reference,
    })
  } catch (err) {
    console.error('Donation API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
