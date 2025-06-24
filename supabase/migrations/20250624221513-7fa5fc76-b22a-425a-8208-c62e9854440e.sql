
-- Create proposal cards table
CREATE TABLE public.modul8_proposal_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL,
  response_to_card_id UUID REFERENCES public.modul8_proposal_cards(id),
  card_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'cancelled')),
  notes TEXT,
  scope_link TEXT,
  terms_link TEXT,
  asset_links JSONB DEFAULT '[]'::jsonb,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID
);

-- Create proposal card responses table
CREATE TABLE public.modul8_proposal_card_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.modul8_proposal_cards(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('accept', 'reject', 'counter', 'cancel')),
  responded_by UUID NOT NULL,
  response_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create request comments table (enhanced from existing)
CREATE TABLE public.modul8_request_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  attachment_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_proposal_cards_request_id ON public.modul8_proposal_cards(request_id);
CREATE INDEX idx_proposal_cards_status ON public.modul8_proposal_cards(status);
CREATE INDEX idx_proposal_card_responses_card_id ON public.modul8_proposal_card_responses(card_id);
CREATE INDEX idx_request_comments_request_id ON public.modul8_request_comments(request_id);

-- Enable RLS
ALTER TABLE public.modul8_proposal_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_proposal_card_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_request_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposal cards
CREATE POLICY "Users can view proposal cards for their requests" ON public.modul8_proposal_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create proposal cards for their requests" ON public.modul8_proposal_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
    AND submitted_by = auth.uid()
  );

CREATE POLICY "Users can update their own proposal cards" ON public.modul8_proposal_cards
  FOR UPDATE USING (submitted_by = auth.uid() AND NOT is_locked);

-- RLS Policies for proposal card responses
CREATE POLICY "Users can view responses for their request cards" ON public.modul8_proposal_card_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create responses for request cards" ON public.modul8_proposal_card_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
      AND pc.submitted_by != auth.uid()
    )
    AND responded_by = auth.uid()
  );

-- RLS Policies for request comments
CREATE POLICY "Users can view comments for their requests" ON public.modul8_request_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create comments for their requests" ON public.modul8_request_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update their own comments" ON public.modul8_request_comments
  FOR UPDATE USING (user_id = auth.uid());

-- Function to create initial proposal card when request is created
CREATE OR REPLACE FUNCTION public.create_initial_proposal_card()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.modul8_proposal_cards (
    request_id,
    submitted_by,
    card_number,
    notes,
    status
  ) VALUES (
    NEW.id,
    (SELECT user_id FROM public.modul8_organizers WHERE id = NEW.organizer_id),
    1,
    'Initial service request',
    'pending'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle proposal card responses
CREATE OR REPLACE FUNCTION public.handle_proposal_card_response()
RETURNS TRIGGER AS $$
BEGIN
  -- Lock the card being responded to
  UPDATE public.modul8_proposal_cards 
  SET 
    is_locked = true,
    status = NEW.response_type,
    responded_at = NEW.created_at,
    responded_by = NEW.responded_by,
    updated_at = NEW.created_at
  WHERE id = NEW.card_id;
  
  -- Update service request status if accepted
  IF NEW.response_type = 'accept' THEN
    UPDATE public.modul8_service_requests 
    SET status = 'agreed', updated_at = NEW.created_at
    WHERE id = (SELECT request_id FROM public.modul8_proposal_cards WHERE id = NEW.card_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER create_initial_proposal_card_trigger
  AFTER INSERT ON public.modul8_service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_proposal_card();

CREATE TRIGGER handle_proposal_card_response_trigger
  AFTER INSERT ON public.modul8_proposal_card_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_proposal_card_response();

-- Add trigger for updated_at
CREATE TRIGGER update_proposal_cards_updated_at
  BEFORE UPDATE ON public.modul8_proposal_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_request_comments_updated_at
  BEFORE UPDATE ON public.modul8_request_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
