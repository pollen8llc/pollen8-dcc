-- Add missing columns to knowledge_articles table
ALTER TABLE public.knowledge_articles 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'ARTICLE';

-- Add missing completion columns to profiles table  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS eco8_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS modul8_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS labr8_complete BOOLEAN DEFAULT false;

-- Create modul8_service_providers table
CREATE TABLE IF NOT EXISTS public.modul8_service_providers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    business_name TEXT,
    description TEXT,
    services_offered TEXT[],
    pricing_model TEXT,
    portfolio_links TEXT[],
    availability_status TEXT DEFAULT 'available',
    rating NUMERIC(3,2) DEFAULT 0.0,
    total_projects INTEGER DEFAULT 0,
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create modul8_organizers table  
CREATE TABLE IF NOT EXISTS public.modul8_organizers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    organization_name TEXT,
    industry TEXT,
    company_size TEXT,
    budget_range TEXT,
    focus_areas TEXT[],
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create modul8_service_requests table
CREATE TABLE IF NOT EXISTS public.modul8_service_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES public.modul8_organizers(id) ON DELETE CASCADE,
    service_provider_id UUID REFERENCES public.modul8_service_providers(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_range TEXT,
    timeline TEXT,
    domain_page INTEGER CHECK (domain_page BETWEEN 1 AND 7),
    status TEXT NOT NULL DEFAULT 'pending',
    engagement_status TEXT DEFAULT 'open',
    project_progress INTEGER DEFAULT 0,
    is_agreement_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_connections table
CREATE TABLE IF NOT EXISTS public.user_connections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    inviter_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    invite_id UUID,
    community_id UUID REFERENCES public.communities(id),
    connection_depth INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(inviter_id, invitee_id)
);

-- Create cross_platform_activity_log table
CREATE TABLE IF NOT EXISTS public.cross_platform_activity_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cross_platform_notifications table  
CREATE TABLE IF NOT EXISTS public.cross_platform_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.modul8_service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_platform_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_platform_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for modul8_service_providers
CREATE POLICY "Service providers can manage their own profile" 
ON public.modul8_service_providers FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view service providers" 
ON public.modul8_service_providers FOR SELECT 
USING (true);

-- RLS policies for modul8_organizers  
CREATE POLICY "Organizers can manage their own profile" 
ON public.modul8_organizers FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view organizers" 
ON public.modul8_organizers FOR SELECT 
USING (true);

-- RLS policies for modul8_service_requests
CREATE POLICY "Users can view relevant service requests" 
ON public.modul8_service_requests FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM modul8_organizers o 
        WHERE o.id = organizer_id AND o.user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM modul8_service_providers p 
        WHERE p.id = service_provider_id AND p.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Organizers can create service requests" 
ON public.modul8_service_requests FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM modul8_organizers o 
        WHERE o.id = organizer_id AND o.user_id = auth.uid()
    )
);

CREATE POLICY "Organizers can update their service requests" 
ON public.modul8_service_requests FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM modul8_organizers o 
        WHERE o.id = organizer_id AND o.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Organizers can delete their service requests" 
ON public.modul8_service_requests FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM modul8_organizers o 
        WHERE o.id = organizer_id AND o.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'ADMIN')
);

-- RLS policies for user_connections
CREATE POLICY "Users can manage their own connections" 
ON public.user_connections FOR ALL 
USING (inviter_id = auth.uid() OR invitee_id = auth.uid());

-- RLS policies for cross_platform_activity_log
CREATE POLICY "Users can manage their own activity log" 
ON public.cross_platform_activity_log FOR ALL 
USING (user_id = auth.uid());

-- RLS policies for cross_platform_notifications
CREATE POLICY "Users can manage their own notifications" 
ON public.cross_platform_notifications FOR ALL 
USING (user_id = auth.uid());

-- Create update triggers for timestamps
CREATE TRIGGER update_modul8_service_providers_updated_at
    BEFORE UPDATE ON public.modul8_service_providers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_organizers_updated_at
    BEFORE UPDATE ON public.modul8_organizers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_service_requests_updated_at
    BEFORE UPDATE ON public.modul8_service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();