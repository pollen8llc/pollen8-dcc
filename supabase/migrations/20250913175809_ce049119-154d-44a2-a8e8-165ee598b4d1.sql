-- Create missing modul8_proposals table
CREATE TABLE public.modul8_proposals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_request_id UUID NOT NULL,
    service_provider_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    proposed_budget NUMERIC,
    proposed_timeline TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on modul8_proposals
ALTER TABLE public.modul8_proposals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for modul8_proposals
CREATE POLICY "Service providers can create proposals" 
ON public.modul8_proposals 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM modul8_service_providers p 
        WHERE p.id = modul8_proposals.service_provider_id 
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view relevant proposals" 
ON public.modul8_proposals 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM modul8_service_providers p 
        WHERE p.id = modul8_proposals.service_provider_id 
        AND p.user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM modul8_service_requests sr
        JOIN modul8_organizers o ON o.id = sr.organizer_id
        WHERE sr.id = modul8_proposals.service_request_id 
        AND o.user_id = auth.uid()
    ) OR 
    has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Service providers can update their proposals" 
ON public.modul8_proposals 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM modul8_service_providers p 
        WHERE p.id = modul8_proposals.service_provider_id 
        AND p.user_id = auth.uid()
    )
);

-- Fix the assign_request_to_provider RPC function
CREATE OR REPLACE FUNCTION public.assign_request_to_provider(p_service_request_id uuid, p_service_provider_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    request_exists BOOLEAN;
    provider_exists BOOLEAN;
BEGIN
    -- Check if request exists
    SELECT EXISTS(SELECT 1 FROM modul8_service_requests WHERE id = p_service_request_id)
    INTO request_exists;
    
    IF NOT request_exists THEN
        RAISE EXCEPTION 'Service request not found';
    END IF;
    
    -- Check if provider exists  
    SELECT EXISTS(SELECT 1 FROM modul8_service_providers WHERE id = p_service_provider_id)
    INTO provider_exists;
    
    IF NOT provider_exists THEN
        RAISE EXCEPTION 'Service provider not found';
    END IF;
    
    -- Update the service request
    UPDATE modul8_service_requests 
    SET 
        service_provider_id = p_service_provider_id,
        status = 'assigned',
        engagement_status = 'affiliated',
        updated_at = now()
    WHERE id = p_service_request_id;
    
    RETURN true;
END;
$$;

-- Add trigger for updated_at on modul8_proposals
CREATE TRIGGER update_modul8_proposals_updated_at
    BEFORE UPDATE ON public.modul8_proposals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();