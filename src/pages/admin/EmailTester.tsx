import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const EmailTester = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Form state
  const [emailId, setEmailId] = useState("test-email-123");
  const [from, setFrom] = useState("user@gmail.com");
  const [subject, setSubject] = useState("Outreach #904a90dd: Follow up with Aaron");
  const [icsContent, setIcsContent] = useState(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//REL8//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:test-event-uid-123
DTSTAMP:20250125T120000Z
DTSTART:20250130T140000Z
DTEND:20250130T150000Z
SUMMARY:Follow up with Aaron
DESCRIPTION:Test event description
LOCATION:Office
ORGANIZER;CN=REL8 System:mailto:notifications-abc123@ecosystembuilder.app
ATTENDEE;CN=Test User;RSVP=TRUE:mailto:user@gmail.com
SEQUENCE:1
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Construct the Resend webhook payload
      const payload = {
        type: "email.received",
        created_at: new Date().toISOString(),
        data: {
          email_id: emailId,
          from: from,
          to: ["notifications-abc123@ecosystembuilder.app"],
          subject: subject,
          html: "<p>Test email body</p>",
          text: "Test email body",
          attachments: [
            {
              filename: "invite.ics",
              content_type: "text/calendar",
              size: icsContent.length,
            },
          ],
        },
      };

      console.log("Sending test payload:", payload);

      // Call the edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receive-calendar-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
      });

      if (response.ok) {
        toast({
          title: "Test successful!",
          description: "Check the response below for details.",
        });
      } else {
        toast({
          title: "Test failed",
          description: data.error || "See response below for details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Test error:", error);
      setResult({
        success: false,
        error: error.message,
      });
      toast({
        title: "Test error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        {/* Header */}
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Inbound Email Tester
              </h1>
              <p className="text-muted-foreground">Test the receive-calendar-update webhook</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Configuration Card */}
          <Card className="glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure the test email payload to send to the webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailId">Email ID</Label>
                  <Input
                    id="emailId"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="test-email-123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From Email</Label>
                  <Input
                    id="from"
                    type="email"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="user@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Outreach #904a90dd: Follow up with Aaron"
                />
                <p className="text-xs text-muted-foreground">
                  Format: "Outreach #[shortId]: [title]" or include the ics_uid
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icsContent">ICS File Content</Label>
                <Textarea
                  id="icsContent"
                  value={icsContent}
                  onChange={(e) => setIcsContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="BEGIN:VCALENDAR..."
                />
                <p className="text-xs text-muted-foreground">
                  The ICS content that would be in the email attachment
                </p>
              </div>

              <Button
                onClick={handleTest}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {result && (
            <Card className="glass-morphism border-primary/20 animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <CardTitle>
                    {result.success ? "Test Successful" : "Test Failed"}
                  </CardTitle>
                </div>
                {result.status && (
                  <CardDescription>HTTP Status: {result.status}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Response</Label>
                    <pre className="bg-muted/50 p-4 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                  </div>

                  {result.success && result.data && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        ✅ The webhook processed the test email successfully.
                      </p>
                      {result.data.outreach_id && (
                        <p className="text-sm">
                          <span className="font-semibold">Outreach ID:</span>{" "}
                          {result.data.outreach_id}
                        </p>
                      )}
                      {result.data.changes && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Changes Detected:</p>
                          <pre className="bg-muted/50 p-3 rounded-lg text-xs">
                            {JSON.stringify(result.data.changes, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions Card */}
          <Card className="glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">1. Email Subject Format</p>
                <p>Must include either the short outreach ID (first 8 chars) or the full ics_uid from the database.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">2. ICS UID Matching</p>
                <p>The UID in the ICS content should match the calendar_event_uid in rms_outreach table.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">3. Check Database</p>
                <p>After a successful test, check the rms_outreach_sync_log table to see the logged event.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">4. SEQUENCE Number</p>
                <p>Change the SEQUENCE number in the ICS to test update detection (higher = newer version).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTester;
