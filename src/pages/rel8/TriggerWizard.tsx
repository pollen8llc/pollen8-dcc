import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Clock, Zap, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TriggerTemplateSelection, TriggerTemplateWithDate } from "@/components/rel8t/triggers/TriggerTemplateSelection";
import { FollowUpChannelStep } from "@/components/rel8t/triggers/FollowUpChannelStep";

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit,
    frequencyOptions,
    priorityOptions
  } = useTriggerWizard();

  const handleTemplateSelect = (template: TriggerTemplateWithDate) => {
    // Use the date from the template if provided
    const templateDate = template.selectedDate || (() => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + template.defaultDaysAhead);
      return newDate;
    })();
    
    // Pre-fill form data based on template
    updateFormData({
      frequency: template.frequency,
      triggerDate: template.id === 'custom' ? formData.triggerDate : templateDate,
      selectedTemplate: template.id
    });
    
    // Move to form view and step 2
    setShowTemplateSelection(false);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setShowTemplateSelection(true);
      setCurrentStep(1);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(returnTo || undefined);
    
    // Navigate based on returnTo parameter and success
    if (result) {
      if (returnTo === 'relationship') {
        navigate("/rel8/wizard");
      } else {
        navigate("/rel8/triggers");
      }
    }
  };

  const handleBack = () => {
    if (returnTo === 'relationship') {
      navigate("/rel8/build-rapport");
    } else {
      navigate("/rel8/triggers");
    }
  };

  const handleCancel = () => {
    if (returnTo === 'relationship') {
      navigate("/rel8/build-rapport");
    } else {
      navigate("/rel8/triggers");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Navigation Component */}
        <Rel8OnlyNavigation />

        {/* Minimal Header */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Create Trigger</h1>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-md bg-card/95 border-2 border-border">
          {!showTemplateSelection && (
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-base font-medium">
                Trigger Configuration
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className={cn("p-6", showTemplateSelection && "pt-8")}>
            {showTemplateSelection ? (
              <TriggerTemplateSelection 
                onSelectTemplate={handleTemplateSelect}
                showDatePickers={false}
              />
            ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {currentStep === 2 && (
                <>
                  {/* Change Template Button */}
                  {formData.selectedTemplate && formData.selectedTemplate !== 'custom' && (
                    <div className="flex justify-start -mt-2 mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSelection(true)}
                        className="text-xs hover:text-primary"
                      >
                        ← Change Template
                      </Button>
                    </div>
                  )}

                  {/* Trigger Name */}
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="name" className="text-sm font-medium">Trigger Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Weekly Follow-up"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      required
                      className="h-11 bg-background border-2 border-border focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Trigger Date - Hidden for template-based (already set) */}
                    {formData.selectedTemplate === 'custom' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-11 justify-start text-left font-normal bg-background border-2 border-border hover:border-primary",
                                !formData.triggerDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.triggerDate ? (
                                format(formData.triggerDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.triggerDate || undefined}
                              onSelect={(date) => updateFormData({ triggerDate: date || null })}
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {/* Show selected date as read-only for template-based triggers */}
                    {formData.selectedTemplate && formData.selectedTemplate !== 'custom' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Start Date</Label>
                        <div className="h-11 px-3 py-2 text-sm rounded-lg bg-muted border-2 border-border flex items-center">
                          {formData.triggerDate && format(formData.triggerDate, "PPP")}
                        </div>
                      </div>
                    )}

                    {/* Trigger Time */}
                    <div className="space-y-2">
                      <Label htmlFor="triggerTime" className="text-sm font-medium">Time *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="triggerTime"
                          type="time"
                          value={formData.triggerTime || "09:00"}
                          onChange={(e) => updateFormData({ triggerTime: e.target.value })}
                          className="h-11 pl-10 bg-background border-2 border-border focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Frequency - Only show for custom template */}
                    {formData.selectedTemplate === 'custom' && (
                      <div className="space-y-2">
                        <Label htmlFor="frequency" className="text-sm font-medium">Frequency *</Label>
                        <Select
                          value={formData.frequency}
                          onValueChange={(value) => updateFormData({ frequency: value })}
                        >
                          <SelectTrigger className="h-11 bg-background border-2 border-border hover:border-primary">
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
                    )}

                    {/* Show selected frequency as read-only for template-based triggers */}
                    {formData.selectedTemplate && formData.selectedTemplate !== 'custom' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Frequency</Label>
                        <div className="h-11 px-3 py-2 text-sm rounded-lg bg-muted border-2 border-border flex items-center">
                          {frequencyOptions.find(opt => opt.value === formData.frequency)?.label}
                        </div>
                      </div>
                    )}

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority *</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => updateFormData({ priority: value })}
                      >
                        <SelectTrigger className="h-11 bg-background border-2 border-border hover:border-primary">
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

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="h-11 px-6 border-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.name.trim()}
                      className="h-11 px-8"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <FollowUpChannelStep
                    selectedChannel={formData.outreachChannel}
                    channelDetails={formData.channelDetails}
                    onChannelChange={(channel) => updateFormData({ outreachChannel: channel })}
                    onDetailsChange={(details) => updateFormData({ channelDetails: details })}
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="h-11 px-6 border-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-11 px-6 border-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!formData.name.trim()}
                        className="h-11 px-8"
                      >
                        {returnTo === 'relationship' ? 'Add Trigger' : 'Create Trigger'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriggerWizard;