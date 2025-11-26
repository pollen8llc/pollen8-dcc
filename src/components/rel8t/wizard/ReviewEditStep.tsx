import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertCircle } from "lucide-react";
import { Outreach, updateOutreach, sendCalendarUpdate } from "@/services/rel8t/outreachService";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface ReviewEditStepProps {
  outreach: Outreach;
  updatedData: {
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    outreachChannel: string | null;
    channelDetails: Record<string, any> | null;
  };
  onPrevious: () => void;
}

export const ReviewEditStep: React.FC<ReviewEditStepProps> = ({
  outreach,
  updatedData,
  onPrevious,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [sendingCalendarUpdate, setSendingCalendarUpdate] = useState(false);

  // Get user profile for email
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
  });

  const handleSave = async (withCalendarUpdate: boolean = false) => {
    if (isSaving || sendingCalendarUpdate) return;
    
    if (withCalendarUpdate) {
      setSendingCalendarUpdate(true);
    } else {
      setIsSaving(true);
    }
    
    try {
      const updates: Partial<Outreach> = {
        title: updatedData.title,
        description: updatedData.description || null,
        due_date: new Date(updatedData.dueDate).toISOString(),
        priority: updatedData.priority,
        outreach_channel: updatedData.outreachChannel,
        channel_details: updatedData.channelDetails,
      };

      const success = await updateOutreach(outreach.id, updates);
      
      if (success) {
        if (withCalendarUpdate && profile?.email) {
          let updateType: 'update' | 'reschedule' = 'update';
          if (updatedData.dueDate !== format(new Date(outreach.due_date), "yyyy-MM-dd")) {
            updateType = 'reschedule';
          }
          
          const calendarSuccess = await sendCalendarUpdate(
            outreach.id,
            updateType,
            profile.email
          );
          
          if (calendarSuccess) {
            toast({
              title: "Success",
              description: "Outreach task updated and calendar notification sent",
            });
          } else {
            toast({
              title: "Partial Success",
              description: "Task updated but calendar notification failed",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Success",
            description: "Outreach task updated successfully",
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ["outreach"] });
        queryClient.invalidateQueries({ queryKey: ["outreach-counts"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        
        navigate("/rel8/relationships");
      } else {
        toast({
          title: "Error",
          description: "Failed to update outreach task",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
      setSendingCalendarUpdate(false);
    }
  };

  const priorityColor = {
    low: "bg-blue-900/30 text-blue-400 border-blue-400/30",
    medium: "bg-yellow-900/30 text-yellow-400 border-yellow-400/30",
    high: "bg-red-900/30 text-red-400 border-red-400/30",
  };

  const getChannelLabel = () => {
    switch (updatedData.outreachChannel) {
      case "text": return "Text/SMS";
      case "call": return "Phone Call";
      case "email": return "Email";
      case "dm": return "Direct Message";
      case "meeting": return "Virtual Meeting";
      case "irl": return "In-Person Meeting";
      default: return "None";
    }
  };

  const getChannelDetails = () => {
    if (!updatedData.channelDetails) return null;
    
    switch (updatedData.outreachChannel) {
      case "text":
      case "call":
        return updatedData.channelDetails.phone;
      case "email":
        return updatedData.channelDetails.email;
      case "dm":
        return `${updatedData.channelDetails.platform}: ${updatedData.channelDetails.handle}`;
      case "meeting":
        return `${updatedData.channelDetails.meetingPlatform} - ${updatedData.channelDetails.link}`;
      case "irl":
        return updatedData.channelDetails.address;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Title</h3>
          <p className="text-lg font-semibold">{updatedData.title}</p>
        </div>

        {updatedData.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <p className="text-sm">{updatedData.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(updatedData.dueDate), "PPP")}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
            <Badge variant="outline" className={priorityColor[updatedData.priority]}>
              {updatedData.priority}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Follow-up Channel</h3>
          <div className="space-y-1">
            <p className="text-sm font-medium">{getChannelLabel()}</p>
            {getChannelDetails() && (
              <p className="text-sm text-muted-foreground">{getChannelDetails()}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Associated Contacts</h3>
          <div className="flex flex-wrap gap-2">
            {outreach.contacts?.map((contact) => (
              <Badge key={contact.id} variant="outline" className="font-normal border-primary/30 bg-primary/10 text-primary">
                {contact.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-4 border-t border-border/20">
        <Button variant="outline" onClick={onPrevious} disabled={isSaving || sendingCalendarUpdate}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleSave(false)} 
            disabled={isSaving || sendingCalendarUpdate}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            onClick={() => handleSave(true)}
            disabled={isSaving || sendingCalendarUpdate}
            className="bg-primary"
          >
            {sendingCalendarUpdate ? "Updating Calendar..." : "Save & Update Calendar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
