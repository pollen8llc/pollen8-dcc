
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  getCategories, 
  ContactCategory
} from "@/services/rel8t/contactService";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin,
  Building,
  Heart,
  Clock,
  Cake,
  Calendar,
  Target,
  Users
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Loc8Dialog } from "@/components/ui/loc8-dialog";
import { Loc8DialogTrigger } from "@/components/ui/loc8-dialog-trigger";

interface ContactFormProps {
  initialValues?: {
    name: string;
    email?: string;
    phone?: string;
    organization?: string;
    role?: string;
    industry?: string;
    notes?: string;
    tags?: string[];
    category_id?: string;
    location?: string;
    status?: 'active' | 'inactive';
    interests?: string[];
    bio?: string;
    last_introduction_date?: string;
    // New fields
    preferred_name?: string;
    next_followup_date?: string;
    rapport_status?: string;
    preferred_channel?: string;
    birthday?: string;
    anniversary?: string;
    anniversary_type?: string;
    upcoming_event?: string;
    upcoming_event_date?: string;
    professional_goals?: string;
    how_we_met?: string;
    events_attended?: string[];
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_VALUES = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  industry: "",
  notes: "",
  tags: [],
  category_id: "",
  location: "",
  status: "active" as 'active' | 'inactive',
  interests: [],
  bio: "",
  last_introduction_date: "",
  preferred_name: "",
  next_followup_date: "",
  rapport_status: "yellow",
  preferred_channel: "",
  birthday: "",
  anniversary: "",
  anniversary_type: "",
  upcoming_event: "",
  upcoming_event_date: "",
  professional_goals: "",
  how_we_met: "",
  events_attended: []
};

const ContactForm = ({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  onCancel,
  isSubmitting
}: ContactFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [tagsInput, setTagsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [eventsInput, setEventsInput] = useState("");
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const { data, error } = await supabase
          .from('lexicon')
          .select('term')
          .eq('term_type', 'industry')
          .eq('is_active', true)
          .eq('is_suggested', true)
          .order('term');
        
        if (error) throw error;
        setIndustries(data?.map(item => item.term) || []);
      } catch (error) {
        console.error("Error loading industries:", error);
      }
    };
    
