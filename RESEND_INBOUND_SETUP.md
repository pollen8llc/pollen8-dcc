# Resend Inbound Email Setup for Calendar Sync

## Overview
This guide walks you through setting up Resend inbound email to receive calendar update notifications from users' calendar providers (Google Calendar, Outlook, Apple Calendar, etc.).

## Prerequisites
- Active Resend account
- RESEND_API_KEY already configured in Supabase secrets
- Domain ownership (rel8.app or ecosystembuilder.app)

## Step 1: Configure Receiving Domain

1. Log into your [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain" or select existing domain
3. Choose the domain you want to use for receiving emails:
   - **Recommended**: `rel8.app`
   - Alternative: `ecosystembuilder.app`

## Step 2: Add DNS Records

Add the following DNS records to your domain registrar:

### MX Records (for receiving email)
```
Type: MX
Host: @  (or root domain)
Priority: 10
Value: inbound.resend.com
```

### TXT Records (for SPF verification)
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all
```

**Note**: DNS propagation can take up to 48 hours, but typically completes within 15 minutes.

## Step 3: Verify Domain

1. In Resend dashboard, click "Verify" next to your domain
2. Wait for DNS records to propagate and verification to complete
3. You should see a green checkmark when verified

## Step 4: Create Inbound Webhook

1. Navigate to [Resend Webhooks](https://resend.com/webhooks)
2. Click "Add Webhook"
3. Configure webhook settings:
   - **Name**: `REL8 Calendar Sync`
   - **URL**: `https://oltcuwvgdzszxshpfnre.supabase.co/functions/v1/receive-calendar-update`
   - **Events**: Select `email.received`
   - **Status**: Active

4. Click "Create Webhook"

## Step 5: Configure Inbound Email Address

1. Go to [Resend Inbound](https://resend.com/inbound)
2. Click "Add Inbound Email"
3. Set up the receiving address:
   - **Email**: `notifications@rel8.app` (or your chosen domain)
   - **Forward to**: Leave blank (webhook handles it)
   - **Webhook**: Select the webhook you created in Step 4

4. Click "Save"

## Step 6: Test the Integration

### Option 1: Send Test Email
1. Send an email with an ICS attachment to `notifications@rel8.app`
2. Check Supabase Edge Function logs for `receive-calendar-update`
3. Verify logs show successful ICS parsing

### Option 2: Real-World Test
1. Create an Outreach Task in REL8
2. Download the ICS file and add to your calendar
3. Modify the event in your calendar (change time, title, etc.)
4. Your calendar should send an update email to `notifications@rel8.app`
5. Check `/rel8/notifications` → Calendar Updates tab for the sync log

## Verification Checklist

- [ ] Domain added to Resend
- [ ] MX and TXT DNS records configured
- [ ] Domain verified in Resend
- [ ] Webhook created and active
- [ ] Inbound email address configured
- [ ] Test email sent successfully
- [ ] Edge function logs show ICS processing
- [ ] Calendar Updates tab shows sync logs

## Troubleshooting

### Emails not being received
- **Check DNS**: Use `dig MX rel8.app` to verify MX records are propagated
- **Check domain verification**: Ensure domain shows as verified in Resend dashboard
- **Check webhook**: Verify webhook URL is correct and status is Active

### ICS parsing errors
- **Check logs**: View edge function logs in Supabase dashboard
- **Check attachment**: Ensure calendar provider is sending .ics files
- **Check format**: Some calendar apps send different ICS formats - logs will show details

### Sync not updating tasks
- **Check UID**: Verify the ICS UID matches the `ics_uid` in `rms_outreach` table
- **Check RLS**: Ensure user has permission to update the outreach task
- **Check logs**: Review `rms_outreach_sync_log` table for error details

## Expected Email Flow

1. User creates Outreach Task → ICS generated with UID `outreach-{id}@rel8.app`
2. User downloads ICS and adds to calendar
3. ICS includes `notifications@rel8.app` as ORGANIZER
4. User modifies event in calendar
5. Calendar app sends update email to `notifications@rel8.app` with .ics attachment
6. Resend receives email → triggers webhook
7. Edge function downloads ICS attachment → parses event
8. Edge function matches UID → updates outreach task
9. Sync log created in `rms_outreach_sync_log`
10. User sees update in `/rel8/notifications` Calendar Updates tab

## Security Notes

- The edge function validates all incoming ICS files
- Only events with matching UIDs in the database are processed
- RLS policies ensure users can only update their own outreach tasks
- All raw ICS content is stored for auditing purposes

## Support

If you encounter issues:
1. Check Supabase Edge Function logs
2. Review Resend webhook logs
3. Verify DNS configuration with your registrar
4. Check `/rel8/notifications` for error details

---

**Status**: Setup required  
**Estimated Time**: 30 minutes (plus DNS propagation)  
**Priority**: Required for calendar synchronization feature
