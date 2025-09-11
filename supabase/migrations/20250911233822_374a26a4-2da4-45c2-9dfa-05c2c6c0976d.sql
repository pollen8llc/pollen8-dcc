-- Create knowledge_tags table
CREATE TABLE IF NOT EXISTS public.knowledge_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID
);

ALTER TABLE public.knowledge_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge tags are viewable by everyone" ON public.knowledge_tags
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON public.knowledge_tags
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create modul8_proposal_cards table
CREATE TABLE IF NOT EXISTS public.modul8_proposal_cards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    proposed_timeline TEXT,
    proposed_budget DECIMAL,
    status TEXT NOT NULL DEFAULT 'pending',
    deel_contract_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.modul8_proposal_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view proposal cards" ON public.modul8_proposal_cards
FOR SELECT USING (true);

CREATE POLICY "Providers can manage their proposal cards" ON public.modul8_proposal_cards
FOR ALL USING (auth.uid() = provider_id);

-- Create rms_contact_categories table
CREATE TABLE IF NOT EXISTS public.rms_contact_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(name, user_id)
);

ALTER TABLE public.rms_contact_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own categories" ON public.rms_contact_categories
FOR ALL USING (auth.uid() = user_id);

-- Create rms_contacts table
CREATE TABLE IF NOT EXISTS public.rms_contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    position TEXT,
    notes TEXT,
    category_id UUID REFERENCES public.rms_contact_categories(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rms_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contacts" ON public.rms_contacts
FOR ALL USING (auth.uid() = user_id);

-- Create update_user_role_self RPC function
CREATE OR REPLACE FUNCTION public.update_user_role_self(p_role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Get role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = p_role_name;
    
    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'Role % does not exist', p_role_name;
    END IF;
    
    -- Remove existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    
    -- Add new role
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (v_user_id, v_role_id, v_user_id);
    
    -- Update role cache in profiles table
    UPDATE public.profiles 
    SET role = p_role_name, updated_at = NOW()
    WHERE user_id = v_user_id;
    
    RETURN true;
END;
$$;