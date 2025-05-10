
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Plus, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/services/rel8t/contactService";

interface SelectTriggersStepProps {
  selectedContacts: Contact[];
  selectedTriggers: any[];
  onNext: (data: { triggers: any[] }) => void;
  onPrevious: () => void;
}

// Define types for template delay
interface TemplateDelay {
  value: number;
  unit: string;
}

// Define type for trigger template
interface TriggerTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  delay: TemplateDelay;
  isCustomDate?: boolean;
}

// Trigger template options
const triggerTemplates: TriggerTemplate[] = [
  {
    id: "follow-up-1",
    name: "Initial Follow-up",
    description: "Send a follow-up email one week after initial contact",
    type: "email",
    delay: { value: 1, unit: "week" }
  },
  {
    id: "check-in-1",
    name: "Quarterly Check-in",
    description: "Regular quarterly check-in with important contacts",
    type: "email",
    delay: { value: 3, unit: "month" }
  },
  {
    id: "birthday",
    name: "Birthday Greeting",
    description: "Send birthday wishes on contact's birthday",
    type: "email",
    delay: { value: 0, unit: "custom" },
    isCustomDate: true
  },
  {
    id: "project-update",
    name: "Project Update",
    description: "Send a project status update",
    type: "email",
    delay: { value: 2, unit: "week" }
  },
];

export const SelectTriggersStep: React.FC<SelectTriggersStepProps> = ({
  selectedContacts,
  selectedTriggers: initialTriggers,
  onNext,
  onPrevious,
}) => {
  const [triggers, setTriggers] = useState<any[]>(initialTriggers || []);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customTrigger, setCustomTrigger] = useState({
    name: "",
    description: "",
    type: "email",
    date: new Date(),
    time: "09:00"
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCustomForm(false);
    
    const template = triggerTemplates.find(t => t.id === templateId);
    if (template) {
      // Calculate date based on template delay
      let triggerDate = new Date();
      
      if (template.delay.unit === "day") {
        triggerDate = addDays(triggerDate, template.delay.value);
      } else if (template.delay.unit === "week") {
        triggerDate = addWeeks(triggerDate, template.delay.value);
      } else if (template.delay.unit === "month") {
        triggerDate = addMonths(triggerDate, template.delay.value);
      }
      
      setCustomTrigger({
        name: template.name,
        description: template.description,
        type: template.type,
        date: triggerDate,
        time: "09:00"
      });
    }
  };

  const addTrigger = () => {
    if (!customTrigger.name) {
      return;
    }
    
    const newTrigger = {
      id: `trigger-${Date.now()}`,
      ...customTrigger,
      dateTime: new Date(
        customTrigger.date.setHours(
          parseInt(customTrigger.time.split(":")[0]),
          parseInt(customTrigger.time.split(":")[1]),
          0
        )
      ).toISOString()
    };
    
    setTriggers([...triggers, newTrigger]);
    setShowCustomForm(false);
    setCustomTrigger({
      name: "",
      description: "",
      type: "email",
      date: new Date(),
      time: "09:00"
    });
    setSelectedTemplate("");
  };

  const removeTrigger = (id: string) => {
    setTriggers(triggers.filter(trigger => trigger.id !== id));
  };

  const handleNext = () => {
    onNext({ triggers });
  };

  const handleCustomTriggerToggle = () => {
    setShowCustomForm(true);
    setSelectedTemplate("");
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Selected Contacts ({selectedContacts.length})</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
            >
              {contact.name}
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Outreach Reminders</h3>
      
      {/* Trigger templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {triggerTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
              selectedTemplate === template.id ? "border-primary bg-primary/5" : ""
            )}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <RadioGroupItem 
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  className="mt-1"
                />
              </div>
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div
          className={cn(
            "border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
            showCustomForm ? "border-primary bg-primary/5" : ""
          )}
          onClick={handleCustomTriggerToggle}
        >
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <RadioGroupItem 
                value="custom"
                checked={showCustomForm}
                className="mt-1"
              />
            </div>
            <div>
              <h4 className="font-medium">Custom Reminder</h4>
              <p className="text-sm text-muted-foreground">Create a custom outreach reminder</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom trigger form */}
      {(showCustomForm || selectedTemplate) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedTemplate ? "Template Details" : "Custom Reminder"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="trigger-name">Reminder Name</Label>
                <Input
                  id="trigger-name"
                  value={customTrigger.name}
                  onChange={(e) => setCustomTrigger({ ...customTrigger, name: e.target.value })}
                  placeholder="e.g., Follow-up Meeting"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="trigger-description">Description</Label>
                <Textarea
                  id="trigger-description"
                  value={customTrigger.description}
                  onChange={(e) => setCustomTrigger({ ...customTrigger, description: e.target.value })}
                  placeholder="Add details about this reminder"
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Reminder Type</Label>
                  <Select
                    value={customTrigger.type}
                    onValueChange={(value) => setCustomTrigger({ ...customTrigger, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Reminder Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "mt-1 w-full justify-start text-left font-normal",
                          !customTrigger.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customTrigger.date ? format(customTrigger.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customTrigger.date}
                        onSelect={(date) => setCustomTrigger({ ...customTrigger, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="trigger-time">Reminder Time</Label>
                <Input
                  id="trigger-time"
                  type="time"
                  value={customTrigger.time}
                  onChange={(e) => setCustomTrigger({ ...customTrigger, time: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={addTrigger}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Added triggers list */}
      {triggers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Scheduled Reminders</h3>
          <div className="space-y-3">
            {triggers.map((trigger) => (
              <div
                key={trigger.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-start">
                  {trigger.type === 'email' ? (
                    <Bell className="h-5 w-5 mr-3 text-blue-500" />
                  ) : trigger.type === 'notification' ? (
                    <Bell className="h-5 w-5 mr-3 text-amber-500" />
                  ) : (
                    <Clock className="h-5 w-5 mr-3 text-green-500" />
                  )}
                  <div>
                    <h4 className="font-medium">{trigger.name}</h4>
                    <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(trigger.dateTime), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTrigger(trigger.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={triggers.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
