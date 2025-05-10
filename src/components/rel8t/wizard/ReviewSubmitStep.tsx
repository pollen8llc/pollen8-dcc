import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Contact } from "@/services/rel8t/contactService";
import { Check, AlertCircle, Calendar, Clock, ArrowUp, Mail, Bell } from "lucide-react";

interface ReviewSubmitStepProps {
  selectedData: {
    contacts: Contact[];
    triggers: any[];
    notes?: string;
  };
  onSubmit: (data: any) => void;
  onPrevious: () => void;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  selectedData,
  onSubmit,
  onPrevious,
}) => {
  const [additionalNotes, setAdditionalNotes] = useState(selectedData.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...selectedData,
        notes: additionalNotes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected contacts */}
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Check className="mr-2 h-5 w-5 text-green-500" />
          Selected Contacts ({selectedData.contacts.length})
        </h3>
        
        <div className="border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedData.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start gap-3 p-3 border rounded-md"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">{contact.name}</div>
                  {contact.email && (
                    <div className="text-muted-foreground">{contact.email}</div>
                  )}
                  {contact.organization && (
                    <div className="text-muted-foreground">{contact.organization}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected triggers */}
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Check className="mr-2 h-5 w-5 text-green-500" />
          Scheduled Reminders ({selectedData.triggers.length})
        </h3>
        
        <div className="border rounded-lg p-4">
          <div className="space-y-3">
            {selectedData.triggers.map((trigger) => (
              <div
                key={trigger.id}
                className="flex items-start gap-3 p-3 border rounded-md"
              >
                <div className="mt-1">
                  {trigger.type === 'email' ? (
                    <Mail className="h-5 w-5 text-blue-500" />
                  ) : trigger.type === 'notification' ? (
                    <Bell className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Calendar className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{trigger.name}</div>
                  <div className="text-sm text-muted-foreground">{trigger.description}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(trigger.dateTime), "PPP")}
                    <span className="mx-1">•</span>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(trigger.dateTime), "p")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional notes */}
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <ArrowUp className="mr-2 h-5 w-5 text-green-500" />
          Additional Notes
        </h3>
        
        <Textarea
          placeholder="Add any additional notes about this relationship plan..."
          className="min-h-[120px]"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        />
      </div>
      
      {/* Summary */}
      <div className="bg-muted/50 border rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-primary" />
          Summary
        </h3>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Building relationships with {selectedData.contacts.length} contacts</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Scheduled {selectedData.triggers.length} outreach reminders</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>First reminder scheduled for {selectedData.triggers.length > 0 && 
              format(new Date(selectedData.triggers[0].dateTime), "PPP")}</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Relationship Plan"}
        </Button>
      </div>
    </div>
  );
};
