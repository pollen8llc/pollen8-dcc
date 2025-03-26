
import { User } from "@/data/types";
import { Mail, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MemberModalProps {
  member: User | null;
  open: boolean;
  onClose: () => void;
}

const MemberModal = ({ member, open, onClose }: MemberModalProps) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md glass dark:glass-dark border border-border/40 sm:rounded-xl shadow-xl transition-all duration-500 animate-fade-in">
        <DialogHeader className="relative">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-aquamarine/30 mb-4">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {member.name}
            </DialogTitle>
            <Badge 
              className={`mt-2 ${
                member.role === "ORGANIZER" 
                  ? "bg-aquamarine text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {member.role}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <p className="text-center">{member.bio}</p>
          
          <div className="pt-4 border-t border-border/20">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4" />
              <a 
                href={`mailto:${member.email}`}
                className="hover:text-aquamarine transition-colors duration-200"
              >
                {member.email}
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Member of {member.communities.length} communities</span>
            </div>
          </div>
          
          <div className="pt-4 flex justify-center">
            <Button 
              className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 transition-all duration-300 w-full"
              onClick={() => window.location.href = `mailto:${member.email}`}
            >
              Contact {member.name}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
