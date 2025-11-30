import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loc8Dialog } from "@/components/ui/loc8-dialog";
import { Loc8DialogTrigger } from "@/components/ui/loc8-dialog-trigger";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Tag as TagIcon, Heart, CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContactCreateWizardProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ContactCreateWizard = ({ onSubmit, onCancel, isSubmitting }: ContactCreateWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({
    // Step 1: Personal Identity & Contact
    email: "",
    name: "",
    preferred_name: "",
    phone: "",
    location: "",
    // Step 2: Professional Info
    organization: "",
    role: "",
    industry: "",
    category_id: undefined,
    professional_goals: "",
    status: "active" as 'active' | 'inactive',
    how_we_met: "",
    // Step 3: Engagement & Additional
    bio: "",
    interests: [] as string[],
    tags: [] as string[],
    notes: "",
    rapport_status: "yellow" as 'red' | 'yellow' | 'green',
    preferred_channel: "",
    birthday: "",
    anniversary: "",
    anniversary_type: "",
    upcoming_event: "",
    upcoming_event_date: "",
    next_followup_date: "",
    events_attended: [] as string[]
  });

  const [tagInput, setTagInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [eventInput, setEventInput] = useState("");
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("rms_contact_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch industries from lexicon
  const { data: industries = [] } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lexicon")
        .select("*")
        .eq("term_type", "industry")
        .eq("is_active", true)
        .order("term");

      if (error) throw error;
      return data || [];
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!tagInput.trim()) return;
      const newTag = tagInput.trim();
      if (!values.tags.includes(newTag)) {
        setValues({ ...values, tags: [...values.tags, newTag] });
      }
      setTagInput("");
    }
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!interestInput.trim()) return;
      const newInterest = interestInput.trim();
      if (!values.interests.includes(newInterest)) {
        setValues({ ...values, interests: [...values.interests, newInterest] });
      }
      setInterestInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValues({ ...values, tags: values.tags.filter(tag => tag !== tagToRemove) });
  };

  const removeInterest = (interestToRemove: string) => {
    setValues({ ...values, interests: values.interests.filter(interest => interest !== interestToRemove) });
  };

  const handleEventKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!eventInput.trim()) return;
      const newEvent = eventInput.trim();
      if (!values.events_attended.includes(newEvent)) {
        setValues({ ...values, events_attended: [...values.events_attended, newEvent] });
      }
      setEventInput("");
    }
  };

  const removeEvent = (eventToRemove: string) => {
    setValues({ ...values, events_attended: values.events_attended.filter(event => event !== eventToRemove) });
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return values.email.trim() !== "" && values.name.trim() !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize data before submission
    const sanitizedValues = {
      ...values,
      // Convert empty category_id to null (important for UUID foreign key)
      category_id: values.category_id || null,
      // Convert empty optional text fields to null
      email: values.email.trim() || null,
      phone: values.phone.trim() || null,
      organization: values.organization.trim() || null,
      role: values.role.trim() || null,
      location: values.location.trim() || null,
      bio: values.bio.trim() || null,
      notes: values.notes.trim() || null,
      preferred_name: values.preferred_name.trim() || null,
      industry: values.industry || null,
      professional_goals: values.professional_goals.trim() || null,
      how_we_met: values.how_we_met.trim() || null,
      preferred_channel: values.preferred_channel || null,
      birthday: values.birthday || null,
      anniversary: values.anniversary || null,
      anniversary_type: values.anniversary_type.trim() || null,
      upcoming_event: values.upcoming_event.trim() || null,
      upcoming_event_date: values.upcoming_event_date || null,
      next_followup_date: values.next_followup_date || null,
      // Add source tracking
      source: "wizard",
      // Keep arrays and status as-is (they're already proper format)
      tags: values.tags,
      interests: values.interests,
      events_attended: values.events_attended,
      status: values.status,
      rapport_status: values.rapport_status
    };
    
    onSubmit(sanitizedValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/70 pl-2">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
                required
              />
            </div>

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
              <Label htmlFor="preferred_name" className="text-sm font-medium text-foreground/70 pl-2">Preferred Name / Nickname</Label>
              <Input
                id="preferred_name"
                name="preferred_name"
                value={values.preferred_name}
                onChange={handleChange}
                placeholder="How they like to be called"
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
                  placeholder="Select your city"
                  onClick={() => setIsLocationDialogOpen(true)}
                />
                <Loc8Dialog
                  open={isLocationDialogOpen}
                  onOpenChange={setIsLocationDialogOpen}
                  mode="single"
                  value={values.location ? [values.location] : []}
                  onValueChange={(cities) => setValues({ ...values, location: cities[0] || '' })}
                  title="Contact Location"
                  description="Select the contact's city"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-sm font-medium text-foreground/70 pl-2">Organization</Label>
              <Input
                id="organization"
                name="organization"
                value={values.organization}
                onChange={handleChange}
                placeholder="Company or organization name"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground/70 pl-2">Role / Title</Label>
              <Input
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                placeholder="e.g., CEO, Developer, Designer"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-medium text-foreground/70 pl-2">Industry</Label>
              <Select
                value={values.industry || ""}
                onValueChange={(value) => setValues({ ...values, industry: value })}
              >
                <SelectTrigger className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-sm font-medium text-foreground/70 pl-2">Category</Label>
              <Select
                value={values.category_id || ""}
                onValueChange={(value) => setValues({ ...values, category_id: value })}
              >
                <SelectTrigger className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professional_goals" className="text-sm font-medium text-foreground/70 pl-2">Professional Goals / Current Focus</Label>
              <Textarea
                id="professional_goals"
                name="professional_goals"
                value={values.professional_goals}
                onChange={handleChange}
                placeholder="What are they working on or focused on?"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg min-h-[80px] transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-foreground/70 pl-2">Status</Label>
              <Select
                value={values.status}
                onValueChange={(value: 'active' | 'inactive') => setValues({ ...values, status: value })}
              >
                <SelectTrigger className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="how_we_met" className="text-sm font-medium text-foreground/70 pl-2">How You Met</Label>
              <Input
                id="how_we_met"
                name="how_we_met"
                value={values.how_we_met}
                onChange={handleChange}
                placeholder="e.g., Tech Conference 2024, Mutual friend intro"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-foreground/70 pl-2">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                placeholder="Brief bio or notes about this contact..."
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg min-h-[100px] transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-sm font-medium text-foreground/70 pl-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests
              </Label>
              <Input
                id="interests"
                name="interests"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                placeholder="Type and press Enter to add interests"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {values.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/80 backdrop-blur-sm"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-foreground/70 pl-2 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type and press Enter to add tags"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {values.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/80 backdrop-blur-sm"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/70 pl-2">Rapport Status</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={values.rapport_status === 'red' ? 'default' : 'outline'}
                  onClick={() => setValues({ ...values, rapport_status: 'red' })}
                  className={cn(
                    "flex-1 h-12",
                    values.rapport_status === 'red' && "bg-red-500 hover:bg-red-600 text-white"
                  )}
                >
                  🔴 Cold
                </Button>
                <Button
                  type="button"
                  variant={values.rapport_status === 'yellow' ? 'default' : 'outline'}
                  onClick={() => setValues({ ...values, rapport_status: 'yellow' })}
                  className={cn(
                    "flex-1 h-12",
                    values.rapport_status === 'yellow' && "bg-yellow-500 hover:bg-yellow-600 text-white"
                  )}
                >
                  🟡 Warm
                </Button>
                <Button
                  type="button"
                  variant={values.rapport_status === 'green' ? 'default' : 'outline'}
                  onClick={() => setValues({ ...values, rapport_status: 'green' })}
                  className={cn(
                    "flex-1 h-12",
                    values.rapport_status === 'green' && "bg-green-500 hover:bg-green-600 text-white"
                  )}
                >
                  🟢 Hot
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_channel" className="text-sm font-medium text-foreground/70 pl-2">Preferred Contact Channel</Label>
              <Select
                value={values.preferred_channel}
                onValueChange={(value) => setValues({ ...values, preferred_channel: value })}
              >
                <SelectTrigger className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all">
                  <SelectValue placeholder="Select preferred channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text/SMS</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/70 pl-2">Birthday</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 bg-background/90 backdrop-blur-lg border-2 border-primary/30 hover:border-primary/60 rounded-xl shadow-lg",
                      !values.birthday && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values.birthday ? format(new Date(values.birthday), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={values.birthday ? new Date(values.birthday) : undefined}
                    onSelect={(date) => setValues({ ...values, birthday: date ? format(date, 'yyyy-MM-dd') : '' })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/70 pl-2">Anniversary</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-background/90 backdrop-blur-lg border-2 border-primary/30 hover:border-primary/60 rounded-xl shadow-lg",
                        !values.anniversary && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.anniversary ? format(new Date(values.anniversary), "PP") : "Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values.anniversary ? new Date(values.anniversary) : undefined}
                      onSelect={(date) => setValues({ ...values, anniversary: date ? format(date, 'yyyy-MM-dd') : '' })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anniversary_type" className="text-sm font-medium text-foreground/70 pl-2">Type</Label>
                <Input
                  id="anniversary_type"
                  name="anniversary_type"
                  value={values.anniversary_type}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Work"
                  className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upcoming_event" className="text-sm font-medium text-foreground/70 pl-2">Upcoming Event</Label>
                <Input
                  id="upcoming_event"
                  name="upcoming_event"
                  value={values.upcoming_event}
                  onChange={handleChange}
                  placeholder="e.g., Conference name"
                  className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/70 pl-2">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-background/90 backdrop-blur-lg border-2 border-primary/30 hover:border-primary/60 rounded-xl shadow-lg",
                        !values.upcoming_event_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.upcoming_event_date ? format(new Date(values.upcoming_event_date), "PP") : "Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={values.upcoming_event_date ? new Date(values.upcoming_event_date) : undefined}
                      onSelect={(date) => setValues({ ...values, upcoming_event_date: date ? format(date, 'yyyy-MM-dd') : '' })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/70 pl-2">Next Follow-Up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 bg-background/90 backdrop-blur-lg border-2 border-primary/30 hover:border-primary/60 rounded-xl shadow-lg",
                      !values.next_followup_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values.next_followup_date ? format(new Date(values.next_followup_date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={values.next_followup_date ? new Date(values.next_followup_date) : undefined}
                    onSelect={(date) => setValues({ ...values, next_followup_date: date ? format(date, 'yyyy-MM-dd') : '' })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="events_attended" className="text-sm font-medium text-foreground/70 pl-2">Events Attended Together</Label>
              <Input
                id="events_attended"
                name="events_attended"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                onKeyDown={handleEventKeyDown}
                placeholder="Type and press Enter to add events"
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg h-12 transition-all"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {values.events_attended.map((event, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/80 backdrop-blur-sm"
                    onClick={() => removeEvent(event)}
                  >
                    {event} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground/70 pl-2">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                placeholder="Any additional notes..."
                className="bg-background/90 backdrop-blur-lg border-2 border-primary/30 focus:border-primary/60 rounded-xl shadow-lg min-h-[80px] transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-primary/20">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="backdrop-blur-sm"
          >
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="backdrop-blur-sm bg-background/50 border-primary/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="backdrop-blur-sm shadow-lg"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="backdrop-blur-sm shadow-lg"
            >
              {isSubmitting ? (
                <>Creating Contact...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Contact
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ContactCreateWizard;
