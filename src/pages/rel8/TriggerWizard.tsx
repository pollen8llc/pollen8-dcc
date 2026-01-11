import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowLeft, Clock, Zap, ArrowRight, Check, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FollowUpChannelStep } from "@/components/rel8t/triggers/FollowUpChannelStep";
import { ContactTokenInput } from "@/components/rel8t/ContactTokenInput";
import { TriggerReviewStep } from "@/components/rel8t/triggers/TriggerReviewStep";

type FlipState = 'none' | 'date' | 'time';

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [flipState, setFlipState] = useState<FlipState>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit,
    frequencyOptions,
    priorityOptions
  } = useTriggerWizard();

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
    const result = await handleSubmit(returnTo || undefined, createOutreach);
    setIsSubmitting(false);
    
    if (result) {
      if (returnTo === 'relationship') {
        navigate("/rel8/wizard");
      } else {
        navigate("/rel8/triggers");
      }
    }
  };

  // Keep for form submission fallback (shouldn't be used with new flow)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    if (returnTo === 'relationship') {
      navigate("/rel8/wizard");
    } else {
      navigate("/rel8/triggers");
    }
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

  const inputClassName = "bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all";
  const selectTriggerClassName = "bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all";

  // Format display time
  const displayHours = hours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const display12Hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-4 py-8 pb-32">
        {/* Minimal Header */}
        <div className="flex items-center gap-3 mb-8 mt-6">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Create Reminder</h1>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 3</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
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
          className="relative w-full"
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
                "backdrop-blur-md bg-card/80 border-2 border-primary/20 rounded-2xl shadow-xl",
                "[backface-visibility:hidden]"
              )}
            >
              <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-8">
                  <div className="min-h-[350px]">
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Step Title */}
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Reminder Details
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">Configure when and how often to be reminded</p>
                        </div>

                        {/* Target Contacts */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground/70 pl-2">
                            Target Contacts <span className="text-destructive">*</span>
                          </Label>
                          <ContactTokenInput
                            selectedContacts={formData.selectedContacts}
                            onContactsChange={(contacts) => updateFormData({ selectedContacts: contacts })}
                            placeholder="Search and add contacts..."
                            required
                          />
                        </div>

                        {/* Start Date - Click to Flip Vertical */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground/70 pl-2">
                            Start Date <span className="text-destructive">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFlipState('date')}
                            className={cn(
                              "w-full justify-start text-left font-normal group",
                              inputClassName,
                              !formData.triggerDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                            {formData.triggerDate ? (
                              format(formData.triggerDate, "PPP")
                            ) : (
                              <span>Click to select date</span>
                            )}
                            <span className="ml-auto text-xs text-muted-foreground group-hover:text-primary transition-colors">
                              ↕ Flip
                            </span>
                          </Button>
                        </div>

                        {/* Trigger Time - Click to Flip Horizontal */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground/70 pl-2">
                            Time <span className="text-destructive">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setFlipState('time')}
                            className={cn(
                              "w-full justify-start text-left font-normal group",
                              inputClassName
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4 group-hover:text-teal-400 transition-colors" />
                            <span className="font-mono text-base">
                              {display12Hour}:{displayMinutes} {period}
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground group-hover:text-teal-400 transition-colors">
                              ↔ Flip
                            </span>
                          </Button>
                        </div>

                        {/* Frequency & Priority Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Frequency */}
                          <div className="space-y-2">
                            <Label htmlFor="frequency" className="text-sm font-medium text-foreground/70 pl-2">
                              Frequency
                            </Label>
                            <Select
                              value={formData.frequency}
                              onValueChange={(value) => updateFormData({ frequency: value })}
                            >
                              <SelectTrigger className={selectTriggerClassName}>
                                <SelectValue placeholder="Select frequency" />
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
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground/70 pl-2">
                              Priority
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) => updateFormData({ priority: value })}
                            >
                              <SelectTrigger className={selectTriggerClassName}>
                                <SelectValue placeholder="Select priority" />
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
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Follow-Up Channel
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">Choose how you'll reach out (optional)</p>
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
                      />
                    )}
                  </div>

                  {/* Action Buttons - Hide on Step 3 since TriggerReviewStep has its own */}
                  {currentStep < 3 && (
                  <div className="flex items-center justify-between pt-6 border-t border-primary/20">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="backdrop-blur-sm"
                      >
                        Cancel
                      </Button>
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          className="backdrop-blur-sm bg-background/50 border-primary/30"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      )}
                    </div>

                    <div>
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={currentStep === 1 ? !canProceed() : (formData.outreachChannel && !isChannelDetailsValid())}
                        className="backdrop-blur-sm shadow-lg"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Back Face - Calendar (Vertical Flip) */}
            {flipState === 'date' && (
            <Card 
              className={cn(
                "absolute inset-0 backdrop-blur-md bg-card/95 border-2 border-primary/20 rounded-2xl shadow-xl",
                "[backface-visibility:hidden] [transform:rotateX(180deg)]"
              )}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Select Start Date
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.triggerDate 
                        ? `Selected: ${format(formData.triggerDate, "PPPP")}`
                        : "Choose when your reminder starts"
                      }
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFlipState('none')}
                    className="backdrop-blur-sm bg-background/50 border-primary/30 gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Back
                  </Button>
                </div>

                {/* Full-Width Calendar */}
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
                    className="w-full max-w-none rounded-xl border-2 border-primary/10 bg-background/50 p-4 md:p-8 
                      [&_.rdp-months]:w-full 
                      [&_.rdp-month]:w-full 
                      [&_.rdp-table]:w-full 
                      [&_.rdp-head_row]:flex [&_.rdp-head_row]:w-full [&_.rdp-head_row]:justify-around
                      [&_.rdp-row]:flex [&_.rdp-row]:w-full [&_.rdp-row]:justify-around
                      [&_.rdp-cell]:flex-1 [&_.rdp-cell]:text-center
                      [&_.rdp-day]:w-full [&_.rdp-day]:h-14 [&_.rdp-day]:md:h-16 [&_.rdp-day]:text-base [&_.rdp-day]:md:text-lg
                      [&_.rdp-caption_label]:text-xl [&_.rdp-caption_label]:md:text-2xl
                      [&_.rdp-nav_button]:h-10 [&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:md:h-12 [&_.rdp-nav_button]:md:w-12"
                  />
                </div>

                {/* Confirm Button */}
                <div className="pt-6 border-t border-primary/20 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setFlipState('none')}
                    disabled={!formData.triggerDate}
                    className="backdrop-blur-sm shadow-lg"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Date
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
