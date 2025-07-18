
-- Enable real-time updates for modul8_proposal_cards table
ALTER TABLE public.modul8_proposal_cards REPLICA IDENTITY FULL;

-- Add the table to realtime publication if not already added
DO $$
BEGIN
  -- Check if the table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'modul8_proposal_cards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.modul8_proposal_cards;
  END IF;
END $$;

-- Create a trigger to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_modul8_proposal_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_modul8_proposal_cards_updated_at_trigger ON public.modul8_proposal_cards;
CREATE TRIGGER update_modul8_proposal_cards_updated_at_trigger
    BEFORE UPDATE ON public.modul8_proposal_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_modul8_proposal_cards_updated_at();
