import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Globe, Mail, MessageCircle, Share2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { upgradeToOrganizer } from "@/services/roleService";

const P8Links = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, refreshUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    website: "",
    newsletter: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    slack: "",
    discord: "",
    telegram: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedWebsite = localStorage.getItem("p8_community_website");
    const savedNewsletter = localStorage.getItem("p8_links_newsletter");
    const savedTwitter = localStorage.getItem("p8_links_twitter");
    const savedLinkedin = localStorage.getItem("p8_links_linkedin");
    const savedFacebook = localStorage.getItem("p8_links_facebook");
    const savedSlack = localStorage.getItem("p8_links_slack");
    const savedDiscord = localStorage.getItem("p8_links_discord");
    const savedTelegram = localStorage.getItem("p8_links_telegram");
    
    setFormData({
      website: savedWebsite || "",
      newsletter: savedNewsletter || "",
      twitter: savedTwitter || "",
      linkedin: savedLinkedin || "",
      facebook: savedFacebook || "",
      slack: savedSlack || "",
      discord: savedDiscord || "",
      telegram: savedTelegram || "",
    });
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("p8_community_website", formData.website);
    localStorage.setItem("p8_links_newsletter", formData.newsletter);
    localStorage.setItem("p8_links_twitter", formData.twitter);
    localStorage.setItem("p8_links_linkedin", formData.linkedin);
    localStorage.setItem("p8_links_facebook", formData.facebook);
    localStorage.setItem("p8_links_slack", formData.slack);
    localStorage.setItem("p8_links_discord", formData.discord);
    localStorage.setItem("p8_links_telegram", formData.telegram);
  }, [formData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to create a community');
      }

      // Get all data from localStorage
      const name = localStorage.getItem("p8_community_name") || "";
      const description = localStorage.getItem("p8_community_description") || "";
      const location = localStorage.getItem("p8_selected_location") || "Remote";
      const tags = JSON.parse(localStorage.getItem("p8_selected_tags") || "[]");
      const selectedOptions = JSON.parse(localStorage.getItem("p8_combined_options") || "{}");
      const importance = JSON.parse(localStorage.getItem("p8_combined_importance") || "{}");

      // Build target audience array with both options and importance
      const targetAudienceArray: any[] = [];
      if (Object.keys(selectedOptions).length > 0) {
        Object.keys(selectedOptions).forEach(vectorId => {
          targetAudienceArray.push({
            id: vectorId,
            option: selectedOptions[vectorId],
            importance: importance[vectorId] || 0
          });
        });
      }

      // Build social media object
      const socialMedia: Record<string, string> = {};
      if (formData.twitter) socialMedia.twitter = formData.twitter;
      if (formData.linkedin) socialMedia.linkedin = formData.linkedin;
      if (formData.facebook) socialMedia.facebook = formData.facebook;

      // Build communication platforms object
      const communicationPlatforms: Record<string, string> = {};
      if (formData.slack) communicationPlatforms.slack = formData.slack;
      if (formData.discord) communicationPlatforms.discord = formData.discord;
      if (formData.telegram) communicationPlatforms.telegram = formData.telegram;

      // Create community via RPC
      const { data: communityId, error } = await supabase.rpc('create_community', {
        p_name: name.trim(),
        p_description: description.trim(),
        p_type: null,
        p_location: location,
        p_format: null,
        p_website: formData.website.trim() || null,
        p_is_public: true,
        p_tags: tags,
        p_target_audience: targetAudienceArray,
        p_social_media: Object.keys(socialMedia).length > 0 ? socialMedia : {},
        p_communication_platforms: Object.keys(communicationPlatforms).length > 0 ? communicationPlatforms : {},
      });

      if (error) {
        throw new Error(error.message || 'Failed to create community');
      }

      // Update the newsletter_url separately if provided
      if (formData.newsletter.trim()) {
        await supabase
          .from('communities')
          .update({ newsletter_url: formData.newsletter.trim() })
          .eq('id', communityId);
      }

      // Clear localStorage
      localStorage.removeItem("p8_community_name");
      localStorage.removeItem("p8_community_description");
      localStorage.removeItem("p8_community_website");
      localStorage.removeItem("p8_selected_location");
      localStorage.removeItem("p8_selected_tags");
      localStorage.removeItem("p8_combined_options");
      localStorage.removeItem("p8_combined_importance");
      localStorage.removeItem("p8_stage1_complete");
      localStorage.removeItem("p8_stage2_complete");
      localStorage.removeItem("p8_links_newsletter");
      localStorage.removeItem("p8_links_twitter");
      localStorage.removeItem("p8_links_linkedin");
      localStorage.removeItem("p8_links_facebook");
      localStorage.removeItem("p8_links_slack");
      localStorage.removeItem("p8_links_discord");
      localStorage.removeItem("p8_links_telegram");

      toast({
        title: 'Community Created',
        description: 'Your community has been successfully created!',
      });

      // Check if this is a MEMBER creating their first community
      const shouldUpgradeRole = currentUser?.role === 'MEMBER';
      
      // Upgrade MEMBER to ORGANIZER if they just created their first community
      if (shouldUpgradeRole) {
        try {
          console.log('Upgrading MEMBER to ORGANIZER after community creation');
          await upgradeToOrganizer(user.id);
          await refreshUser();
          
          toast({
            title: "🎉 Welcome to Organizers!",
            description: "You've been upgraded to Organizer status.",
          });
          
          setTimeout(() => {
            navigate('/organizer');
          }, 500);
          return;
        } catch (roleError) {
          console.error('Error upgrading user role:', roleError);
        }
      }

      // Navigate to community page
      navigate(`/eco8/community/${communityId}`);
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create community.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Badge */}
        <div className="mb-8">
          <Badge variant="outline" className="backdrop-blur-sm bg-primary/10 text-primary border-primary/30">
            Step 4 of 4
          </Badge>
        </div>

        {/* Centered Content */}
        <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            {/* Website Field */}
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-foreground/70 pl-2">
                Community Website
              </label>
              <div className="relative">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 pointer-events-none" />
                <input
                  id="website"
                  type="url"
                  placeholder="https://yourcommunity.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-14 pr-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Newsletter Field */}
            <div className="space-y-2">
              <label htmlFor="newsletter" className="text-sm font-medium text-foreground/70 pl-2">
                Newsletter URL
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 pointer-events-none" />
                <input
                  id="newsletter"
                  type="url"
                  placeholder="https://newsletter.example.com"
                  value={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.value })}
                  className="w-full pl-14 pr-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pl-2">
                <Share2 className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium text-foreground/70">Social Media</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Twitter/X URL"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
                <input
                  type="url"
                  placeholder="Facebook URL"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Communication Platforms Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pl-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium text-foreground/70">Communication Platforms</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Slack Invite URL"
                  value={formData.slack}
                  onChange={(e) => setFormData({ ...formData, slack: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
                <input
                  type="url"
                  placeholder="Discord Invite URL"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
                <input
                  type="url"
                  placeholder="Telegram Invite URL"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full px-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-lg bg-background/80 border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <Button 
                variant="outline" 
                onClick={() => navigate("/p8/tags")}
                disabled={isSubmitting}
                className="hover-scale"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group hover-scale"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Community
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8Links;
