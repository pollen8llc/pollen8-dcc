import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Attempt to report error via Edge Function
    try {
      const token = localStorage.getItem("sb-access-token");
      await fetch("https://oltcuwvgdzszxshpfnre.functions.supabase.co/report-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          error_message: error.message,
          error_stack: error.stack || "",
          location: window.location.href,
          details: errorInfo?.componentStack || "",
        }),
      });
    } catch (reportError) {
      console.warn("Failed to report client error to backend:", reportError);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleLogout = async () => {
    try {
      // Clear any localStorage data that might be causing issues
      localStorage.clear();
      
      // Redirect to login page
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-500">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                There was an error loading this component. This might be due to an authentication issue or invalid data.
              </p>
              {this.state.error && (
                <div className="bg-muted p-3 rounded text-sm overflow-auto max-h-32">
                  <p className="font-mono">{this.state.error.message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="destructive" onClick={this.handleLogout}>
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
