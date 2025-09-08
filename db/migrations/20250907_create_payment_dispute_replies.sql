-- Migration: create payment_dispute_replies table
CREATE TABLE payment_dispute_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id uuid NOT NULL,
  author_role text NOT NULL,
  author_id uuid NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_dispute_replies_dispute_fkey FOREIGN KEY (dispute_id) REFERENCES payment_disputes (id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_dispute_replies_dispute_id ON payment_dispute_replies (dispute_id);
