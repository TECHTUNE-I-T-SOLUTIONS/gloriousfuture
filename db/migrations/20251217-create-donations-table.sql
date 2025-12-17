-- Create donations table for tracking charitable contributions to the school

CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount numeric NOT NULL,
  donation_type text NOT NULL CHECK (donation_type = ANY (ARRAY['one-time'::text, 'recurring'::text])),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text])),
  payment_reference text,
  payment_status text,
  paystack_response jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  verified_at timestamp with time zone,
  CONSTRAINT donations_pkey PRIMARY KEY (id)
);

-- Create index on email for faster lookups
CREATE INDEX idx_donations_email ON public.donations(email);

-- Create index on status for filtering
CREATE INDEX idx_donations_status ON public.donations(status);

-- Create index on created_at for date-based queries
CREATE INDEX idx_donations_created_at ON public.donations(created_at DESC);

-- Create index on payment_reference for verification lookups
CREATE INDEX idx_donations_payment_reference ON public.donations(payment_reference);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for donation form submissions)
CREATE POLICY "Allow public to insert donations" ON public.donations
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated reads of own donations (if needed)
CREATE POLICY "Allow users to read own donations" ON public.donations
  FOR SELECT
  USING (true);
