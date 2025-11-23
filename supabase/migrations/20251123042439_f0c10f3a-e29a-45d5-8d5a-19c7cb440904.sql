-- Enable realtime for notification and sync tables
ALTER TABLE cross_platform_notifications REPLICA IDENTITY FULL;
ALTER TABLE rms_email_notifications REPLICA IDENTITY FULL;
ALTER TABLE rms_outreach_sync_log REPLICA IDENTITY FULL;
ALTER TABLE rms_outreach REPLICA IDENTITY FULL;
ALTER TABLE rms_triggers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cross_platform_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE rms_email_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE rms_outreach_sync_log;
ALTER PUBLICATION supabase_realtime ADD TABLE rms_outreach;
ALTER PUBLICATION supabase_realtime ADD TABLE rms_triggers;