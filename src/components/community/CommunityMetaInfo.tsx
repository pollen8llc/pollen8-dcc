
import React from "react";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { Card, CardContent } from "@/components/ui/card";
import { Community } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Map, Users, Tag } from "lucide-react";
import { formatCommunityType } from "@/utils/communityUtils";

interface CommunityMetaInfoProps {
  community: Community;
}

export function CommunityMetaInfo({ community }: CommunityMetaInfoProps) {
  // Helper functions to format data consistently
  const formatDate = (date: string | undefined) => {
    if (!date) return "Not specified";
    return date;
  };

  const getTargetAudience = () => {
    // Handle both targetAudience and target_audience
    const audience = community.target_audience || community.targetAudience || [];
    
    // Check if audience is already an array
    if (Array.isArray(audience)) {
      return audience;
    }
    
    // If it's a string, split it by commas
    if (typeof audience === 'string') {
      return audience.split(',').map(item => item.trim()).filter(Boolean);
    }
    
    return [];
  };

  const getSize = () => {
    return community.community_size || community.communitySize || "Not specified";
  };

  const getType = () => {
    const type = community.type || community.communityType;
    return type ? formatCommunityType(type) : "Not specified";
  };

  // Format platforms
  const getPlatforms = () => {
    if (community.primaryPlatforms && Array.isArray(community.primaryPlatforms)) {
      return community.primaryPlatforms;
    }
    
    if (community.platforms && Array.isArray(community.platforms)) {
      return community.platforms;
    }
    
    return [];
  };
  
  // Ensure social_media is properly formatted for SocialMediaLinks component
  const getSocialMedia = () => {
    // If it's already in the correct format
    if (community.social_media && typeof community.social_media === 'object') {
      return community.social_media;
    }
    
    // If it's using the socialMedia alias
    if (community.socialMedia && typeof community.socialMedia === 'object') {
      return community.socialMedia;
    }
    
    // Handle individual social media fields
    const socialMedia: Record<string, string | { url?: string }> = {};
    
    if (community.twitter) socialMedia.twitter = community.twitter;
    if (community.facebook) socialMedia.facebook = community.facebook;
    if (community.instagram) socialMedia.instagram = community.instagram;
    if (community.linkedin) socialMedia.linkedin = community.linkedin;
    
    return Object.keys(socialMedia).length > 0 ? socialMedia : null;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/5 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Community Details</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Tag className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{getType()}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Globe className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Format</p>
                <p className="font-medium">{community.format || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Map className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{community.location || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Calendar className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">{formatDate(community.launchDate || community.createdAt || community.created_at)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <Users className="h-5 w-5 text-primary/70 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{getSize()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Target audience */}
      <Card className="bg-black/5 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Target Audience</h3>
          <div className="flex flex-wrap gap-2">
            {getTargetAudience().length > 0 ? (
              getTargetAudience().map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No target audience specified</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Platforms */}
      {getPlatforms().length > 0 && (
        <Card className="bg-black/5 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {getPlatforms().map((platform, index) => (
                <Badge key={index} variant="outline" className="border-primary/30">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Social Media */}
      {getSocialMedia() && (
        <Card className="bg-black/5 border-white/10">
          <CardContent className="p-6">
            <SocialMediaLinks socialMedia={getSocialMedia()} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
