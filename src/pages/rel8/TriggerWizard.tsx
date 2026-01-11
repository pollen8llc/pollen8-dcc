import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeft, Clock, Zap, ArrowRight, Check, RotateCcw, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FollowUpChannelStep } from "@/components/rel8t/triggers/FollowUpChannelStep";
import { ContactTokenInput } from "@/components/rel8t/ContactTokenInput";
import { TriggerReviewStep } from "@/components/rel8t/triggers/TriggerReviewStep";
import { EditDetailsStep } from "@/components/rel8t/wizard/EditDetailsStep";
import { EditChannelStep } from "@/components/rel8t/wizard/EditChannelStep";
import { ReviewEditStep } from "@/components/rel8t/wizard/ReviewEditStep";
import { TriggerCreatedDialog } from "@/components/rel8t/TriggerCreatedDialog";
import { useRelationshipWizard, Actv8StepData } from "@/contexts/RelationshipWizardContext";
import { getOutreachById, Outreach } from "@/services/rel8t/outreachService";
import { getContacts } from "@/services/rel8t/contactService";
import { Trigger } from "@/services/rel8t/triggerService";
import { useQuery } from "@tanstack/react-query";

type FlipState = 'none' | 'date' | 'time';
type WizardMode = 'create' | 'edit';
type EditWizardStep = 'edit-details' | 'edit-channel' | 'review-edit';

