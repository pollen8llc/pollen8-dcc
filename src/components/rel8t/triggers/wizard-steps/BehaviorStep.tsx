
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Bell, Clock, Mail, ClipboardList } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function BehaviorStep() {
  const { handleNextStep, handlePreviousStep, triggerTypes, actionTypes } = useTriggerWizard();
  const { watch, setValue, formState: { errors } } = useFormContext();
  const selectedCondition = watch("condition");
  const selectedAction = watch("action");
  
  const onNextClick = () => {
    console.log("Next button clicked in BehaviorStep");
    handleNextStep();
  };
  
  const onPreviousClick = () => {
    console.log("Previous button clicked in BehaviorStep");
    handlePreviousStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <FormItem>
          <FormLabel className="text-base">Trigger Condition</FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            When should this trigger be activated?
          </p>
          
          <RadioGroup
            value={selectedCondition}
            onValueChange={(value) => setValue("condition", value)}
            className="space-y-3"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={triggerTypes.DAILY} id="daily" />
              <FormLabel htmlFor="daily" className="font-normal cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Daily
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={triggerTypes.WEEKLY} id="weekly" />
              <FormLabel htmlFor="weekly" className="font-normal cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Weekly
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={triggerTypes.MONTHLY} id="monthly" />
              <FormLabel htmlFor="monthly" className="font-normal cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Monthly
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={triggerTypes.QUARTERLY} id="quarterly" />
              <FormLabel htmlFor="quarterly" className="font-normal cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Quarterly
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={triggerTypes.YEARLY} id="yearly" />
              <FormLabel htmlFor="yearly" className="font-normal cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Yearly
              </FormLabel>
            </FormItem>
          </RadioGroup>
          
          {errors.condition && (
            <p className="text-sm text-destructive mt-1">{errors.condition.message as string}</p>
          )}
        </FormItem>
      </div>
      
      <div className="pt-4">
        <FormItem>
          <FormLabel className="text-base">Trigger Action</FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            What should happen when the trigger is activated?
          </p>
          
          <RadioGroup 
            value={selectedAction}
            onValueChange={(value) => setValue("action", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={actionTypes.SEND_EMAIL} id="email" className="mt-1" />
              <FormLabel htmlFor="email" className="font-normal cursor-pointer flex-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" /> 
                  <span>Send Email</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Send an email to contacts or yourself as a reminder
                </p>
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={actionTypes.CREATE_TASK} id="task" className="mt-1" />
              <FormLabel htmlFor="task" className="font-normal cursor-pointer flex-1">
                <div className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2 text-green-500" /> 
                  <span>Create Task</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a task to your task list
                </p>
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={actionTypes.ADD_REMINDER} id="reminder" className="mt-1" />
              <FormLabel htmlFor="reminder" className="font-normal cursor-pointer flex-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" /> 
                  <span>Add Reminder</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a calendar reminder for follow-up
                </p>
              </FormLabel>
            </FormItem>
            
            <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={actionTypes.SEND_NOTIFICATION} id="notification" className="mt-1" />
              <FormLabel htmlFor="notification" className="font-normal cursor-pointer flex-1">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-purple-500" /> 
                  <span>Send Notification</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Show a notification in the app
                </p>
              </FormLabel>
            </FormItem>
          </RadioGroup>
          
          {errors.action && (
            <p className="text-sm text-destructive mt-1">{errors.action.message as string}</p>
          )}
        </FormItem>
      </div>
      
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPreviousClick}>
          Previous
        </Button>
        <Button type="button" onClick={onNextClick}>Next Step</Button>
      </div>
    </div>
  );
}
