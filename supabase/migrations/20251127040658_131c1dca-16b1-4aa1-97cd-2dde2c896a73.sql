-- Update the specific outreach task status from 'active' to 'pending' so it appears in the list
UPDATE rms_outreach 
SET status = 'pending' 
WHERE id = '0567b0e2-4d76-49e8-b597-8c2b815e8cc3';