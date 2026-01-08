-- Create formulas table for storing connection strength calculation values
CREATE TABLE public.formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value NUMERIC NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  min_value NUMERIC DEFAULT 0,
  max_value NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category, key)
);

-- Enable RLS
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

-- Anyone can read formulas
CREATE POLICY "Anyone can read formulas" ON public.formulas FOR SELECT USING (true);

-- Admins can update formulas
CREATE POLICY "Admins can update formulas" ON public.formulas FOR UPDATE USING (
  public.has_role(auth.uid(), 'ADMIN')
);

-- Admins can insert formulas
CREATE POLICY "Admins can insert formulas" ON public.formulas FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'ADMIN')
);

-- Create updated_at trigger
CREATE TRIGGER update_formulas_updated_at
  BEFORE UPDATE ON public.formulas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default formula values

-- Category weights (must sum to 100)
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('weights', 'path_weight', 40, 'Path Progress Weight', 'Weight for relationship development path progress', 0, 100),
('weights', 'engagement_weight', 30, 'Engagement Weight', 'Weight for engagement metrics', 0, 100),
('weights', 'origin_weight', 15, 'Origin Weight', 'Weight for contact origin source', 0, 100),
('weights', 'network_weight', 15, 'Network Weight', 'Weight for network connections', 0, 100);

-- Engagement factors
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('engagement', 'calendar_accepts_points', 6, 'Calendar Accept Points', 'Points awarded per calendar invitation accepted', 0, 20),
('engagement', 'fast_response_points', 4, 'Fast Response Points', 'Points for quick response times', 0, 20),
('engagement', 'ignored_penalty', -6, 'Ignored Penalty', 'Penalty for ignored outreach', -20, 0),
('engagement', 'decline_penalty', -5, 'Decline Penalty', 'Penalty for declined invitations', -20, 0),
('engagement', 'gap_penalty', -5, 'Contact Gap Penalty', 'Penalty for long gaps between contact', -20, 0);

-- Origin factors
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('origin', 'invite_points', 12, 'Invite Source Points', 'Points for contacts from invite links', 0, 20),
('origin', 'wizard_points', 10, 'Wizard Source Points', 'Points for contacts added via wizard', 0, 20),
('origin', 'manual_points', 7, 'Manual Source Points', 'Points for manually added contacts', 0, 20),
('origin', 'import_points', 5, 'Import Source Points', 'Points for imported contacts', 0, 20),
('origin', 'unknown_points', 3, 'Unknown Source Points', 'Points for contacts with unknown source', 0, 20),
('origin', 'inviter_bonus', 3, 'Has Inviter Bonus', 'Bonus points if contact has an inviter', 0, 10);

-- Network factors
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('network', 'shared_contacts_multiplier', 1.5, 'Shared Contacts Multiplier', 'Points per shared contact', 0, 10),
('network', 'affiliations_multiplier', 1, 'Affiliations Multiplier', 'Points per shared affiliation', 0, 10),
('network', 'communities_multiplier', 1, 'Communities Multiplier', 'Points per shared community', 0, 10);

-- Path factors
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('path', 'tier_multiplier', 5, 'Tier Level Multiplier', 'Points per tier level achieved', 0, 20),
('path', 'completed_path_points', 4, 'Completed Path Points', 'Points per completed development path', 0, 20),
('path', 'skipped_path_penalty', -2, 'Skipped Path Penalty', 'Penalty per skipped path step', -10, 0);

-- Thresholds for strength levels
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('thresholds', 'star_min', 75, 'Star Minimum Score', 'Minimum score for Star strength', 0, 100),
('thresholds', 'flame_min', 50, 'Flame Minimum Score', 'Minimum score for Flame strength', 0, 100),
('thresholds', 'ember_min', 25, 'Ember Minimum Score', 'Minimum score for Ember strength', 0, 100);

-- Avatar tier thresholds
INSERT INTO public.formulas (category, key, value, label, description, min_value, max_value) VALUES
('avatar_tiers', 'tier_5_min', 80, 'Tier 5 Minimum', 'Minimum network score for Tier 5 avatar', 0, 100),
('avatar_tiers', 'tier_4_min', 60, 'Tier 4 Minimum', 'Minimum network score for Tier 4 avatar', 0, 100),
('avatar_tiers', 'tier_3_min', 40, 'Tier 3 Minimum', 'Minimum network score for Tier 3 avatar', 0, 100),
('avatar_tiers', 'tier_2_min', 20, 'Tier 2 Minimum', 'Minimum network score for Tier 2 avatar', 0, 100);