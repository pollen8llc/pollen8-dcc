-- Add missing RMS and admin tables

-- Admin roles table
CREATE TABLE public.admin_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN',
    assigned_by UUID,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- RMS contact affiliations table
CREATE TABLE public.rms_contact_affiliations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID NOT NULL,
    user_id UUID NOT NULL,
    affiliation_type TEXT NOT NULL CHECK (affiliation_type IN ('user', 'contact', 'community')),
    affiliated_user_id UUID,
    affiliated_contact_id UUID,  
    affiliated_community_id UUID,
    relationship TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RMS contact groups table
CREATE TABLE public.rms_contact_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RMS contact group members table
CREATE TABLE public.rms_contact_group_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID NOT NULL,
    group_id UUID NOT NULL,
    added_by UUID NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(contact_id, group_id)
);

-- RMS email notifications table
CREATE TABLE public.rms_email_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    contact_id UUID,
    trigger_id UUID,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RMS triggers table
CREATE TABLE public.rms_triggers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    condition JSONB NOT NULL DEFAULT '{}',
    action TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    recurrence_pattern JSONB NOT NULL DEFAULT '{}',
    last_executed_at TIMESTAMP WITH TIME ZONE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_contact_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_contact_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_triggers ENABLE ROW LEVEL SECURITY;

-- Admin roles RLS policies
CREATE POLICY "Admins can view admin roles" 
ON public.admin_roles FOR SELECT 
USING (has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Admins can manage admin roles" 
ON public.admin_roles FOR ALL 
USING (has_role(auth.uid(), 'ADMIN'));

-- RMS contact affiliations RLS policies
CREATE POLICY "Users can manage their contact affiliations" 
ON public.rms_contact_affiliations FOR ALL 
USING (user_id = auth.uid());

-- RMS contact groups RLS policies
CREATE POLICY "Users can manage their contact groups" 
ON public.rms_contact_groups FOR ALL 
USING (user_id = auth.uid());

-- RMS contact group members RLS policies
CREATE POLICY "Users can manage their contact group members" 
ON public.rms_contact_group_members FOR ALL 
USING (EXISTS (
    SELECT 1 FROM rms_contact_groups g 
    WHERE g.id = group_id AND g.user_id = auth.uid()
));

-- RMS email notifications RLS policies
CREATE POLICY "Users can manage their email notifications" 
ON public.rms_email_notifications FOR ALL 
USING (user_id = auth.uid());

-- RMS triggers RLS policies
CREATE POLICY "Users can manage their triggers" 
ON public.rms_triggers FOR ALL 
USING (user_id = auth.uid());

-- Add foreign key constraints
ALTER TABLE public.admin_roles 
ADD CONSTRAINT admin_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.admin_roles 
ADD CONSTRAINT admin_roles_assigned_by_fkey 
FOREIGN KEY (assigned_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

ALTER TABLE public.rms_contact_affiliations 
ADD CONSTRAINT rms_contact_affiliations_contact_id_fkey 
FOREIGN KEY (contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_affiliations 
ADD CONSTRAINT rms_contact_affiliations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_affiliations 
ADD CONSTRAINT rms_contact_affiliations_affiliated_user_id_fkey 
FOREIGN KEY (affiliated_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_affiliations 
ADD CONSTRAINT rms_contact_affiliations_affiliated_contact_id_fkey 
FOREIGN KEY (affiliated_contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_affiliations 
ADD CONSTRAINT rms_contact_affiliations_affiliated_community_id_fkey 
FOREIGN KEY (affiliated_community_id) REFERENCES public.communities(id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_groups 
ADD CONSTRAINT rms_contact_groups_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_group_members 
ADD CONSTRAINT rms_contact_group_members_contact_id_fkey 
FOREIGN KEY (contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_group_members 
ADD CONSTRAINT rms_contact_group_members_group_id_fkey 
FOREIGN KEY (group_id) REFERENCES public.rms_contact_groups(id) ON DELETE CASCADE;

ALTER TABLE public.rms_contact_group_members 
ADD CONSTRAINT rms_contact_group_members_added_by_fkey 
FOREIGN KEY (added_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rms_email_notifications 
ADD CONSTRAINT rms_email_notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.rms_email_notifications 
ADD CONSTRAINT rms_email_notifications_contact_id_fkey 
FOREIGN KEY (contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.rms_email_notifications 
ADD CONSTRAINT rms_email_notifications_trigger_id_fkey 
FOREIGN KEY (trigger_id) REFERENCES public.rms_triggers(id) ON DELETE CASCADE;

ALTER TABLE public.rms_triggers 
ADD CONSTRAINT rms_triggers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Create update triggers for timestamps
CREATE TRIGGER update_rms_contact_affiliations_updated_at
    BEFORE UPDATE ON public.rms_contact_affiliations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rms_contact_groups_updated_at
    BEFORE UPDATE ON public.rms_contact_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rms_email_notifications_updated_at
    BEFORE UPDATE ON public.rms_email_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rms_triggers_updated_at
    BEFORE UPDATE ON public.rms_triggers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();