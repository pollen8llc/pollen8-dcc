import React, { useState, useEffect, useCallback } from "react";
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
import AuthLayout from "@/components/auth/AuthLayout";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface AuthStatus {
  loading: boolean;
  showPassword: boolean;
  error: string | null;
  message: string | null;
}

const Auth = () => {
  // Form state
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  // Auth status state
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    loading: false,
    showPassword: false,
    error: null,
    message: null
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, isLoading } = useUser();
  const { toast } = useToast();

  // Update form field
  const updateFormField = useCallback((field: keyof AuthFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update auth status
  const updateAuthStatus = useCallback((updates: Partial<AuthStatus>) => {
    setAuthStatus(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    updateAuthStatus({ error: null, message: null });
  }, [updateAuthStatus]);

  // Handle successful authentication redirect
  const handleAuthenticatedRedirect = useCallback((user: any) => {
    console.log('🔍 Auth.tsx - Handling authenticated redirect:', {
      role: user.role,
      profileComplete: user.profile_complete,
      userId: user.id
    });

    // Service providers go to LAB-R8, others go to initi8
    if (user.role === 'SERVICE_PROVIDER') {
      console.log('🚀 Auth.tsx - Redirecting SERVICE_PROVIDER to LAB-R8');
      const destination = user.profile_complete ? "/labr8/dashboard" : "/labr8/setup";
      navigate(destination, { replace: true });
    } else {
      console.log('🚀 Auth.tsx - Redirecting authenticated user to initi8 dashboard');
      navigate("/initi8", { replace: true });
    }
  }, [navigate]);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!isLoading && currentUser) {
      console.log('🔍 Auth.tsx - User already authenticated, redirecting...');
      handleAuthenticatedRedirect(currentUser);
    }
  }, [currentUser, isLoading, handleAuthenticatedRedirect]);

  // Validate sign up form
  const validateSignUpForm = useCallback((): string | null => {
    const { password, confirmPassword, firstName, lastName, email } = formState;
    
    if (!email.trim()) return "Email is required";
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (password !== confirmPassword) return "Passwords do not match";
    
    return null;
  }, [formState]);

  // Validate sign in form
  const validateSignInForm = useCallback((): string | null => {
    const { email, password } = formState;
    
    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";
    
    return null;
  }, [formState]);

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Validate form
    const validationError = validateSignInForm();
    if (validationError) {
      updateAuthStatus({ error: validationError });
      return;
    }

    updateAuthStatus({ loading: true });

    try {
      console.log('🔐 Auth.tsx - Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formState.email.trim(),
        password: formState.password,
      });

      if (error) {
        console.error('❌ Auth.tsx - Sign in error:', error.message);
        updateAuthStatus({ error: error.message, loading: false });
        return;
      }

      if (data.user) {
        console.log('🎉 Auth.tsx - Sign in successful for user:', data.user.id);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // Clear form on success
        setFormState({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: ""
        });
        
        console.log('✅ Auth.tsx - Waiting for user context to update...');
      }
    } catch (err: any) {
      console.error('❌ Auth.tsx - Unexpected sign in error:', err);
      updateAuthStatus({ 
        error: err.message || "An unexpected error occurred during sign in",
        loading: false 
      });
    } finally {
      updateAuthStatus({ loading: false });
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    // Validate form
    const validationError = validateSignUpForm();
    if (validationError) {
      updateAuthStatus({ error: validationError });
      return;
    }

    updateAuthStatus({ loading: true });

    try {
      console.log('🔐 Auth.tsx - Starting sign up process...');
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formState.email.trim(),
        password: formState.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: formState.firstName.trim(),
            last_name: formState.lastName.trim(),
          }
        }
      });

      if (error) {
        console.error('❌ Auth.tsx - Sign up error:', error.message);
        updateAuthStatus({ error: error.message, loading: false });
        return;
      }

      if (data.user) {
        console.log('🎉 Auth.tsx - Sign up successful for user:', data.user.id);
        
        if (data.user.email_confirmed_at) {
          // Email already confirmed - user is immediately signed in
          toast({
            title: "Account created!",
            description: "Welcome to the community!",
          });
          
          // Clear form on success
          setFormState({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
          });
          
          console.log('✅ Auth.tsx - Waiting for user context to update...');
        } else {
          // Email confirmation required
          updateAuthStatus({
            message: "Please check your email and click the confirmation link to complete your registration.",
            loading: false
          });
        }
      }
    } catch (err: any) {
      console.error('❌ Auth.tsx - Unexpected sign up error:', err);
      updateAuthStatus({ 
        error: err.message || "An unexpected error occurred during registration",
        loading: false 
      });
    } finally {
      updateAuthStatus({ loading: false });
    }
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Error Alert */}
            {authStatus.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{authStatus.error}</AlertDescription>
              </Alert>
            )}

            {/* Success/Info Message */}
            {authStatus.message && (
              <Alert className="mt-4">
                <AlertDescription>{authStatus.message}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formState.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                    required
                    disabled={authStatus.loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={authStatus.showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formState.password}
                      onChange={(e) => updateFormField('password', e.target.value)}
                      required
                      disabled={authStatus.loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => updateAuthStatus({ showPassword: !authStatus.showPassword })}
                      disabled={authStatus.loading}
                    >
                      {authStatus.showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={authStatus.loading}>
                  {authStatus.loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formState.firstName}
                      onChange={(e) => updateFormField('firstName', e.target.value)}
                      required
                      disabled={authStatus.loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formState.lastName}
                      onChange={(e) => updateFormField('lastName', e.target.value)}
                      required
                      disabled={authStatus.loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formState.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                    required
                    disabled={authStatus.loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={authStatus.showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formState.password}
                      onChange={(e) => updateFormField('password', e.target.value)}
                      required
                      disabled={authStatus.loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => updateAuthStatus({ showPassword: !authStatus.showPassword })}
                      disabled={authStatus.loading}
                    >
                      {authStatus.showPassword ? (
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
                    value={formState.confirmPassword}
                    onChange={(e) => updateFormField('confirmPassword', e.target.value)}
                    required
                    disabled={authStatus.loading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={authStatus.loading}>
                  {authStatus.loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Auth;