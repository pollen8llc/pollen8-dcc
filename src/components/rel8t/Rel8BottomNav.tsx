import { useUser } from '@/contexts/UserContext';
import UserMenuDropdown from '@/components/navbar/UserMenuDropdown';
import { Button } from '@/components/ui/button';
import { Users, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Rel8BottomNav() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur-md border-t border-primary/20 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/rel8/contacts')}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs">Contacts</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/rel8/wizard')}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">Rapport</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/rel8/relationships')}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Tasks</span>
            </Button>

            <div className="flex items-center justify-center">
              <UserMenuDropdown 
                currentUser={currentUser} 
                isAdmin={currentUser.role === 'ADMIN'} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
