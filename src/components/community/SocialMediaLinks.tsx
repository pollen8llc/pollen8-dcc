
import { Info, Twitter, Instagram, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";

interface SocialMediaLinksProps {
  socialMedia?: Record<string, string | { url?: string }> | null;
}

export const SocialMediaLinks = ({ socialMedia }: SocialMediaLinksProps) => {
  // Extract social media links from various formats
  const extractSocialMedia = () => {
    // Return early if no social media data
    if (!socialMedia || Object.keys(socialMedia).length === 0) {
      return [];
    }
  
    return Object.entries(socialMedia)
      .filter(([_, value]) => {
        if (typeof value === 'string') return value;
        return value?.url;
      })
      .map(([platform, value]) => ({
        platform,
        url: typeof value === 'string' ? value : value?.url || ''
      }));
  };

  const socialLinks = extractSocialMedia();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Social Media</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {socialLinks.length > 0 ? (
          socialLinks.map(({ platform, url }) => {
            let Icon;
            switch(platform.toLowerCase()) {
              case 'twitter':
                Icon = Twitter;
                break;
              case 'instagram':
                Icon = Instagram;
                break;
              case 'facebook':
                Icon = Facebook;
                break;
              case 'linkedin':
                Icon = Linkedin;
                break;
              default:
                Icon = LinkIcon;
            }

            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            );
          })
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground col-span-full">
            <Info className="h-4 w-4" />
            <span>No social media links available</span>
          </div>
        )}
      </div>
    </div>
  );
};
