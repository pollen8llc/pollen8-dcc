
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, UserRole } from "@/models/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Mail, UserX } from "lucide-react";
import * as userService from "@/services/userService";

interface AdminMembersTabProps {
  communityId: string;
}

const AdminMembersTab = ({ communityId }: AdminMembersTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: organizers = [] } = useQuery({
    queryKey: ['organizers', communityId],
    queryFn: () => userService.getCommunityOrganizers(communityId)
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members', communityId],
    queryFn: () => userService.getCommunityMembers(communityId)
  });

  // Filter members by search query
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter organizers by search query
  const filteredOrganizers = organizers.filter(organizer => 
    organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    organizer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMemberRow = (user: User, role: "organizer" | "member") => (
    <div key={user.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img 
            src={user.imageUrl} 
            alt={user.name} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge 
          className={role === "organizer" ? "bg-aquamarine text-primary-foreground" : "bg-muted"}
        >
          {role === "organizer" ? "Organizer" : "Member"}
        </Badge>
        <Button variant="ghost" size="icon" title={`Email ${user.name}`}>
          <Mail className="h-4 w-4" />
        </Button>
        {role === "member" && (
          <Button variant="ghost" size="icon" title="Remove member">
            <UserX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organizers ({filteredOrganizers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOrganizers.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No organizers found</p>
            ) : (
              filteredOrganizers.map(organizer => renderMemberRow(organizer, "organizer"))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredMembers.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No members found</p>
            ) : (
              filteredMembers.map(member => renderMemberRow(member, "member"))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMembersTab;
