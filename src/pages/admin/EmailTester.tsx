import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { AdminNavigation } from "@/components/admin/AdminNavigation";

const EmailTester = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Form state
  const [emailId, setEmailId] = useState("test-email-123");
  const [from, setFrom] = useState("user@gmail.com");
  const [subject, setSubject] = useState("Reminder set: Follow up with Aaron #904a90dd");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <AdminNavigation />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-muted-foreground hover:text-foreground -mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Inbound Email Tester</h2>
              <p className="text-sm text-muted-foreground">Test the receive-calendar-update webhook</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Configuration Card */}
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>
                  Configure the test email payload to send to the webhook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="icsContent">ICS File Content (Reference Only)</Label>
                  <Textarea
                    id="icsContent"
                    value={icsContent}
                    onChange={(e) => setIcsContent(e.target.value)}
                    rows={10}
                    className="font-mono text-xs"
                    placeholder="BEGIN:VCALENDAR..."
                  />
                  <p className="text-xs text-yellow-500">
                    ⚠️ Note: The edge function fetches ICS content from Resend API, not from this field.
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

            {/* Result and Instructions */}
            <div className="space-y-6">
              {/* Result Card */}
              {result && (
                <Card className="border-0 bg-card/40 backdrop-blur-md animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
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
                        <pre className="bg-white/5 border border-white/10 p-4 rounded-lg overflow-auto text-xs max-h-60">
                          {JSON.stringify(result.data || result.error, null, 2)}
                        </pre>
                      </div>

                      {result.success && result.data && result.data.outreach_id && (
                        <p className="text-sm">
                          <span className="font-semibold">Outreach ID:</span> {result.data.outreach_id}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Instructions Card */}
              <Card className="border-0 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Testing Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="font-semibold text-yellow-500 mb-1">⚠️ Testing Limitations</p>
                    <p className="text-xs">
                      The edge function fetches ICS attachments from Resend's API. Test will fail unless email_id exists in Resend.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground mb-1">Real-World Testing</p>
                    <ol className="list-decimal ml-4 space-y-1 text-xs">
                      <li>Create an outreach task in REL8</li>
                      <li>Accept the calendar invite in your app</li>
                      <li>Modify the event in your calendar</li>
                      <li>Check rms_outreach_sync_log for sync events</li>
                    </ol>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground mb-1">Check Sync Results</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><code className="bg-white/10 px-1 rounded">rms_outreach_sync_log</code></li>
                      <li><code className="bg-white/10 px-1 rounded">rms_outreach</code></li>
                      <li><code className="bg-white/10 px-1 rounded">cross_platform_notifications</code></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTester;
