
import React, { useState } from "react";
import { useInvites } from "@/hooks/useInvites";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Copy, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Form schema for invite creation
const inviteFormSchema = z.object({
  communityId: z.string().optional(),
  maxUses: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  expirationDate: z.date().optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteGeneratorProps {
  communityId?: string;
  onInviteCreated?: () => void;
}

const InviteGenerator: React.FC<InviteGeneratorProps> = ({
  communityId,
  onInviteCreated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{
    code: string;
    link: string;
  } | null>(null);

  const { createInvite, isLoading } = useInvites();
  const { currentUser } = useUser();
  const { toast } = useToast();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      communityId: communityId || "",
      maxUses: "",
      expirationDate: undefined,
    },
  });

  const handleGenerateInvite = async (values: InviteFormValues) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create invites",
        variant: "destructive",
      });
      return;
    }

    const expirationDate = values.expirationDate
      ? values.expirationDate.toISOString()
      : undefined;

    const invite = await createInvite(
      values.communityId || undefined,
      values.maxUses,
      expirationDate
    );

    if (invite) {
      // Generate shareable link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/invite/${invite.link_id}`;

      setGeneratedInvite({
        code: invite.code,
        link,
      });

      // Call the callback if provided
      if (onInviteCreated) {
        onInviteCreated();
      }
    }
  };

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${
        type === "code" ? "Invite code" : "Invite link"
      } copied to clipboard`,
    });
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Generate Invite
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate New Invite</DialogTitle>
            <DialogDescription>
              Create a unique invite code that you can share with others.
            </DialogDescription>
          </DialogHeader>

          {!generatedInvite ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleGenerateInvite)}
                className="space-y-4"
              >
                {!communityId && currentUser?.managedCommunities && currentUser.managedCommunities.length > 0 && (
                  <FormField
                    control={form.control}
                    name="communityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="No specific community" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No specific community</SelectItem>
                            {/* Would need to load communities the user manages */}
                            {/* This is a placeholder for the actual community list */}
                            <SelectItem value="community-1">Community 1</SelectItem>
                            <SelectItem value="community-2">Community 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Uses (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>No expiration</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Invite"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-code"
                    value={generatedInvite.code}
                    readOnly
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(generatedInvite.code, "code")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-link">Invite Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-link"
                    value={generatedInvite.link}
                    readOnly
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(generatedInvite.link, "link")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    setGeneratedInvite(null);
                    setIsDialogOpen(false);
                  }}
                >
                  Done
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedInvite(null)}
                >
                  Generate Another
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteGenerator;
