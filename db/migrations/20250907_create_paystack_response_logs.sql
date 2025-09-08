-- Migration: create paystack_response_logs table for debugging Paystack responses
CREATE TABLE paystack_response_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL,
  payment_id uuid NULL,
  reference text NULL,
  http_status int NULL,
  raw_response jsonb NULL,
  note text NULL
);

CREATE INDEX idx_paystack_response_logs_payment_id ON paystack_response_logs (payment_id);
CREATE INDEX idx_paystack_response_logs_reference ON paystack_response_logs (reference);