interface EditWizardData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  outreachChannel: string | null;
  channelDetails: Record<string, any> | null;
}

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Detect mode from URL params
  const mode = searchParams.get('mode');
  const outreachId = searchParams.get('id');
  const actv8IdParam = searchParams.get('actv8Id');
  const stepIndexParam = searchParams.get('stepIndex');
  const returnTo = searchParams.get('returnTo');
  
  const isEditMode = mode === 'edit' && outreachId;
  const isActv8Mode = !!actv8IdParam;

  // Get context for Actv8 mode
  const {
    preSelectedContacts,
    actv8ContactId,
    actv8StepIndex,
    actv8StepData,
    clearWizardData,
  } = useRelationshipWizard();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(isActv8Mode ? 1 : 1);
  const [editStep, setEditStep] = useState<EditWizardStep>('edit-details');
  const [flipState, setFlipState] = useState<FlipState>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState<EditWizardData | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdTrigger, setCreatedTrigger] = useState<Trigger | null>(null);
  const [icsContent, setIcsContent] = useState<string | null>(null);
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit,
    frequencyOptions,
    priorityOptions
  } = useTriggerWizard();

  // Fetch existing outreach data when in edit mode
  const { data: existingOutreach, isLoading: isLoadingOutreach } = useQuery({
    queryKey: ['outreach', outreachId],
    queryFn: () => getOutreachById(outreachId!),
    enabled: !!isEditMode,
  });

  // Initialize form with pre-selected contacts from context (for Actv8 mode)
  useEffect(() => {
    if (isActv8Mode && preSelectedContacts.length > 0) {
      updateFormData({ selectedContacts: preSelectedContacts });
    }
  }, [isActv8Mode, preSelectedContacts, updateFormData]);

  // Parse time into hours and minutes
  const [hours, minutes] = (formData.triggerTime || "09:00").split(':').map(Number);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleReviewSubmit = async (createOutreach: boolean) => {
    setIsSubmitting(true);
    
    // Pass Actv8 context data if in Actv8 mode
    const result = await handleSubmit(
      returnTo || undefined, 
      createOutreach,
      isActv8Mode ? {
        actv8ContactId: actv8ContactId || actv8IdParam,
        actv8StepIndex: actv8StepIndex ?? (stepIndexParam ? parseInt(stepIndexParam) : undefined),
        actv8StepData,
      } : undefined
    );
    
    setIsSubmitting(false);
    
    if (result) {
      // Show success dialog with calendar download option
      setCreatedTrigger(result.trigger);
      setIcsContent(result.icsContent);
      setShowSuccessDialog(true);
    }
  };

  // Keep for form submission fallback
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDateSelect = (date: Date | undefined) => {
    updateFormData({ triggerDate: date || null });
    setTimeout(() => setFlipState('none'), 150);
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const h = newHours.toString().padStart(2, '0');
    const m = newMinutes.toString().padStart(2, '0');
    updateFormData({ triggerTime: `${h}:${m}` });
  };

  const incrementHour = () => {
    const newHours = hours >= 23 ? 0 : hours + 1;
    handleTimeChange(newHours, minutes);
  };

  const decrementHour = () => {
    const newHours = hours <= 0 ? 23 : hours - 1;
    handleTimeChange(newHours, minutes);
  };

  const incrementMinute = () => {
    const newMinutes = minutes >= 55 ? 0 : minutes + 5;
    handleTimeChange(hours, newMinutes);
  };

  const decrementMinute = () => {
    const newMinutes = minutes <= 0 ? 55 : minutes - 5;
    handleTimeChange(hours, newMinutes);
  };

  const toggleAMPM = (targetPeriod: 'AM' | 'PM') => {
    const currentPeriod = hours >= 12 ? 'PM' : 'AM';
    if (currentPeriod === targetPeriod) return;
    
    if (targetPeriod === 'AM' && hours >= 12) {
      handleTimeChange(hours - 12, minutes);
    } else if (targetPeriod === 'PM' && hours < 12) {
      handleTimeChange(hours + 12, minutes);
    }
  };

  const isChannelDetailsValid = () => {
    if (!formData.outreachChannel) return true;
    
    const details = formData.channelDetails;
    if (!details) return false;
    
    switch (formData.outreachChannel) {
      case 'text':
      case 'call':
        return !!details.phone?.trim();
      case 'email':
        return !!details.email?.trim();
      case 'dm':
        return !!details.platform?.trim() && !!details.handle?.trim();
      case 'meeting':
        return !!details.meetingPlatform?.trim() && !!details.link?.trim();
      case 'irl':
        return !!details.address?.trim();
      default:
        return false;
    }
  };

  const canProceed = () => {
    return formData.selectedContacts.length > 0 && formData.triggerDate !== null;
  };

  // Edit mode handlers
  const handleEditDetailsNext = (stepData: EditWizardData) => {
    setEditData(prev => ({ ...prev, ...stepData } as EditWizardData));
    setEditStep('edit-channel');
  };

  const handleEditChannelNext = (stepData: { outreachChannel: string | null; channelDetails: Record<string, any> | null }) => {
    setEditData(prev => ({ ...prev, ...stepData } as EditWizardData));
    setEditStep('review-edit');
  };

  const inputClassName = "bg-background/90 backdrop-blur-lg border border-primary/30 focus:border-primary/60 rounded-lg shadow-md h-10 sm:h-11 transition-all text-sm";
  const selectTriggerClassName = "bg-background/90 backdrop-blur-lg border border-primary/30 focus:border-primary/60 rounded-lg shadow-md h-10 sm:h-11 transition-all text-sm";

  // Format display time
  const displayHours = hours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const display12Hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  // Get step title based on mode
  const getStepTitle = () => {
    if (isEditMode) {
      switch (editStep) {
        case 'edit-details': return 'Edit Details';
        case 'edit-channel': return 'Edit Channel';
        case 'review-edit': return 'Review Changes';
      }
    }
    
    if (isActv8Mode && actv8StepData) {
      return `Schedule: ${actv8StepData.stepName}`;
    }
    
    return 'Create Reminder';
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingOutreach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto max-w-5xl px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && !existingOutreach && !isLoadingOutreach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Outreach task not found</h2>
            <p className="text-muted-foreground mt-2">The outreach task you're trying to edit doesn't exist.</p>
            <Button onClick={() => navigate('/rel8/actv8?tab=outreach')} className="mt-4">
              Back to Outreach
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode UI
  if (isEditMode && existingOutreach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        
        <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-8 pb-40">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6 mt-2 sm:mt-6">
            <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm flex-shrink-0">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">{getStepTitle()}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Update your outreach task</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-1.5 mb-4 sm:mb-6">
            <div className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              editStep === 'edit-details' || editStep === 'edit-channel' || editStep === 'review-edit' ? "bg-primary" : "bg-primary/20"
            )} />
            <div className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              editStep === 'edit-channel' || editStep === 'review-edit' ? "bg-primary" : "bg-primary/20"
            )} />
            <div className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              editStep === 'review-edit' ? "bg-primary" : "bg-primary/20"
            )} />
          </div>

          <Card className="backdrop-blur-md bg-card/80 border border-primary/20 rounded-xl shadow-xl mb-8">
            <CardContent className="p-4 sm:p-6">
              {editStep === 'edit-details' && (
                <EditDetailsStep
                  outreach={existingOutreach}
                  onNext={handleEditDetailsNext}
                />
              )}

              {editStep === 'edit-channel' && (
                <EditChannelStep
                  outreach={existingOutreach}
                  onNext={handleEditChannelNext}
                  onPrevious={() => setEditStep('edit-details')}
                />
              )}

              {editStep === 'review-edit' && editData && (
                <ReviewEditStep
                  outreach={existingOutreach}
                  updatedData={editData}
                  onPrevious={() => setEditStep('edit-channel')}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-5xl pointer-events-auto">
            <Rel8OnlyNavigation />
          </div>
        </div>
      </div>
    );
  }

  // Create mode UI (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-8 pb-40">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 mt-2 sm:mt-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm flex-shrink-0">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">{getStepTitle()}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Step {currentStep} of 3</p>
            </div>
          </div>
          
          {/* Actv8 Build Rapport Badge - stacks on mobile */}
          {isActv8Mode && actv8StepData && (
            <Badge variant="outline" className="self-start sm:self-center px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 truncate max-w-full">
              <Zap className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{actv8StepData.pathName}</span>
            </Badge>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1.5 mb-4 sm:mb-6">
          <div className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            currentStep >= 1 ? "bg-primary" : "bg-primary/20"
          )} />
          <div className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            currentStep >= 2 ? "bg-primary" : "bg-primary/20"
          )} />
          <div className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            currentStep >= 3 ? "bg-primary" : "bg-primary/20"
          )} />
        </div>

        {/* Flip Card Container */}
        <div 
          className="relative w-full mb-8"
          style={{ perspective: "1500px" }}
        >
          <div
            className={cn(
              "relative w-full transition-transform duration-700 ease-in-out",
              "[transform-style:preserve-3d]",
              flipState === 'date' && "[transform:rotateX(180deg)]",
              flipState === 'time' && "[transform:rotateY(180deg)]"
            )}
          >
            {/* Front Face - Form */}
            <Card 
              className={cn(
                "backdrop-blur-md bg-card/80 border border-primary/20 rounded-xl shadow-xl",
                "[backface-visibility:hidden]"
              )}
            >
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="min-h-[280px] sm:min-h-[320px]">
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fade-in">
                        {/* Step Title */}
                        <div className="mb-4">
                          <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Reminder Details
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Configure when and how often</p>
                        </div>

                        {/* Target Contacts */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/70 pl-1">
                            Target Contacts <span className="text-destructive">*</span>
                            {isActv8Mode && (
                              <span className="text-emerald-500 ml-2 text-[10px]">(Locked)</span>
                            )}
                          </Label>
                          <ContactTokenInput
                            selectedContacts={formData.selectedContacts}
                            onContactsChange={(contacts) => updateFormData({ selectedContacts: contacts })}
                            placeholder="Search contacts..."
                            required
                            locked={isActv8Mode}
                          />
                        </div>

                        {/* Start Date - Click to Flip Vertical */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/70 pl-1">
                            Start Date <span className="text-destructive">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFlipState('date')}
                            className={cn(
                              "w-full justify-start text-left font-normal group text-sm",
                              inputClassName,
                              !formData.triggerDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                            {formData.triggerDate ? (
                              format(formData.triggerDate, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </div>

                        {/* Trigger Time - Click to Flip Horizontal */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/70 pl-1">
                            Time <span className="text-destructive">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFlipState('time')}
                            className={cn(
                              "w-full justify-start text-left font-normal group text-sm",
                              inputClassName
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4 group-hover:text-teal-400 transition-colors" />
                            <span className="font-mono">
                              {display12Hour}:{displayMinutes} {period}
                            </span>
                          </Button>
                        </div>

                        {/* Frequency & Priority Row */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Frequency */}
                          <div className="space-y-1.5">
                            <Label htmlFor="frequency" className="text-xs font-medium text-foreground/70 pl-1">
                              Frequency
                            </Label>
                            <Select
                              value={formData.frequency}
                              onValueChange={(value) => updateFormData({ frequency: value })}
                            >
                              <SelectTrigger className={selectTriggerClassName}>
                                <SelectValue placeholder="Frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                {frequencyOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Priority */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-foreground/70 pl-1">
                              Priority
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) => updateFormData({ priority: value })}
                            >
                              <SelectTrigger className={selectTriggerClassName}>
                                <SelectValue placeholder="Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {priorityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        {/* Step Title */}
                        <div className="mb-4">
                          <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Follow-Up Channel
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">Choose how you'll reach out (optional)</p>
                        </div>

                        <FollowUpChannelStep
                          selectedChannel={formData.outreachChannel}
                          channelDetails={formData.channelDetails}
                          onChannelChange={(channel) => updateFormData({ outreachChannel: channel })}
                          onDetailsChange={(details) => updateFormData({ channelDetails: details })}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <TriggerReviewStep
                        formData={formData}
                        onSubmit={handleReviewSubmit}
                        onPrevious={handlePrevious}
                        isSubmitting={isSubmitting}
                        onUpdatePriority={(priority) => updateFormData({ priority })}
                        actv8StepData={isActv8Mode && actv8StepData ? { stepName: actv8StepData.stepName, pathName: actv8StepData.pathName } : undefined}
                        isActv8Mode={isActv8Mode}
                      />
                    )}
                  </div>

                  {/* Action Buttons - Hide on Step 3 since TriggerReviewStep has its own */}
                  {currentStep < 3 && (
                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="text-muted-foreground"
                      >
                        Cancel
                      </Button>
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevious}
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      )}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentStep === 1 ? !canProceed() : (formData.outreachChannel && !isChannelDetailsValid())}
                      className="shadow-md"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Back Face - Calendar (Vertical Flip) */}
            {flipState === 'date' && (
            <Card 
              className={cn(
                "absolute inset-0 backdrop-blur-md bg-card/95 border-2 border-primary/10 rounded-2xl shadow-xl",
                "[backface-visibility:hidden] [transform:rotateX(180deg)]"
              )}
            >
              <CardContent className="p-3 sm:p-6 h-full flex flex-col">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Select Date
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                      {formData.triggerDate 
                        ? format(formData.triggerDate, "PPP")
                        : "Choose start date"
                      }
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFlipState('none')}
                    className="backdrop-blur-sm bg-background/50 border-primary/30 gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    Back
                  </Button>
                </div>

                {/* Calendar - Mobile optimized */}
                <div className="flex-1 flex items-center justify-center">
                  <Calendar
                    mode="single"
                    selected={formData.triggerDate || undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-xl border border-primary/10 bg-background/50 p-2 sm:p-4 pointer-events-auto scale-[0.85] sm:scale-100 origin-center"
                  />
                </div>

                {/* Confirm Button */}
                <div className="pt-3 sm:pt-6 border-t border-primary/20 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setFlipState('none')}
                    disabled={!formData.triggerDate}
                    className="backdrop-blur-sm shadow-lg h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Back Face - Time Picker (Horizontal Flip) */}
            {flipState === 'time' && (
            <Card 
              className={cn(
                "absolute inset-0 backdrop-blur-md bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900/50 border-2 border-teal-500/30 rounded-2xl shadow-xl shadow-teal-500/10",
                "[backface-visibility:hidden] [transform:rotateY(180deg)]"
              )}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Time Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Set Reminder Time
                    </h2>
                    <p className="text-sm text-teal-300/60 mt-1">
                      When should we remind you?
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFlipState('none')}
                    className="backdrop-blur-sm bg-slate-800/50 border-teal-500/30 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Back
                  </Button>
                </div>

                {/* Digital Clock Interface */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-2xl">
                    {/* Clock Display */}
                    <div className="relative rounded-2xl bg-slate-900/80 border-2 border-teal-500/20 p-8 md:p-12 shadow-inner">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
                      
                      {/* Time Display */}
                      <div className="flex items-center justify-center gap-4 md:gap-8">
                        {/* Hours */}
                        <div className="flex flex-col items-center gap-3">
                          <button
                            type="button"
                            onClick={incrementHour}
                            className="p-2 md:p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 transition-all group"
                          >
                            <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-teal-400 group-hover:text-teal-300" />
                          </button>
                          <div className="relative">
                            <div className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold text-teal-400 tracking-wider tabular-nums drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                              {display12Hour.toString().padStart(2, '0')}
                            </div>
                            <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-teal-500/60 uppercase tracking-widest">
                              Hours
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={decrementHour}
                            className="p-2 md:p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 transition-all group"
                          >
                            <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-teal-400 group-hover:text-teal-300" />
                          </button>
                        </div>

                        {/* Separator */}
                        <div className="flex flex-col gap-4 pb-6">
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.8)] animate-pulse" />
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.8)] animate-pulse" />
                        </div>

                        {/* Minutes */}
                        <div className="flex flex-col items-center gap-3">
                          <button
                            type="button"
                            onClick={incrementMinute}
                            className="p-2 md:p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 transition-all group"
                          >
                            <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-teal-400 group-hover:text-teal-300" />
                          </button>
                          <div className="relative">
                            <div className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold text-teal-400 tracking-wider tabular-nums drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]">
                              {displayMinutes}
                            </div>
                            <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-teal-500/60 uppercase tracking-widest">
                              Minutes
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={decrementMinute}
                            className="p-2 md:p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 transition-all group"
                          >
                            <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-teal-400 group-hover:text-teal-300" />
                          </button>
                        </div>

                        {/* AM/PM Toggle */}
                        <div className="flex flex-col items-center gap-2 ml-4 md:ml-8">
                          <button
                            type="button"
                            onClick={() => toggleAMPM('AM')}
                            className={cn(
                              "px-3 py-2 md:px-4 md:py-3 rounded-lg font-mono text-lg md:text-xl font-bold transition-all cursor-pointer",
                              period === 'AM' 
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                                : "bg-slate-800/50 text-slate-500 border border-slate-700 hover:bg-slate-700/50 hover:text-slate-400"
                            )}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleAMPM('PM')}
                            className={cn(
                              "px-3 py-2 md:px-4 md:py-3 rounded-lg font-mono text-lg md:text-xl font-bold transition-all cursor-pointer",
                              period === 'PM' 
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                                : "bg-slate-800/50 text-slate-500 border border-slate-700 hover:bg-slate-700/50 hover:text-slate-400"
                            )}
                          >
                            PM
                          </button>
                        </div>
                      </div>

                      {/* Quick Time Presets */}
                      <div className="mt-8 pt-6 border-t border-teal-500/10">
                        <p className="text-xs text-teal-500/60 uppercase tracking-widest mb-3 text-center">Quick Select</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {[
                            { value: '09:00', label: '9 AM' },
                            { value: '12:00', label: '12 PM' },
                            { value: '14:00', label: '2 PM' },
                            { value: '17:00', label: '5 PM' },
                            { value: '20:00', label: '8 PM' }
                          ].map((preset) => (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => updateFormData({ triggerTime: preset.value })}
                              className={cn(
                                "px-4 py-2 rounded-lg font-mono text-sm transition-all",
                                formData.triggerTime === preset.value
                                  ? "bg-teal-500/30 text-teal-200 border border-teal-500/50"
                                  : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-teal-500/10 hover:text-teal-300 hover:border-teal-500/30"
                              )}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="pt-6 border-t border-teal-500/20 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setFlipState('none')}
                    className="backdrop-blur-sm shadow-lg bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Time
                  </Button>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <TriggerCreatedDialog 
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open);
          if (!open) {
            clearWizardData();
            navigate("/rel8/actv8?tab=outreach");
          }
        }}
        trigger={createdTrigger}
        icsContent={icsContent}
      />

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-5xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
};

export default TriggerWizard;
