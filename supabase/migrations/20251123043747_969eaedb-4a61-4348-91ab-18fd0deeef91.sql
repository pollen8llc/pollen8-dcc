-- Update Washington D.C. with proper coordinates and aliases
UPDATE locations
SET 
  latitude = 38.9072,
  longitude = -77.0369,
  aliases = ARRAY['DC', 'Washington DC', 'District of Columbia', 'D.C.']
WHERE name = 'Washington D.C.' AND type = 'state';