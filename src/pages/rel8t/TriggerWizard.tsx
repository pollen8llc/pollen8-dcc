
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
        <Rel8OnlyNavigation />
        
        <div className="flex items-center gap-4 mt-4 sm:mt-6 mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Create Trigger</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Set up an automation trigger for your relationships
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trigger Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Trigger Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Trigger Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Weekly Follow-up"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  required
                />
              </div>

              {/* Trigger Date */}
              <div className="space-y-2">
                <Label>Trigger Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                <Label htmlFor="triggerTime">Trigger Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="triggerTime"
                    type="time"
                    value={formData.triggerTime || "09:00"}
                    onChange={(e) => updateFormData({ triggerTime: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => updateFormData({ frequency: value })}
                >
                  <SelectTrigger>
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
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateFormData({ priority: value })}
                >
                  <SelectTrigger>
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

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
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
