import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Outreach } from "@/services/rel8t/outreachService";
import { format } from "date-fns";

interface EditDetailsStepProps {
  outreach: Outreach;
  onNext: (data: {
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }) => void;
}

export const EditDetailsStep: React.FC<EditDetailsStepProps> = ({
  outreach,
  onNext,
}) => {
  const [title, setTitle] = useState(outreach.title);
  const [description, setDescription] = useState(outreach.description || "");
  const [dueDate, setDueDate] = useState(
    format(new Date(outreach.due_date), "yyyy-MM-dd")
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    outreach.priority
  );

  const handleNext = () => {
    onNext({ title, description, dueDate, priority });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this outreach task..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!title}>
          Next
        </Button>
      </div>
    </div>
  );
};
