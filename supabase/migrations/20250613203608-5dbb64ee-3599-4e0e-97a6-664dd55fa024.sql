
-- Create service providers table
CREATE TABLE public.modul8_service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  logo_url TEXT,
  tagline TEXT,
  description TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  pricing_range JSONB DEFAULT '{}'::jsonb,
  portfolio_links TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community organizers table
CREATE TABLE public.modul8_organizers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  organization_name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service requests/IOTAS table
CREATE TABLE public.modul8_service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.modul8_organizers(id) NOT NULL,
  service_provider_id UUID REFERENCES public.modul8_service_providers(id),
  domain_page INTEGER NOT NULL CHECK (domain_page BETWEEN 1 AND 8),
  title TEXT NOT NULL,
  description TEXT,
  budget_range JSONB DEFAULT '{}'::jsonb,
  timeline TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'agreed', 'completed', 'cancelled')),
  engagement_status TEXT DEFAULT 'none' CHECK (engagement_status IN ('none', 'negotiating', 'affiliated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals/negotiations table
CREATE TABLE public.modul8_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID REFERENCES public.modul8_service_requests(id) NOT NULL,
  from_user_id UUID REFERENCES auth.users NOT NULL,
  proposal_type TEXT NOT NULL CHECK (proposal_type IN ('initial', 'counter', 'revision')),
  quote_amount DECIMAL(10,2),
  timeline TEXT,
  scope_details TEXT,
  terms TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deal contracts table
CREATE TABLE public.modul8_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID REFERENCES public.modul8_service_requests(id) NOT NULL,
  organizer_id UUID REFERENCES public.modul8_organizers(id) NOT NULL,
  service_provider_id UUID REFERENCES public.modul8_service_providers(id) NOT NULL,
  final_amount DECIMAL(10,2) NOT NULL,
  deal_terms JSONB NOT NULL,
  deel_contract_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for service providers
ALTER TABLE public.modul8_service_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all service providers" 
  ON public.modul8_service_providers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own service provider profile" 
  ON public.modul8_service_providers 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for organizers
ALTER TABLE public.modul8_organizers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all organizers" 
  ON public.modul8_organizers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own organizer profile" 
  ON public.modul8_organizers 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for service requests
ALTER TABLE public.modul8_service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage their own requests" 
  ON public.modul8_service_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_organizers 
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Service providers can view requests" 
  ON public.modul8_service_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service providers can update assigned requests" 
  ON public.modul8_service_requests 
  FOR UPDATE 
  USING (
    service_provider_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- Add RLS policies for proposals
ALTER TABLE public.modul8_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage proposals they created" 
  ON public.modul8_proposals 
  FOR ALL 
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can view proposals for their requests" 
  ON public.modul8_proposals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      WHERE sr.id = service_request_id AND o.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = service_request_id AND sp.user_id = auth.uid()
    )
  );

-- Add RLS policies for deals
ALTER TABLE public.modul8_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deals they are part of" 
  ON public.modul8_deals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_organizers 
      WHERE id = organizer_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own deals" 
  ON public.modul8_deals 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_organizers 
      WHERE id = organizer_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );
