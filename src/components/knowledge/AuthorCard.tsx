
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/models/types";
import { ArrowRight } from "lucide-react";

interface AuthorCardProps {
  author: {
    id?: string;
    name?: string;
    role?: UserRole | string;
    avatar_url?: string;
    is_admin?: boolean;
  };
  minimal?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, minimal = false }) => {
  const navigate = useNavigate();
  
  if (!author) {
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "?";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Check if user is admin
  const isAdmin = author.is_admin || author.role === UserRole.ADMIN;
  
  // Helper to format role as a string
  const formatRole = (role?: UserRole | string): string => {
    if (role === undefined) return 'member';
    
    // If role is a string, just return it lowercase
    if (typeof role === 'string') return role.toLowerCase();
    
    // For UserRole enum, convert the numeric value to its string representation
    // Check if we can get the string key from the enum
    const roleKey = UserRole[role];
    // Only call toLowerCase if roleKey is a string
    return typeof roleKey === 'string' ? roleKey.toLowerCase() : 'member';
  };
  
  if (minimal) {
    return (
      <div className="flex items-center">
        <Avatar className={`h-8 w-8 ${isAdmin ? 'ring-2 ring-[#9b87f5]/50' : ''}`}>
          <AvatarImage src={author.avatar_url} />
          <AvatarFallback className={isAdmin ? "bg-[#9b87f5]/10 text-[#9b87f5]" : "bg-[#00eada]/10 text-[#00eada]"}>
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-2">
          <p className="font-medium text-sm">{author.name || 'Anonymous'}</p>
          {author.role !== undefined && (
            <Badge variant="outline" className="text-xs mt-0.5 capitalize">
              {formatRole(author.role)}
            </Badge>
          )}
          {isAdmin && !author.role && (
            <Badge className="bg-[#9b87f5] text-xs mt-0.5">
              Admin
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm ${isAdmin ? 'admin-gradient-premium-border' : ''}`}>
      <CardContent className="pt-4 pb-3 px-4">
        <h3 className="text-sm font-medium mb-2">About the Author</h3>
        <div className="flex items-center">
          <Avatar className={`h-10 w-10 ${isAdmin ? 'ring-2 ring-[#9b87f5]/50' : 'ring-2 ring-[#00eada]/20'}`}>
            <AvatarImage src={author.avatar_url} />
            <AvatarFallback className={isAdmin ? "bg-[#9b87f5]/10 text-[#9b87f5]" : "bg-[#00eada]/10 text-[#00eada]"}>
              {getInitials(author.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-3">
            <p className="font-medium text-sm">{author.name || 'Anonymous'}</p>
            {author.role !== undefined && (
              <Badge variant="outline" className="text-xs mt-0.5 capitalize">
                {formatRole(author.role)}
              </Badge>
            )}
            {isAdmin && !author.role && (
              <Badge className="bg-[#9b87f5] text-xs mt-0.5">
                Admin
              </Badge>
            )}
          </div>
        </div>
        
        {author.id && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 hover:bg-[#00eada]/10 hover:text-[#00eada] transition-colors text-xs py-1 h-auto"
            onClick={() => navigate(`/profile/${author.id}`)}
          >
            View Profile
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthorCard;
