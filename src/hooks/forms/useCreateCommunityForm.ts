
import { useState, useEffect } from 'react';
import { Community } from '@/models/types';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '@/services/communityService';
import { processTargetAudience } from '@/utils/communityUtils';

// Defining step types
export type StepKey =
  | 'welcome'
  | 'name'
  | 'description'
  | 'type'
  | 'format'
  | 'location'
  | 'size'
  | 'date'
  | 'frequency'
  | 'website'
  | 'social'
  | 'platforms'
  | 'tags'
  | 'review';

// Keep track of form progress
const useCreateCommunityForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepKey>('welcome');
  const [formData, setFormData] = useState<Partial<Community>>({
    name: '',
    description: '',
    type: '',
    format: '',
    location: '',
    target_audience: [],
    social_media: {},
    website: '',
    is_public: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdCommunityId, setCreatedCommunityId] = useState<string | null>(null);

  // Process form data into a Community object
  const processFormData = (): Partial<Community> => {
    // Process target audience array using the utility function
    const processedTargetAudience = processTargetAudience(formData.target_audience);

    return {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      format: formData.format,
      location: formData.location,
      target_audience: processedTargetAudience,
      social_media: formData.social_media,
      website: formData.website,
      is_public: true,
      // Add other properties as needed
    };
  };

  // Update form data
  const updateFormData = (data: Partial<Community>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Go to next step
  const nextStep = () => {
    const steps: StepKey[] = [
      'welcome',
      'name',
      'description',
      'type',
      'format',
      'location',
      'size',
      'date',
      'frequency',
      'website',
      'social',
      'platforms',
      'tags',
      'review'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Go to previous step
  const prevStep = () => {
    const steps: StepKey[] = [
      'welcome',
      'name',
      'description',
      'type',
      'format',
      'location',
      'size',
      'date',
      'frequency',
      'website',
      'social',
      'platforms',
      'tags',
      'review'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Go to specific step
  const goToStep = (step: StepKey) => {
    setCurrentStep(step);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const communityData = processFormData();
      
      // Create community
      const response = await createCommunity(communityData);
      
      setSuccess(true);
      setCreatedCommunityId(response.id);
      
      // Navigate to the new community page after a short delay
      setTimeout(() => {
        navigate(`/community/${response.id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating community:', error);
      setError(error instanceof Error ? error.message : 'Failed to create community');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    isSubmitting,
    error,
    success,
    createdCommunityId
  };
};

export default useCreateCommunityForm;
