-- Simple update to set Magnetosphere as default avatar for existing users
UPDATE profiles 
SET selected_avatar_id = (
    SELECT id FROM ions_avatar WHERE name = 'Magnetosphere' AND is_active = true LIMIT 1
)
WHERE selected_avatar_id IS NULL;