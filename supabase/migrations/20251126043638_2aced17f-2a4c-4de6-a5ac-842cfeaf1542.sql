-- Add DELETE policy for rms_outreach_sync_log
-- This allows users to delete their own calendar sync log entries

CREATE POLICY "Users can delete their own sync logs"
ON rms_outreach_sync_log
FOR DELETE
TO authenticated
USING (user_id = auth.uid());