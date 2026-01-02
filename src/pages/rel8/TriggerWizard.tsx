import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bell, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

import { TemplateCarousel, Template } from "@/components/rel8t/triggers/ReminderWizard/TemplateCarousel";
import { DateSelector } from "@/components/rel8t/triggers/ReminderWizard/DateSelector";
import { TimeSelector } from "@/components/rel8t/triggers/ReminderWizard/TimeSelector";
import { FrequencySelector } from "@/components/rel8t/triggers/ReminderWizard/FrequencySelector";
import { PrioritySelector } from "@/components/rel8t/triggers/ReminderWizard/PrioritySelector";
import { ChannelSelector } from "@/components/rel8t/triggers/ReminderWizard/ChannelSelector";
import { WizardProgress } from "@/components/rel8t/triggers/ReminderWizard/WizardProgress";

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit 
  } = useTriggerWizard();

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    
    // Calculate date based on template
    const templateDate = new Date();
    templateDate.setDate(templateDate.getDate() + template.defaultDaysAhead);
    
    updateFormData({
      frequency: template.frequency === 'custom' ? 'onetime' : template.frequency,
      triggerDate: templateDate,
      selectedTemplate: template.id
    });
    
    setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setSelectedTemplate(null);
    } else {
      navigate(returnTo === 'relationship' ? '/rel8/wizard' : '/rel8/triggers');
    }
  };

  const handleNext = () => {
    if (step === 2) {
      setStep(3);
    }
  };

  const onSubmit = async () => {
    const result = await handleSubmit(returnTo || undefined);
    if (result) {
      navigate(returnTo === 'relationship' ? '/rel8/wizard' : '/rel8/triggers');
    }
  };

  const isStep2Valid = formData.name.trim() && formData.triggerDate;
  const isStep3Valid = !formData.outreachChannel || isChannelDetailsValid();

  function isChannelDetailsValid() {
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
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={handleBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-secondary active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <span className="font-semibold">New Reminder</span>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
        
        {step > 1 && (
          <div className="px-4 pb-3 max-w-lg mx-auto">
            <WizardProgress currentStep={step - 1} totalSteps={2} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <TemplateCarousel onSelect={handleTemplateSelect} />
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Template Badge */}
            {selectedTemplate && (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <selectedTemplate.icon className="w-4 h-4" />
                {selectedTemplate.name}
                <span className="text-primary/60">· Change</span>
              </button>
            )}

            {/* Name Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Reminder Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g., Follow up with Alex"
                className="h-14 bg-secondary/30 border-0 rounded-2xl text-lg placeholder:text-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                When
              </label>
              <DateSelector
                value={formData.triggerDate}
                onChange={(date) => updateFormData({ triggerDate: date })}
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Time
              </label>
              <TimeSelector
                value={formData.triggerTime || '09:00'}
                onChange={(time) => updateFormData({ triggerTime: time })}
              />
            </div>

            {/* Frequency - Only for custom */}
            {selectedTemplate?.id === 'custom' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Repeat
                </label>
                <FrequencySelector
                  value={formData.frequency}
                  onChange={(frequency) => updateFormData({ frequency })}
                />
              </div>
            )}

            {/* Priority */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Priority
              </label>
              <PrioritySelector
                value={formData.priority}
                onChange={(priority) => updateFormData({ priority })}
              />
            </div>
          </div>
        )}

        {/* Step 3: Channel */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Summary Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{formData.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formData.triggerDate && format(formData.triggerDate, 'EEE, MMM d')} at {formData.triggerTime || '9:00 AM'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">
                      {formData.frequency === 'onetime' ? 'Once' : formData.frequency}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full capitalize",
                      formData.priority === 'high' && "bg-rose-500/20 text-rose-400",
                      formData.priority === 'medium' && "bg-amber-500/20 text-amber-400",
                      formData.priority === 'low' && "bg-emerald-500/20 text-emerald-400"
                    )}>
                      {formData.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                How will you follow up? <span className="text-muted-foreground/60">(optional)</span>
              </label>
              <ChannelSelector
                selectedChannel={formData.outreachChannel}
                channelDetails={formData.channelDetails}
                onChannelChange={(channel) => updateFormData({ outreachChannel: channel })}
                onDetailsChange={(details) => updateFormData({ channelDetails: details })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {step > 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50">
          <div className="max-w-lg mx-auto px-4 py-4 pb-6">
            {step === 2 ? (
              <Button
                onClick={handleNext}
                disabled={!isStep2Valid}
                size="lg"
                className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                disabled={!isStep3Valid}
                size="lg"
                className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20 gap-2"
              >
                <Check className="w-5 h-5" />
                {returnTo === 'relationship' ? 'Add Reminder' : 'Create Reminder'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation - Only on step 1 */}
      {step === 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-lg pointer-events-auto">
            <Rel8OnlyNavigation />
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerWizard;
