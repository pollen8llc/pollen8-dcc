
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommunityFormData } from "@/schemas/communitySchema";
import { MapPin, Users, Calendar, ArrowRight } from "lucide-react";

interface CommunityPreviewProps {
  formData: Partial<CommunityFormData>;
}

export function CommunityPreview({ formData }: CommunityPreviewProps) {
  // Only show description preview up to a certain length
  const previewDescription = formData.description && formData.description.length > 100
    ? `${formData.description.substring(0, 100)}...`
    : formData.description;

  return (
    <Card className="overflow-hidden shadow-md h-full max-w-md">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl line-clamp-2">
              {formData.name || "Community Name"}
            </CardTitle>
            <div className="mt-1 flex gap-1">
              {formData.is_public ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Public</Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Private</Badge>
              )}
              
              {formData.type && (
                <Badge variant="outline">{formData.type}</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4 min-h-[4rem] line-clamp-3">
          {previewDescription || "Community description will appear here."}
        </p>
        
        <div className="space-y-3">
          {formData.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formData.location}</span>
            </div>
          )}
          
          {formData.community_size && (
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formData.community_size} members</span>
            </div>
          )}
          
          {formData.event_frequency && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formData.event_frequency.charAt(0).toUpperCase() + formData.event_frequency.slice(1)} events</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-1 border-t pt-4">
        {formData.target_audience && formData.target_audience.length > 0 ? (
          formData.target_audience.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No tags added</span>
        )}
        
        {formData.target_audience && formData.target_audience.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{formData.target_audience.length - 3} more
          </Badge>
        )}
        
        <div className="grow"></div>
        
        <div className="flex items-center text-primary text-xs font-medium">
          View community <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </CardFooter>
    </Card>
  );
}
