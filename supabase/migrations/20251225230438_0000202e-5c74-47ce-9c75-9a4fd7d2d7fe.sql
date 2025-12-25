-- =====================================================
-- ACTV8 SYSTEM TABLES
-- =====================================================

-- 1. Development Paths (system reference data)
CREATE TABLE public.rms_actv8_paths (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  target_strength TEXT NOT NULL,
  is_system BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Development Path Steps
CREATE TABLE public.rms_actv8_path_steps (
  id TEXT PRIMARY KEY,
  path_id TEXT NOT NULL REFERENCES public.rms_actv8_paths(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  suggested_channel TEXT NOT NULL,
  suggested_tone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Strategies for activated contacts
CREATE TABLE public.rms_actv8_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actv8_contact_id UUID NOT NULL REFERENCES public.rms_actv8_contacts(id) ON DELETE CASCADE,
  intention_id TEXT NOT NULL,
  intention_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(actv8_contact_id)
);

-- 4. Strategy Actions
CREATE TABLE public.rms_actv8_strategy_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID NOT NULL REFERENCES public.rms_actv8_strategies(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  scheduled_date DATE,
  channel TEXT NOT NULL,
  tone TEXT NOT NULL,
  status TEXT DEFAULT 'planned',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Interactions log
CREATE TABLE public.rms_actv8_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actv8_contact_id UUID NOT NULL REFERENCES public.rms_actv8_contacts(id) ON DELETE CASCADE,
  interaction_date DATE NOT NULL,
  location TEXT,
  topics TEXT,
  warmth TEXT DEFAULT 'neutral',
  strengthened BOOLEAN DEFAULT false,
  follow_up TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_actv8_path_steps_path ON public.rms_actv8_path_steps(path_id);
CREATE INDEX idx_actv8_strategies_user ON public.rms_actv8_strategies(user_id);
CREATE INDEX idx_actv8_strategies_contact ON public.rms_actv8_strategies(actv8_contact_id);
CREATE INDEX idx_actv8_actions_strategy ON public.rms_actv8_strategy_actions(strategy_id);
CREATE INDEX idx_actv8_actions_status ON public.rms_actv8_strategy_actions(status);
CREATE INDEX idx_actv8_interactions_user ON public.rms_actv8_interactions(user_id);
CREATE INDEX idx_actv8_interactions_contact ON public.rms_actv8_interactions(actv8_contact_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Paths: Public read (system data)
ALTER TABLE public.rms_actv8_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read paths" ON public.rms_actv8_paths FOR SELECT USING (true);
CREATE POLICY "Users can create custom paths" ON public.rms_actv8_paths FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Path Steps: Public read
ALTER TABLE public.rms_actv8_path_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read path steps" ON public.rms_actv8_path_steps FOR SELECT USING (true);

-- Strategies: User owns
ALTER TABLE public.rms_actv8_strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own strategies" ON public.rms_actv8_strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own strategies" ON public.rms_actv8_strategies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strategies" ON public.rms_actv8_strategies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own strategies" ON public.rms_actv8_strategies FOR DELETE USING (auth.uid() = user_id);

-- Strategy Actions: Via strategy ownership
ALTER TABLE public.rms_actv8_strategy_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own strategy actions" ON public.rms_actv8_strategy_actions 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.rms_actv8_strategies s WHERE s.id = strategy_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can create own strategy actions" ON public.rms_actv8_strategy_actions 
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.rms_actv8_strategies s WHERE s.id = strategy_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can update own strategy actions" ON public.rms_actv8_strategy_actions 
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.rms_actv8_strategies s WHERE s.id = strategy_id AND s.user_id = auth.uid()));
CREATE POLICY "Users can delete own strategy actions" ON public.rms_actv8_strategy_actions 
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.rms_actv8_strategies s WHERE s.id = strategy_id AND s.user_id = auth.uid()));

-- Interactions: User owns
ALTER TABLE public.rms_actv8_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interactions" ON public.rms_actv8_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own interactions" ON public.rms_actv8_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON public.rms_actv8_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interactions" ON public.rms_actv8_interactions FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_actv8_strategies_updated_at
  BEFORE UPDATE ON public.rms_actv8_strategies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_actv8_actions_updated_at
  BEFORE UPDATE ON public.rms_actv8_strategy_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_actv8_paths_updated_at
  BEFORE UPDATE ON public.rms_actv8_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SEED DATA: Development Paths
