
import { Button } from "@/components/ui/button";

const NotFoundState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Community Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The community you're looking for doesn't exist or has been removed.
        </p>
        <Button
          className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
