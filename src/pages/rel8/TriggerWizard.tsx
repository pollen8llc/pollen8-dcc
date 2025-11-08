import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Clock, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useNavigate, useSearchParams } from "react-router-dom";

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit,
    frequencyOptions,
    priorityOptions
  } = useTriggerWizard();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Component */}
        <Rel8OnlyNavigation />

        {/* Minimal Header */}
        <div className="flex items-center gap-3 mb-8">
          <Zap className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Create Trigger</h1>
            <p className="text-sm text-muted-foreground">
              Set up an automation for your relationships
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-morphism border-0 backdrop-blur-md">
          <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="text-lg">Trigger Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Trigger Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Trigger Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Weekly Follow-up"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  required
                  className="backdrop-blur-sm bg-background/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trigger Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Trigger Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal backdrop-blur-sm bg-background/50",
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
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.triggerDate || undefined}
                        onSelect={(date) => updateFormData({ triggerDate: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Trigger Time */}
                <div className="space-y-2">
                  <Label htmlFor="triggerTime" className="text-sm font-medium">Trigger Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="triggerTime"
                      type="time"
                      value={formData.triggerTime || "09:00"}
                      onChange={(e) => updateFormData({ triggerTime: e.target.value })}
                      className="pl-10 backdrop-blur-sm bg-background/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frequency */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => updateFormData({ frequency: value })}
                  >
                    <SelectTrigger className="backdrop-blur-sm bg-background/50">
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
                  <Label className="text-sm font-medium">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => updateFormData({ priority: value })}
                  >
                    <SelectTrigger className="backdrop-blur-sm bg-background/50">
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

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!formData.name || !formData.triggerDate}
                >
                  {returnTo === 'relationship' ? 'Create & Continue' : 'Create Trigger'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriggerWizard;