-- Create ions_avatar table for dynamic avatar system
CREATE TABLE public.ions_avatar (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    svg_definition TEXT NOT NULL,
    network_score_threshold INTEGER NOT NULL DEFAULT 0,
    rarity_tier TEXT NOT NULL DEFAULT 'common' CHECK (rarity_tier IN ('common', 'rare', 'epic', 'legendary')),
    animation_type TEXT DEFAULT 'pulse',
    color_scheme JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add avatar fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN selected_avatar_id UUID REFERENCES public.ions_avatar(id),
ADD COLUMN network_score INTEGER DEFAULT 0,
ADD COLUMN unlocked_avatars UUID[] DEFAULT ARRAY[]::UUID[];

-- Enable Row Level Security on ions_avatar
ALTER TABLE public.ions_avatar ENABLE ROW LEVEL SECURITY;

-- Create policies for ions_avatar
CREATE POLICY "Anyone can view active avatars" 
ON public.ions_avatar 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage avatars" 
ON public.ions_avatar 
FOR ALL 
USING (has_role(auth.uid(), 'ADMIN'));

-- Create trigger for updated_at
CREATE TRIGGER update_ions_avatar_updated_at
BEFORE UPDATE ON public.ions_avatar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Magnetosphere avatar
INSERT INTO public.ions_avatar (name, svg_definition, rarity_tier, animation_type) VALUES (
    'Magnetosphere',
    '<svg width="100%" height="100%" viewBox="0 0 64 64" className="w-full h-full">
        <defs>
            <radialGradient id="magnetosphere-{id}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="8" fill="url(#magnetosphere-{id})" />
        <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
    </svg>',
    'common',
    'pulse'
);