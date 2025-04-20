
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommunityForm } from "@/hooks/community/useCommunityForm";
import { useCreateCommunityForm } from "@/hooks/community/useCreateCommunityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function CommunityCreationTest() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  // Test direct form hook - this one uses onSubmit
  const {
    isSubmitting: isSubmittingDirect,
    form: directForm,
    onSubmit: directOnSubmit
  } = useCreateCommunityForm();
  
  // Test service layer hook - this one uses handleSubmit
  const {
    form,
    isSubmitting: isSubmittingService,
    submissionError: serviceError,
    handleSubmit
  } = useCommunityForm();

  // Test submission handlers
  const testDirectSubmission = async () => {
    try {
      const testData = {
        name: "Test Community Direct",
        description: "Testing direct form submission",
        // Use the specific enum value from the allowed values
        type: "tech" as const, 
        format: "hybrid" as const,
        location: "Test Location",
        targetAudience: "developers, tech enthusiasts",
        platforms: ["discord", "slack"],
        website: "https://example.com",
        newsletterUrl: "",
        socialMediaHandles: {
          twitter: "",
          instagram: "",
          linkedin: "",
          facebook: ""
        }
      };
      
      // Call onSubmit directly with the data
      directOnSubmit(testData);
      console.log("Direct submission initiated");
    } catch (error) {
      console.error("Direct submission error:", error);
    }
  };

  const testServiceSubmission = async () => {
    try {
      const testData = {
        name: "Test Community Service",
        description: "Testing service layer submission",
        communityType: "tech",
        format: "hybrid",
        location: "Test Location",
      };
      
      // Use the form's handleSubmit method instead of directly calling submitCommunity
      form.handleSubmit((data) => {
        console.log("Form data:", data);
        // The actual submission is handled internally by the hook
      })(new Event('submit') as any);
      
      console.log("Service submission initiated");
    } catch (error) {
      console.error("Service submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Community Creation Test Page</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Auth Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Logged in:</span>{" "}
                {currentUser ? "Yes" : "No"}
              </p>
              {currentUser && (
                <>
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {currentUser.id}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {currentUser.role}
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Hook Testing */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hook Testing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Direct Form Hook</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Test useCreateCommunityForm hook
                </p>
                <Button 
                  onClick={testDirectSubmission}
                  disabled={isSubmittingDirect}
                >
                  {isSubmittingDirect ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Direct Submission"
                  )}
                </Button>
                {directForm.formState.errors && Object.keys(directForm.formState.errors).length > 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Form Error</AlertTitle>
                    <AlertDescription>
                      {Object.values(directForm.formState.errors).map((error, i) => (
                        <div key={i}>{error.message}</div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Service Layer Hook</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Test useCommunityForm with service layer
                </p>
                <Button 
                  onClick={testServiceSubmission}
                  disabled={isSubmittingService}
                >
                  {isSubmittingService ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Service Submission"
                  )}
                </Button>
                {serviceError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{serviceError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </Card>

          {/* Creation Paths */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Available Paths</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Direct Form Submission</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Standard community creation form with all fields.
                </p>
                <Button onClick={() => navigate("/create-community")}>
                  Try Direct Form
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Onboarding Path</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Guided community creation through onboarding.
                </p>
                <Button onClick={() => navigate("/onboarding")}>
                  Try Onboarding Path
                </Button>
              </div>
            </div>
          </Card>

          {/* Debug Console */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Debug Console</h2>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2 font-mono text-sm">
                <p>• Auth state loaded</p>
                <p>• Form validation ready</p>
                <p>• Test submission buttons ready</p>
                <p>• Both hooks initialized</p>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
