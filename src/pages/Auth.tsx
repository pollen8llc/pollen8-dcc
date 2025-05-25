
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/components/auth/AuthLayout";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Auth = () => {
  // Basic form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { currentUser, isLoading: userLoading } = useUser();

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (currentUser && !userLoading) {
      console.log("User already authenticated, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, userLoading, navigate, redirectTo]);

  // If still loading user status, show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        setError(error.message);
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user) {
        console.log("Successfully signed in user:", data.user.id);
        toast({
          title: "Successfully signed in",
          description: "Welcome back!",
        });
        navigate(redirectTo, { replace: true });
      }
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all fields to sign up.");
      toast({
        title: "Missing information",
        description: "Please fill in all fields to sign up.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Attempting to sign up with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error.message);
        setError(error.message);
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign up successful, user:", data?.user?.id);
        toast({
          title: "Successfully signed up",
          description: "Your account has been created.",
        });
        
        // Redirect new users directly to profile setup
        navigate("/profile/setup", { replace: true });
      }
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error signing up",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      
      if (error) {
        console.error("Google sign in error:", error.message);
        setError(error.message);
        toast({
          title: "Error signing in with Google",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error during Google sign in:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error signing in with Google",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Auth page rendered, redirect target:", redirectTo);

  return (
    <AuthLayout title="Welcome to ECO8" subtitle="Sign in or create an account to get started">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : "Sign In"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
              <Separator className="my-2" />
              <p className="text-sm text-muted-foreground">
                Don't have an account? Switch to Sign Up.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to join the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up...
                    </>
                  ) : "Sign Up"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
              <Separator className="my-2" />
              <p className="text-sm text-muted-foreground">
                Already have an account? Switch to Sign In.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
