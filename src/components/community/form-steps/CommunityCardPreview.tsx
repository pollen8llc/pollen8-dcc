
import React from 'react';
import { Community } from '@/models/types';
import { Card, CardContent } from '@/components/ui/card';
import { processTargetAudience } from '@/utils/communityUtils';

interface CommunityCardPreviewProps {
  communityData: Partial<Community>;
}

const CommunityCardPreview: React.FC<CommunityCardPreviewProps> = ({ communityData }) => {
  // Process target audience safely
  const targetAudienceTags = processTargetAudience(communityData.target_audience);

  return (
    <Card className="w-full max-w-md mx-auto border border-border/50 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{communityData.name || 'Community Name'}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm mt-1">
              {communityData.description || 'Community description will appear here...'}
            </p>
          </div>

          {/* Location and Details */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span>{communityData.location || 'Location'}</span>
            </div>
            <span>•</span>
            <div>
              <span>{communityData.member_count || '0'} members</span>
            </div>
            <span>•</span>
            <div>
              <span>{communityData.format || 'Format'}</span>
            </div>
          </div>

          {/* Tags */}
          {targetAudienceTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {targetAudienceTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
              {targetAudienceTags.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                  +{targetAudienceTags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCardPreview;
