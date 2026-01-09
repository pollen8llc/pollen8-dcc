import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loc8Dialog } from "@/components/ui/loc8-dialog";
import { Loc8DialogTrigger } from "@/components/ui/loc8-dialog-trigger";
import { Check, Loader2 } from "lucide-react";

interface ContactCreateWizardProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ContactCreateWizard = ({ onSubmit, onCancel, isSubmitting }: ContactCreateWizardProps) => {
  const [values, setValues] = useState({
    email: "",
    name: "",
    phone: "",
    location: "",
  });

  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const canSubmit = () => {
    return values.name.trim() !== "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedValues = {
      name: values.name.trim(),
      email: values.email.trim() || null,
      phone: values.phone.trim() || null,
      location: values.location.trim() || null,
      status: "active",
    };
    
    onSubmit(sanitizedValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground/70 pl-2">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground/70 pl-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="contact@example.com"
          className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground/70 pl-2">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-foreground/70 pl-2">Location</Label>
        <div className="[&_button]:bg-background/90 [&_button]:backdrop-blur-lg [&_button]:border-2 [&_button]:border-primary/30 [&_button]:hover:border-primary/60 [&_button]:rounded-xl [&_button]:shadow-lg [&_button]:h-12 [&_button]:transition-all">
          <Loc8DialogTrigger
            value={values.location ? [values.location] : []}
            placeholder="Select location on globe"
            onClick={() => setIsLocationDialogOpen(true)}
          />
          <Loc8Dialog
            open={isLocationDialogOpen}
            onOpenChange={setIsLocationDialogOpen}
            mode="single"
            value={values.location ? [values.location] : []}
            onConfirm={(cities) => {
              setValues({ ...values, location: cities[0] || '' });
              setIsLocationDialogOpen(false);
            }}
            title="Contact Location"
            description="Select the contact's city"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-border/50">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit() || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Create Contact
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactCreateWizard;
