
import { useState } from "react";
import { Community } from "@/models/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface AdminSettingsTabProps {
  community: Community;
}

const AdminSettingsTab = ({ community }: AdminSettingsTabProps) => {
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description);
  const [location, setLocation] = useState(community.location);
  const [isPublic, setIsPublic] = useState(community.is_public);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock delay for saving (would be a real API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // When connected to a database, this would update the community
      // For now, just show a success message
      toast({
        title: "Settings saved",
        description: "Your community settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your community settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your community's basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Visibility</CardTitle>
          <CardDescription>
            Control who can see and join your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-toggle">Public Community</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, your community will be visible in search results and directories
                </p>
              </div>
              <Switch 
                id="public-toggle" 
                checked={isPublic} 
                onCheckedChange={setIsPublic} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="approval-toggle">Require Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Require admin approval before new members can join
                </p>
              </div>
              <Switch 
                id="approval-toggle" 
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="member-list-toggle">Show Member List</Label>
                <p className="text-sm text-muted-foreground">
                  Display the list of members on your community page
                </p>
              </div>
              <Switch 
                id="member-list-toggle" 
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
