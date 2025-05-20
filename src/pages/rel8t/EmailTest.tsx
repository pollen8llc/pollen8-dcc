
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Shell } from "@/components/layout/Shell";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";

interface EmailFormData {
  to: string;
  subject: string;
  message: string;
}

const EmailTest = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
    defaultValues: {
      to: "",
      subject: "Test Email",
      message: "<h1>Test Email</h1><p>This is a test email from the Rel8t system.</p>"
    }
  });

  const onSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: data.to,
          subject: data.subject,
          html: data.message
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email sent successfully",
        description: `Email was sent to ${data.to}`,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description: error.message || "An error occurred while sending the email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold">Email Testing</h1>
          <p className="text-muted-foreground mt-1">
            Test the email sending functionality
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>
              Use this form to send a test email and verify email configuration
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="to" className="text-sm font-medium">Recipient Email</label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  {...register("to", { required: "Recipient email is required" })}
                />
                {errors.to && <p className="text-sm text-red-500">{errors.to.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input
                  id="subject"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message (HTML supported)</label>
                <Textarea
                  id="message"
                  rows={6}
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Test Email"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
};

export default EmailTest;