-- =====================================================
INSERT INTO public.rms_actv8_paths (id, name, description, target_strength, is_system) VALUES
  ('new_connection', 'New Connection', 'For brand new contacts you want to develop into meaningful relationships', 'growing', true),
  ('strengthen_bond', 'Strengthen Bond', 'For existing connections you want to deepen', 'solid', true),
  ('professional_growth', 'Professional Growth', 'For contacts who can help with career development', 'solid', true),
  ('mentorship', 'Mentorship Track', 'For establishing a mentor-mentee relationship', 'thick', true),
  ('reconnect', 'Reconnect', 'For dormant relationships you want to revive', 'growing', true),
  ('event_networking', 'Event Networking', 'For contacts met at events or conferences', 'growing', true);

-- =====================================================
-- SEED DATA: Path Steps
-- =====================================================
-- New Connection Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('nc_1', 'new_connection', 1, 'Initial Outreach', 'Send a friendly introduction message referencing how you met', 'soft_checkin', 'dm', 'friendly'),
  ('nc_2', 'new_connection', 2, 'Share Value', 'Share something relevant to their interests or work', 'send_resource', 'email', 'helpful'),
  ('nc_3', 'new_connection', 3, 'Coffee Chat', 'Suggest a casual coffee or virtual meeting', 'coffee', 'dm', 'friendly'),
  ('nc_4', 'new_connection', 4, 'Follow Up', 'Send a thoughtful follow-up after meeting', 'thank_you', 'email', 'grateful');

-- Strengthen Bond Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('sb_1', 'strengthen_bond', 1, 'Meaningful Check-in', 'Reach out about something specific in their life', 'deep_checkin', 'dm', 'caring'),
  ('sb_2', 'strengthen_bond', 2, 'Shared Experience', 'Suggest doing an activity together', 'invite_event', 'dm', 'enthusiastic'),
  ('sb_3', 'strengthen_bond', 3, 'Support Gesture', 'Offer help or support for something they are working on', 'offer_help', 'email', 'supportive'),
  ('sb_4', 'strengthen_bond', 4, 'Deepen Trust', 'Share something personal or vulnerable', 'personal_share', 'in_person', 'authentic');

-- Professional Growth Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('pg_1', 'professional_growth', 1, 'Career Conversation', 'Schedule a call to discuss career paths', 'schedule_call', 'email', 'professional'),
  ('pg_2', 'professional_growth', 2, 'Ask for Advice', 'Request specific advice on a professional challenge', 'ask_advice', 'email', 'respectful'),
  ('pg_3', 'professional_growth', 3, 'Follow Through', 'Report back on how their advice helped', 'update', 'email', 'grateful'),
  ('pg_4', 'professional_growth', 4, 'Reciprocate', 'Offer value back based on your expertise', 'offer_expertise', 'email', 'helpful');

-- Mentorship Track Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('mt_1', 'mentorship', 1, 'Express Interest', 'Express genuine interest in learning from them', 'mentorship_ask', 'email', 'humble'),
  ('mt_2', 'mentorship', 2, 'Set Expectations', 'Discuss what a mentorship relationship could look like', 'schedule_call', 'video', 'professional'),
  ('mt_3', 'mentorship', 3, 'First Session', 'Have your first structured mentorship conversation', 'meeting', 'in_person', 'curious'),
  ('mt_4', 'mentorship', 4, 'Show Growth', 'Demonstrate progress and express gratitude', 'update', 'email', 'grateful');

-- Reconnect Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('rc_1', 'reconnect', 1, 'Break the Ice', 'Send a warm message acknowledging it has been a while', 'reconnect', 'dm', 'warm'),
  ('rc_2', 'reconnect', 2, 'Show Interest', 'Ask about what they have been up to lately', 'catch_up', 'dm', 'curious'),
  ('rc_3', 'reconnect', 3, 'Suggest Meeting', 'Propose getting together to catch up properly', 'coffee', 'dm', 'enthusiastic'),
  ('rc_4', 'reconnect', 4, 'Maintain Momentum', 'Schedule a recurring touchpoint to stay connected', 'schedule_recurring', 'email', 'committed');

-- Event Networking Steps
INSERT INTO public.rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone) VALUES
  ('en_1', 'event_networking', 1, 'Same Day Follow-up', 'Send a quick note the same day you met', 'quick_hello', 'dm', 'friendly'),
  ('en_2', 'event_networking', 2, 'Add Context', 'Connect on LinkedIn with a personalized note', 'linkedin_connect', 'linkedin', 'professional'),
  ('en_3', 'event_networking', 3, 'Continue Conversation', 'Reference something specific you discussed', 'continue_topic', 'email', 'engaging'),
  ('en_4', 'event_networking', 4, 'Move Offline', 'Suggest meeting outside the event context', 'coffee', 'email', 'friendly');