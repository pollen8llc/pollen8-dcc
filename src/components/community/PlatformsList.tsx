
import { MessageSquare, Info } from "lucide-react";

interface PlatformsListProps {
  platforms?: Record<string, any> | null;
}

export const PlatformsList = ({ platforms }: PlatformsListProps) => {
  const extractPlatforms = () => {
    if (!platforms) return [];
    
    if (Array.isArray(platforms)) {
      return platforms;
    }
    
    return Object.keys(platforms);
  };

  const platformList = extractPlatforms();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Platforms
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {platformList.length > 0 ? (
          platformList.map((platform) => (
            <span key={platform} className="text-muted-foreground">
              {typeof platform === 'string' 
                ? platform.charAt(0).toUpperCase() + platform.slice(1)
                : 'Unknown Platform'}
            </span>
          ))
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground col-span-full">
            <Info className="h-4 w-4" />
            <span>No platforms specified</span>
          </div>
        )}
      </div>
    </div>
  );
};
