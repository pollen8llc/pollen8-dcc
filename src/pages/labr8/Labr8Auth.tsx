
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserRole } from "@/services/roleService";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Labr8Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && currentUser) {
      console.log('User already authenticated for LAB-R8, checking role:', currentUser.role);
      
      // Check if user has SERVICE_PROVIDER role
      if (currentUser.role === 'SERVICE_PROVIDER') {
        if (!currentUser.profile_complete) {
          navigate("/labr8/setup", { replace: true });
        } else {
          navigate("/labr8/inbox", { replace: true });
        }
      } else {
        // Redirect non-service providers to main platform
        navigate("/", { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back to LAB-R8!",
          description: "You have successfully signed in.",
        });
        
        // The redirect will be handled by the useEffect above once currentUser updates
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/labr8/inbox`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'SERVICE_PROVIDER'
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Assign SERVICE_PROVIDER role
        try {
          await updateUserRole(data.user.id, 'SERVICE_PROVIDER');
        } catch (roleError) {
          console.error('Error assigning SERVICE_PROVIDER role:', roleError);
        }

        if (data.user.email_confirmed_at) {
          toast({
            title: "Welcome to LAB-R8!",
            description: "Your service provider account has been created successfully.",
          });
          navigate("/labr8/setup", { replace: true });
        } else {
          setMessage("Please check your email and click the confirmation link to complete your LAB-R8 service provider registration.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Loading LAB-R8..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#00eada] mb-2">LAB-R8</h1>
            <p className="text-lg font-semibold text-muted-foreground">Service Provider Portal</p>
            <p className="text-sm text-muted-foreground mt-1">Join the ecosystem as a service provider</p>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Service Provider Access</CardTitle>
            <CardDescription>
              Sign in to your service provider account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Join LAB-R8</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="mt-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In to LAB-R8"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Creating account...
                      </div>
                    ) : (
                      "Join LAB-R8 as Service Provider"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Need to access the main platform?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Labr8Auth;
