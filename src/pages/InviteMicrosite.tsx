import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle, MapPin, Globe, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InviteData {
  id: string;
  code: string;
  link_id: string;
  creator_id: string;
  is_active: boolean;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
}

interface ProfileData {
  user_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  avatar_url: string;
  website: string;
  skills: string[];
  interests: string[];
}

const InviteMicrosite = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    loadInviteAndProfile();
  }, [linkId]);

  const loadInviteAndProfile = async () => {
    if (!linkId) {
      setError("Invalid invite link");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch invite by link_id
      const { data: inviteData, error: inviteError } = await supabase
        .from("invites")
        .select("*")
        .eq("link_id", linkId)
        .eq("is_active", true)
        .single();

      if (inviteError || !inviteData) {
        setError("This invite link is invalid or has expired");
        setIsLoading(false);
        return;
      }

      // Check if expired
      if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
        setError("This invite link has expired");
        setIsLoading(false);
        return;
      }

      // Check if max uses reached
      if (inviteData.max_uses && inviteData.used_count >= inviteData.max_uses) {
        setError("This invite link has reached its maximum usage limit");
        setIsLoading(false);
        return;
      }

      setInvite(inviteData);

      // Fetch creator's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", inviteData.creator_id)
        .single();

      if (profileError || !profileData) {
        setError("Could not load profile information");
        setIsLoading(false);
        return;
      }

      setProfile(profileData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading invite:", err);
      setError("An error occurred while loading this page");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invite || !formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.rpc("use_invite_link", {
        p_invite_code: invite.code,
        p_visitor_name: formData.name,
        p_visitor_email: formData.email,
        p_visitor_phone: formData.phone || null,
        p_visitor_tags: formData.message ? [formData.message] : null,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your contact information has been shared successfully",
      });
    } catch (err: any) {
      console.error("Error submitting contact:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to submit your information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invite || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Oops!</h1>
          <p className="text-muted-foreground mb-6">{error || "Something went wrong"}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-foreground">Thank You!</h1>
          <p className="text-muted-foreground mb-6">
            Your contact information has been shared with {profile.full_name || profile.first_name}. 
            They'll be in touch soon!
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Explore Platform
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              {profile.full_name || `${profile.first_name} ${profile.last_name}`}
            </h1>
            {profile.bio && (
              <p className="text-muted-foreground mb-4 max-w-lg">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Skills & Interests */}
          {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
            <div className="mt-6 space-y-4">
              {profile.skills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.interests?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-foreground">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Contact Form */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Connect with Me</h2>
          <p className="text-muted-foreground mb-6">
            Share your contact information and I'll get back to you soon!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me a bit about yourself or why you're reaching out..."
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Share My Contact Info"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default InviteMicrosite;
