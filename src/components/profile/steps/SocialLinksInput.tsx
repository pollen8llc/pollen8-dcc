import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SocialLink {
  platform: string;
  url: string;
}

const COMMON_PLATFORMS = [
  'LinkedIn',
  'Twitter',
  'GitHub',
  'Instagram',
  'Facebook',
  'YouTube',
  'TikTok',
  'Portfolio',
  'Blog',
  'Other'
];

const SocialLinksInput = () => {
  const { watch, setValue } = useFormContext();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Watch for changes in the form's social_links field
  const formSocialLinks = watch('social_links');

  // Initialize from form data
  useEffect(() => {
    if (formSocialLinks && typeof formSocialLinks === 'object') {
      const links = Object.entries(formSocialLinks)
        .filter(([, url]) => url && typeof url === 'string' && url.trim() !== '')
        .map(([platform, url]) => ({
          platform,
          url: url as string
        }));
      setSocialLinks(links);
    }
  }, [formSocialLinks]);

  const updateFormValue = (links: SocialLink[]) => {
    const socialLinksObject = links.reduce((acc, link) => {
      if (link.platform && link.url) {
        acc[link.platform.toLowerCase()] = link.url;
      }
      return acc;
    }, {} as Record<string, string>);
    
    setValue('social_links', socialLinksObject, { shouldDirty: true });
  };

  const handleAddLink = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;

    const newLink = {
      platform: newPlatform.trim(),
      url: newUrl.trim()
    };

    const updatedLinks = [...socialLinks, newLink];
    setSocialLinks(updatedLinks);
    updateFormValue(updatedLinks);
    
    // Reset inputs
    setNewPlatform('');
    setNewUrl('');
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    updateFormValue(updatedLinks);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        name="social_links"
        render={() => (
          <FormItem>
            <FormLabel>Social Links</FormLabel>
            <div className="space-y-3">
              {/* Existing Links */}
              {socialLinks.map((link, index) => (
                <Card key={index} className="p-3">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {link.platform}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <span className="truncate">{link.url}</span>
                          {isValidUrl(link.url) && (
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Link */}
              <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Select value={newPlatform} onValueChange={setNewPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_PLATFORMS.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      placeholder="Enter URL"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      type="url"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLink}
                  disabled={!newPlatform.trim() || !newUrl.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>

              {socialLinks.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No social links added yet. Add your first link above!
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SocialLinksInput;
