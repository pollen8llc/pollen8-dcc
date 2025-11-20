import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, Building2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCategory } from "@/services/rel8t/contactService";
import { createContact } from "@/services/rel8t/contactService";
import { createTrigger } from "@/services/rel8t/triggerService";
import { TriggerTemplateSelection, TriggerTemplateWithDate } from "@/components/rel8t/triggers/TriggerTemplateSelection";

interface SetupState {
  step: number;
  category: {
    name: string;
    description: string;
  };
  contact: {
    name: string;
    email: string;
    category_id: string;
  };
  trigger: {
    name: string;
    selectedTemplate?: TriggerTemplateWithDate;
  };
}

export function Rel8SetupWizard() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SetupState>({
    step: 1,
    category: { name: "", description: "" },
    contact: { name: "", email: "", category_id: "" },
    trigger: { name: "", selectedTemplate: undefined }
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Mark REL8 setup as complete
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('profiles')
          .update({ rel8_complete: true })
          .eq('user_id', user.user.id);
      }
      
      navigate("/rel8");
    } catch (error) {
      console.error('Error completing REL8 setup:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateState = (updates: Partial<SetupState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateCategory = (updates: Partial<SetupState['category']>) => {
    setState(prev => ({ ...prev, category: { ...prev.category, ...updates } }));
  };

  const updateContact = (updates: Partial<SetupState['contact']>) => {
    setState(prev => ({ ...prev, contact: { ...prev.contact, ...updates } }));
  };

  const updateTrigger = (updates: Partial<SetupState['trigger']>) => {
    setState(prev => ({ ...prev, trigger: { ...prev.trigger, ...updates } }));
  };

  const nextStep = () => {
    if (state.step < 4) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Create category
      const categoryResult = await createCategory({
        name: state.category.name,
        color: "#3b82f6" // Default blue color
      });

      if (!categoryResult) {
        throw new Error("Failed to create category");
      }

      // Create contact
      const contactResult = await createContact({
        name: state.contact.name,
        email: state.contact.email,
        category_id: categoryResult.id
      });

      if (!contactResult) {
        throw new Error("Failed to create contact");
      }

      // Create trigger based on template
      let executionTime: string | undefined;
      const template = state.trigger.selectedTemplate;
      
      if (template?.selectedDate) {
        const combinedDateTime = new Date(template.selectedDate);
        combinedDateTime.setHours(9, 0, 0, 0); // Default to 9 AM
        executionTime = combinedDateTime.toISOString();
      }

      const triggerResult = await createTrigger({
        name: state.trigger.name,
        description: `${template?.name || 'One-time'} trigger`,
        is_active: true,
        condition: template?.frequency || "onetime",
        action: "send_email",
        execution_time: executionTime,
        recurrence_pattern: {
          type: template?.frequency || "onetime",
          startDate: executionTime || new Date().toISOString()
        }
      });

      if (!triggerResult) {
        throw new Error("Failed to create trigger");
      }

      toast({
        title: "Setup Complete!",
        description: "Your Rel8 setup is complete. Welcome aboard!"
      });
      
      // Mark REL8 setup as complete
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('profiles')
          .update({ rel8_complete: true })
          .eq('user_id', user.user.id);
      }
      
      navigate("/rel8");
    } catch (error) {
      console.error("Setup error:", error);
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Step 1: Create Your First Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Business Contacts"
                  value={state.category.name}
                  onChange={(e) => updateCategory({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription">Description (Optional)</Label>
                <Textarea
                  id="categoryDescription"
                  placeholder="Describe this category..."
                  value={state.category.description}
                  onChange={(e) => updateCategory({ description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={nextStep}
                  disabled={!state.category.name.trim()}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 2: Add Your First Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="e.g., John Smith"
                  value={state.contact.name}
                  onChange={(e) => updateContact({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={state.contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={state.contact.category_id}
                  onValueChange={(value) => updateContact({ category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">
                      {state.category.name}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={() => {
                    updateContact({ category_id: "placeholder" });
                    nextStep();
                  }}
                  disabled={!state.contact.name.trim() || !state.contact.email.trim()}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Step 3: Set Up Your First Trigger
              </CardTitle>
              <CardDescription>
                Choose a trigger template to automate your relationship management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!state.trigger.selectedTemplate ? (
                <TriggerTemplateSelection 
                  onSelectTemplate={(template) => updateTrigger({ selectedTemplate: template })}
                  showDatePickers={true}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div>
                      <p className="font-medium">{state.trigger.selectedTemplate.name} Template Selected</p>
                      <p className="text-sm text-muted-foreground">
                        {state.trigger.selectedTemplate.selectedDate && 
                          `Start date: ${new Date(state.trigger.selectedTemplate.selectedDate).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateTrigger({ selectedTemplate: undefined })}
                    >
                      Change
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="triggerName">Trigger Name</Label>
                    <Input
                      id="triggerName"
                      placeholder="e.g., Follow up with John"
                      value={state.trigger.name}
                      onChange={(e) => updateTrigger({ name: e.target.value })}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!state.trigger.name.trim() || !state.trigger.selectedTemplate}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Step 4: Review & Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <p className="text-sm text-muted-foreground">
                    {state.category.name}
                    {state.category.description && ` - ${state.category.description}`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    {state.contact.name} ({state.contact.email})
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Trigger</h4>
                  <p className="text-sm text-muted-foreground">
                    {state.trigger.name} - {state.trigger.selectedTemplate?.name} template
                    {state.trigger.selectedTemplate?.selectedDate && 
                      ` starting ${new Date(state.trigger.selectedTemplate.selectedDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Rel8!</h1>
          <p className="text-muted-foreground">
            Let's get you set up with your first category, contact, and trigger
          </p>
        </div>

        <div className="mb-8">
          <Progress value={(state.step / 4) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {state.step} of 4
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}