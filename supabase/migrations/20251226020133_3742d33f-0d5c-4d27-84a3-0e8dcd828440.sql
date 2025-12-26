-- First delete old mentorship steps (before updating the path id)
DELETE FROM rms_actv8_path_steps WHERE path_id = 'mentorship';

-- Update any existing actv8_contacts that were on the mentorship path
UPDATE rms_actv8_contacts 
SET development_path_id = 'build_rapport',
    completed_steps = '{}',
    current_step_index = 0
WHERE development_path_id = 'mentorship';

-- Now update the Mentorship Track to Build Rapport Track
UPDATE rms_actv8_paths 
SET 
  id = 'build_rapport',
  name = 'Build Rapport',
  description = 'Build deeper connections through a series of meaningful meetings'
WHERE id = 'mentorship';

-- Insert new Build Rapport meeting-focused steps
INSERT INTO rms_actv8_path_steps (id, path_id, step_order, name, description, suggested_action, suggested_channel, suggested_tone)
VALUES
  ('br_1', 'build_rapport', 1, 'Casual Introduction', 'First informal meeting to get to know each other over coffee or a quick video call', 'meeting', 'coffee', 'friendly'),
  ('br_2', 'build_rapport', 2, 'Deeper Conversation', 'Extended meeting to explore shared interests and build understanding', 'meeting', 'lunch', 'friendly'),
  ('br_3', 'build_rapport', 3, 'Collaborative Meeting', 'Work on something together or share ideas in a working session', 'meeting', 'in_person', 'collaborative'),
  ('br_4', 'build_rapport', 4, 'Ongoing Connection', 'Establish a regular meeting cadence to maintain the relationship', 'meeting', 'recurring', 'friendly');