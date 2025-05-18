
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * @deprecated This component is maintained for backward compatibility.
 * Community functionality has been removed from the platform.
 */
const NotFoundState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}> = ({
  title = "No communities found",
  description = "Community functionality has been removed from the platform.",
  actionLabel = "Go to REL8T",
  actionHref = "/rel8/dashboard",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {actionHref && (
        <Button asChild>
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
};

export default NotFoundState;
