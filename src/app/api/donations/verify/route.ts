import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference parameter is required' },
        { status: 400 }
      )
    }

    // Verify the transaction with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData || !verifyData.status) {
      console.error('Paystack verification failed:', verifyData)
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Get the donation ID from metadata
    const donationId = verifyData?.data?.metadata?.donation_id

    if (!donationId) {
      console.error('No donation ID in Paystack metadata')
      return NextResponse.json(
        { error: 'Donation ID not found' },
        { status: 400 }
      )
    }

    // Update donation status based on Paystack response
    const paystackStatus = verifyData?.data?.status
    const donationStatus =
      paystackStatus === 'success' ? 'completed' : 'failed'

    const { error: updateError } = await supabase
      .from('donations')
      .update({
        status: donationStatus,
        payment_status: paystackStatus,
        paystack_response: verifyData?.data,
        verified_at: new Date().toISOString(),
      })
      .eq('id', donationId)

    if (updateError) {
      console.error('Failed to update donation:', updateError)
    }

    // Redirect to success or failure page
    const redirectUrl =
      donationStatus === 'completed'
        ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}/donation-success?reference=${reference}`
        : `${process.env.NEXT_PUBLIC_SITE_URL || ''}/donation-failed?reference=${reference}`

    return NextResponse.redirect(redirectUrl, { status: 303 })
  } catch (err) {
    console.error('Donation verification error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