    loadIndustries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!tagsInput.trim()) return;
      const newTag = tagsInput.trim();
      if (!values.tags?.includes(newTag)) {
        setValues({ ...values, tags: [...(values.tags || []), newTag] });
      }
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValues({
      ...values,
      tags: values.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleInterestsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!interestsInput.trim()) return;
      const newInterest = interestsInput.trim();
      if (!values.interests?.includes(newInterest)) {
        setValues({ ...values, interests: [...(values.interests || []), newInterest] });
      }
      setInterestsInput("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setValues({
      ...values,
      interests: values.interests?.filter(interest => interest !== interestToRemove) || []
    });
  };

  const handleEventsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!eventsInput.trim()) return;
      const newEvent = eventsInput.trim();
      if (!values.events_attended?.includes(newEvent)) {
        setValues({ ...values, events_attended: [...(values.events_attended || []), newEvent] });
      }
      setEventsInput("");
    }
  };

  const removeEvent = (eventToRemove: string) => {
    setValues({
      ...values,
      events_attended: values.events_attended?.filter(event => event !== eventToRemove) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize values before submission
    const sanitizedValues = {
      ...values,
      last_introduction_date: values.last_introduction_date?.trim() || null,
      next_followup_date: values.next_followup_date?.trim() || null,
      birthday: values.birthday?.trim() || null,
      anniversary: values.anniversary?.trim() || null,
      upcoming_event_date: values.upcoming_event_date?.trim() || null,
      category_id: values.category_id?.trim() || null,
      email: values.email?.trim() || null,
      phone: values.phone?.trim() || null,
      organization: values.organization?.trim() || null,
      role: values.role?.trim() || null,
      industry: values.industry?.trim() || null,
      notes: values.notes?.trim() || null,
      bio: values.bio?.trim() || null,
      location: values.location?.trim() || null,
      preferred_name: values.preferred_name?.trim() || null,
      preferred_channel: values.preferred_channel?.trim() || null,
      anniversary_type: values.anniversary_type?.trim() || null,
      upcoming_event: values.upcoming_event?.trim() || null,
      professional_goals: values.professional_goals?.trim() || null,
      how_we_met: values.how_we_met?.trim() || null,
    };
    
    onSubmit(sanitizedValues);
  };

  const handleSelectCategory = (category_id: string) => {
    setValues({
      ...values,
      category_id: category_id === "none" ? undefined : category_id
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category 1: Personal Identity & Context */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Personal Identity & Context
          </CardTitle>
          <CardDescription>Who they are and how you know them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name*</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="preferred_name" className="text-sm font-medium">Preferred Name / Pronunciation</Label>
              <Input
                id="preferred_name"
                name="preferred_name"
                value={values.preferred_name}
                onChange={handleChange}
                className="mt-1"
                placeholder="How they like to be addressed"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium">Bio / Short Description</Label>
            <Textarea
              id="bio"
              name="bio"
              value={values.bio || ""}
              onChange={handleChange}
              rows={4}
              className="mt-1 resize-none"
              placeholder="A short description about this contact..."
            />
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              City / Location
            </Label>
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
              onValueChange={(cities) => setValues({ ...values, location: cities[0] || '' })}
              title="Select Contact Location"
              description="Choose the city where this contact is based"
            />
          </div>

          <div>
            <Label htmlFor="interests" className="text-sm font-medium">Hobbies / Interests</Label>
            <Input
              id="interests"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              onKeyDown={handleInterestsKeyDown}
              placeholder="Type and press Enter to add interests"
              className="mt-1"
            />
            {values.interests && values.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category 2: Engagement & Follow-Up */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Engagement & Follow-Up
          </CardTitle>
          <CardDescription>Track your relationship and communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="last_introduction_date" className="text-sm font-medium">Last Time You Spoke</Label>
              <div className="mt-1">
                <DatePicker
                  value={values.last_introduction_date ? new Date(values.last_introduction_date) : undefined}
                  onChange={(date) => setValues({ 
                    ...values, 
                    last_introduction_date: date ? date.toISOString() : '' 
                  })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="next_followup_date" className="text-sm font-medium">Next Follow-Up Date</Label>
              <div className="mt-1">
                <DatePicker
                  value={values.next_followup_date ? new Date(values.next_followup_date) : undefined}
                  onChange={(date) => setValues({ 
                    ...values, 
                    next_followup_date: date ? date.toISOString() : '' 
                  })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rapport_status" className="text-sm font-medium">Rapport Status</Label>
              <Select
                value={values.rapport_status || "yellow"}
                onValueChange={(value) => setValues({ ...values, rapport_status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select rapport status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                      Green - Strong Relationship
                    </span>
                  </SelectItem>
                  <SelectItem value="yellow">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500" />
                      Yellow - Warm / Neutral
                    </span>
                  </SelectItem>
                  <SelectItem value="red">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                      Red - Cold / Needs Attention
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferred_channel" className="text-sm font-medium">Preferred Communication Channel</Label>
              <Select
                value={values.preferred_channel || ""}
                onValueChange={(value) => setValues({ ...values, preferred_channel: value === "none" ? undefined : value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select preferred channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text / SMS</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">Contact Status</Label>
            <Select
              value={values.status || "active"}
              onValueChange={(value) => setValues({ ...values, status: value as 'active' | 'inactive' })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category 3: Relevant Dates */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Relevant Dates
          </CardTitle>
          <CardDescription>Important dates and upcoming events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthday" className="text-sm font-medium">Birthday</Label>
              <div className="mt-1">
                <DatePicker
                  value={values.birthday ? new Date(values.birthday) : undefined}
                  onChange={(date) => setValues({ 
                    ...values, 
                    birthday: date ? date.toISOString().split('T')[0] : '' 
                  })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="anniversary" className="text-sm font-medium">Anniversary</Label>
              <div className="mt-1">
                <DatePicker
                  value={values.anniversary ? new Date(values.anniversary) : undefined}
                  onChange={(date) => setValues({ 
                    ...values, 
                    anniversary: date ? date.toISOString().split('T')[0] : '' 
                  })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="anniversary_type" className="text-sm font-medium">Anniversary Type</Label>
            <Select
              value={values.anniversary_type || ""}
              onValueChange={(value) => setValues({ ...values, anniversary_type: value === "none" ? undefined : value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select anniversary type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="work">Work Anniversary</SelectItem>
                <SelectItem value="community">Community Milestone</SelectItem>
                <SelectItem value="personal">Personal Milestone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="upcoming_event" className="text-sm font-medium">Upcoming Event</Label>
              <Input
                id="upcoming_event"
                name="upcoming_event"
                value={values.upcoming_event}
                onChange={handleChange}
                className="mt-1"
                placeholder="Conference, launch, meetup, etc."
              />
            </div>

            <div>
              <Label htmlFor="upcoming_event_date" className="text-sm font-medium">Event Date</Label>
              <div className="mt-1">
                <DatePicker
                  value={values.upcoming_event_date ? new Date(values.upcoming_event_date) : undefined}
                  onChange={(date) => setValues({ 
                    ...values, 
                    upcoming_event_date: date ? date.toISOString() : '' 
                  })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category 4: Professional */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <Building className="h-5 w-5" />
            Professional
          </CardTitle>
          <CardDescription>Work details and professional goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organization" className="text-sm font-medium">Current Company</Label>
              <Input
                id="organization"
                name="organization"
                value={values.organization}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium">Role / Title</Label>
              <Input
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry" className="text-sm font-medium">Industry / Category</Label>
              <Select
                value={values.industry || ""}
                onValueChange={(value) => setValues({ ...values, industry: value === "none" ? undefined : value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">Relationship Category</Label>
              <Select
                value={values.category_id || ""}
                onValueChange={handleSelectCategory}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <span 
                          className="inline-block w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }} 
                        />
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="professional_goals" className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Professional Goals / Current Focus
            </Label>
            <Textarea
              id="professional_goals"
              name="professional_goals"
              value={values.professional_goals || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 resize-none"
              placeholder="What are they working on or trying to achieve?"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category 5: Social Graph / Community Context */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Graph / Community Context
          </CardTitle>
          <CardDescription>How you're connected and shared communities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="how_we_met" className="text-sm font-medium">How You Met / Shared Context</Label>
            <Textarea
              id="how_we_met"
              name="how_we_met"
              value={values.how_we_met || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 resize-none"
              placeholder="How did you meet? What do you have in common?"
            />
          </div>

          <div>
            <Label htmlFor="events_attended" className="text-sm font-medium">Events They Attend</Label>
            <Input
              id="events_attended"
              value={eventsInput}
              onChange={(e) => setEventsInput(e.target.value)}
              onKeyDown={handleEventsKeyDown}
              placeholder="Type and press Enter to add events"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Conferences, meetups, or recurring events they participate in
            </p>
            {values.events_attended && values.events_attended.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.events_attended.map((event, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {event}
                    <button
                      type="button"
                      onClick={() => removeEvent(event)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 border border-border/40 rounded-md p-3 mt-1 min-h-[42px]">
              {values.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs hover:text-destructive focus:outline-none ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <Input
                id="tagsInput"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagsKeyDown}
                className="flex-1 min-w-[120px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-7 p-0"
                placeholder={values.tags?.length ? "" : "Add tags (press Enter)"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="backdrop-blur-md bg-card/80 border-primary/20 shadow-lg hover:shadow-primary/10 transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Additional Notes
          </CardTitle>
          <CardDescription>Any other information about this contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={4}
              className="mt-1"
              placeholder="Add any additional notes about this contact..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Form actions */}
      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6"
        >
          {isSubmitting ? "Saving..." : "Save Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
