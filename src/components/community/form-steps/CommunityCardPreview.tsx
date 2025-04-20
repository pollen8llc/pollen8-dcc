
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, FileText, Circle, Users } from "lucide-react";
import { CommunityFormData } from "@/schemas/communitySchema";

// Helper to get some tags from audience or fallback
function extractTags(formValues: CommunityFormData): string[] {
  if (formValues.targetAudience) {
    return formValues.targetAudience
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);
  }
  return ["Tech", "Online"];
}

interface CommunityCardPreviewProps {
  formValues: CommunityFormData;
}

const CommunityCardPreview: React.FC<CommunityCardPreviewProps> = ({ formValues }) => {
  const {
    name,
    description,
    location,
    communitySize,
    // communityType,
    format,
    website,
    // Only form fields; use fallback/mock for image.
  } = formValues;

  // Fallbacks for image, fields, tags, etc.
  const tags = extractTags(formValues);

  const fakeImageUrl = "/placeholder.svg";
  const displayLocation = location || "Remote";
  const displayName = name || "Community Name Example";
  const displayDesc = description || "A short description about your community. This is what others will see!";
  const sizeText = communitySize || "1-25";
  const cardFormat = format ? format.charAt(0).toUpperCase() + format.slice(1) : "Hybrid";

  // Fake "recently updated" for spinner
  const isActive = true;

  return (
    <div className="group relative w-full max-w-md mx-auto">
      <div className="relative rounded-xl bg-card border border-border/40 transition-all duration-300 group-hover:shadow-md">
        {/* Top section with fake image */}
        <div className="h-28 w-full rounded-t-xl overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={fakeImageUrl}
            alt="Community Preview"
            className="h-full object-contain opacity-60"
            style={{ maxHeight: 56 }}
          />
        </div>
        {/* Activity Indicator */}
        <div className="absolute top-2 right-2 z-10">
          <Circle 
            className={`h-3 w-3 ${isActive ? "text-green-500" : "text-muted-foreground"}`}
            fill={isActive ? "#10B981" : "transparent"}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold truncate">{displayName}</h3>
            <span className="text-xs bg-primary/10 rounded px-2 py-0.5 text-primary">{cardFormat}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-primary/5 text-primary text-xs font-medium px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-start space-x-1.5 text-muted-foreground mb-2">
            <FileText className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs line-clamp-2">{displayDesc}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="text-xs truncate" title={displayLocation}>
                {displayLocation}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span className="text-xs">{sizeText} members</span>
            </div>
          </div>
          {website && (
            <div className="mt-2 text-xs text-blue-700 truncate">
              <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCardPreview;

