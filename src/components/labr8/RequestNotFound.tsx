
import { Button } from '@/components/ui/button';

interface RequestNotFoundProps {
  onBackToDashboard: () => void;
}

const RequestNotFound = ({ onBackToDashboard }: RequestNotFoundProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
          <Button onClick={onBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestNotFound;
