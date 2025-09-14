-- Phase 1: Database Schema Fixes

-- Create the missing modul8_proposal_card_responses table
CREATE TABLE public.modul8_proposal_card_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL,
  user_id UUID NOT NULL,
  response_type TEXT NOT NULL CHECK (response_type IN ('accept', 'reject', 'counter', 'cancel')),
  response_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.modul8_proposal_card_responses 
ADD CONSTRAINT fk_proposal_card_responses_card_id 
FOREIGN KEY (card_id) REFERENCES public.modul8_proposal_cards(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX idx_proposal_card_responses_card_id ON public.modul8_proposal_card_responses(card_id);
CREATE INDEX idx_proposal_card_responses_user_id ON public.modul8_proposal_card_responses(user_id);
CREATE INDEX idx_proposal_card_responses_created_at ON public.modul8_proposal_card_responses(created_at);

-- Prevent duplicate responses from same user for same card
CREATE UNIQUE INDEX idx_unique_user_card_response ON public.modul8_proposal_card_responses(card_id, user_id);

-- Enable RLS
ALTER TABLE public.modul8_proposal_card_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cross-platform access
CREATE POLICY "Users can create their own responses" 
ON public.modul8_proposal_card_responses 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view responses to cards they can see" 
ON public.modul8_proposal_card_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.modul8_proposal_cards pc
    WHERE pc.id = modul8_proposal_card_responses.card_id
  )
);

CREATE POLICY "Users can update their own responses" 
ON public.modul8_proposal_card_responses 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_proposal_card_responses_updated_at
BEFORE UPDATE ON public.modul8_proposal_card_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.modul8_proposal_card_responses;

-- Fix modul8_proposal_cards table to match the interface expectations
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS submitted_by UUID;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS response_to_card_id UUID;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS card_number INTEGER DEFAULT 1;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS scope_link TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS terms_link TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS asset_links TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS negotiated_title TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS negotiated_description TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS negotiated_budget_range JSONB;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS negotiated_timeline TEXT;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.modul8_proposal_cards ADD COLUMN IF NOT EXISTS responded_by UUID;

-- Update submitted_by to match provider_id where null
UPDATE public.modul8_proposal_cards 
SET submitted_by = provider_id 
WHERE submitted_by IS NULL;

-- Add sequence for card_number if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'proposal_card_number_seq') THEN
    CREATE SEQUENCE public.proposal_card_number_seq START 1;
  END IF;
END $$;