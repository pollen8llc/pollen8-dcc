
import { useSession } from '@/hooks/useSession';
import Navbar from '@/components/Navbar';
import CardBasedProjectView from '@/components/modul8/CardBasedProjectView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ModernProjectStatusView = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">Track and manage your project communications</p>
          </div>
        </div>

        {/* Card-Based Project View */}
        <CardBasedProjectView 
          isServiceProvider={false}
          userId={session?.user?.id}
        />
      </div>
    </div>
  );
};

export default ModernProjectStatusView;
