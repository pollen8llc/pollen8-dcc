import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, User, FileText, Heart, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import BioStep from './steps/BioStep';
import InterestsStep from './steps/InterestsStep';
import PrivacyStep from './steps/PrivacyStep';

interface UnifiedProfileFormProps {
  mode: 'setup' | 'edit';
  existingData?: any;
  onComplete?: () => void;
}

const UnifiedProfileForm = ({ mode, existingData, onComplete }: UnifiedProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { updateProfile } = useProfiles();
  const { toast } = useToast();
  
  // Instead of creating a new form instance, we use the parent's form context
  const form = useFormContext();
  
  // Validate if current tab is complete
  const validateTab = (tab: string): boolean => {
    const values = form.getValues();
    
    switch (tab) {
      case "basic":
        return !!(values.firstName && values.lastName);
      case "bio":
        return true; // Bio and location are optional
      case "interests":
        return true; // Interests are optional
      case "privacy":
        return true; // Privacy has a default value
      default:
        return false;
    }
  };
  
  // Handle tab navigation with validation in setup mode
  const handleTabChange = (tab: string) => {
    if (mode === 'edit') {
      setActiveTab(tab);
      return;
    }
    
    // In setup mode, check if tab is unlocked
    const tabOrder = ["basic", "bio", "interests", "privacy"];
    const currentIndex = tabOrder.indexOf(activeTab);
    const targetIndex = tabOrder.indexOf(tab);
    
    // Can only go to completed tabs or the next immediate tab
    if (targetIndex <= currentIndex + 1 || completedTabs.includes(tab)) {
      setActiveTab(tab);
    }
  };
  
  // Move to next tab after validation
  const handleNext = () => {
    const tabOrder = ["basic", "bio", "interests", "privacy"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (validateTab(activeTab)) {
      // Mark current tab as completed
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs([...completedTabs, activeTab]);
      }
      
      // Move to next tab if available
      if (currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }
    } else {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields before continuing.',
        variant: 'destructive',
      });
    }
  };
  
  // Check if a tab is accessible
  const isTabAccessible = (tab: string): boolean => {
    if (mode === 'edit') return true;
    
    const tabOrder = ["basic", "bio", "interests", "privacy"];
    const currentIndex = tabOrder.indexOf(activeTab);
    const targetIndex = tabOrder.indexOf(tab);
    
    return targetIndex === 0 || completedTabs.includes(tab) || targetIndex <= currentIndex + 1;
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicInfoStep />;
      case "bio":
        return <BioStep />;
      case "interests":
        return <InterestsStep />;
      case "privacy":
        return <PrivacyStep />;
      default:
        return null;
    }
  };
  
  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    
    console.log("UnifiedProfileForm: Form data being submitted:", data);
    console.log("UnifiedProfileForm: Social links in form data:", data.social_links);
    
    setIsSubmitting(true);
    
    try {
      
      // Update profile data
      try {
        const profileData = {
          id: currentUser.id,
          first_name: data.firstName,
          last_name: data.lastName,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
          social_links: data.social_links || {},
          privacy_settings: { profile_visibility: data.profileVisibility || 'public' },
          profile_complete: true,
          phone: data.phone,
          website: data.website,
        };
        
        console.log("UnifiedProfileForm: Profile data being sent to updateProfile:", profileData);
        console.log("UnifiedProfileForm: Social links being saved:", profileData.social_links);
        
        await updateProfile(profileData);
      } catch (profileError) {
        console.error('Error updating profile data:', profileError);
        throw new Error('Failed to update profile information');
      }
      
      try {
        // Refresh user data
        await refreshUser();
      } catch (refreshError) {
        console.error('Error refreshing user data:', refreshError);
        // Continue with flow even if refresh fails
      }
      
      toast({
        title: mode === 'setup' ? 'Profile setup complete' : 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      // Handle completion
      if (onComplete) {
        onComplete();
      } else {
        // Navigate based on mode
        navigate('/profile');
      }
      
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigation items for both modes
  const navItems = [
    {
      value: "basic",
      label: "Basic Info",
      icon: User,
      iconColor: "text-blue-500"
    },
    {
      value: "bio",
      label: "Bio & Location",
      icon: FileText,
      iconColor: "text-green-500"
    },
    {
      value: "interests",
      label: "Interests",
      icon: Heart,
      iconColor: "text-pink-500"
    },
    {
      value: "privacy",
      label: "Privacy",
      icon: Lock,
      iconColor: "text-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'setup' ? 'Complete Your Profile' : 'Edit Profile'}</CardTitle>
        <CardDescription>
          {mode === 'setup' 
            ? 'Set up your profile to get started and connect with others'
            : 'Update your profile information and privacy settings'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Navigation Bar */}
        <nav className="flex items-center gap-2 p-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg mb-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAccessible = isTabAccessible(item.value);
              const isCompleted = completedTabs.includes(item.value);
              
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleTabChange(item.value)}
                  disabled={!isAccessible && mode === 'setup'}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    "hover:scale-105 hover:shadow-[#00eada]/20",
                    activeTab === item.value
                      ? "bg-white/10 border border-white/20 text-foreground shadow-lg"
                      : isAccessible
                      ? "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/15"
                      : "bg-white/5 border border-white/5 text-muted-foreground/30 cursor-not-allowed opacity-50"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isAccessible ? item.iconColor : "text-muted-foreground/30")} />
                  <span className="flex-1">{item.label}</span>
                  {isCompleted && mode === 'setup' && (
                    <span className="text-green-500">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Content Area */}
        <div className="mt-6">
          <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
            {renderTabContent()}
          </form>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {mode === 'edit' && (
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
        )}
        {mode === 'setup' && activeTab !== 'privacy' ? (
          <Button 
            type="button"
            onClick={handleNext}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            form="profile-form"
            className={mode === 'setup' ? 'ml-auto' : ''}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              mode === 'setup' ? 'Complete Setup' : 'Save Changes'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UnifiedProfileForm;
