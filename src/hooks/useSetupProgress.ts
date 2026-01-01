import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCategories, getContactCount } from "@/services/rel8t/contactService";
import { getTriggers } from "@/services/rel8t/triggerService";

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  route: string;
  icon: string;
}

export interface SetupProgressData {
  tasks: SetupTask[];
  completedCount: number;
  totalTasks: number;
  isComplete: boolean;
  isLoading: boolean;
}

const getCategorizedContactCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("rms_contacts")
    .select("*", { count: "exact", head: true })
    .neq("status", "pending")
    .not("category_id", "is", null);
  
  if (error) throw new Error(error.message);
  return count || 0;
};

const getActv8ContactCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  
  const { count, error } = await supabase
    .from("rms_actv8_contacts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  
  if (error) {
    console.error("Error fetching actv8 count:", error);
    return 0;
  }
  return count || 0;
};

export const useSetupProgress = (): SetupProgressData => {
  const TARGET = 3;

  // Fetch all data in parallel
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["setup-categories"],
    queryFn: getCategories,
    staleTime: 1000 * 30,
  });

  const { data: contactCount = 0, isLoading: contactsLoading } = useQuery({
    queryKey: ["setup-contact-count"],
    queryFn: getContactCount,
    staleTime: 1000 * 30,
  });

  const { data: categorizedCount = 0, isLoading: categorizedLoading } = useQuery({
    queryKey: ["setup-categorized-count"],
    queryFn: getCategorizedContactCount,
    staleTime: 1000 * 30,
  });

  const { data: triggers = [], isLoading: triggersLoading } = useQuery({
    queryKey: ["setup-triggers"],
    queryFn: getTriggers,
    staleTime: 1000 * 30,
  });

  const { data: actv8Count = 0, isLoading: actv8Loading } = useQuery({
    queryKey: ["setup-actv8-count"],
    queryFn: getActv8ContactCount,
    staleTime: 1000 * 30,
  });

  const isLoading = categoriesLoading || contactsLoading || categorizedLoading || triggersLoading || actv8Loading;

  const tasks: SetupTask[] = [
    {
      id: "categories",
      title: "Create Categories",
      description: "Organize your network into meaningful groups",
      target: TARGET,
      current: Math.min(categories.length, TARGET),
      route: "/rel8/categories",
      icon: "Folder",
    },
    {
      id: "contacts",
      title: "Add Contacts",
      description: "Add people to your network",
      target: TARGET,
      current: Math.min(contactCount, TARGET),
      route: "/rel8/connect",
      icon: "UserPlus",
    },
    {
      id: "categorize",
      title: "Categorize Contacts",
      description: "Assign contacts to categories",
      target: TARGET,
      current: Math.min(categorizedCount, TARGET),
      route: "/rel8/contacts",
      icon: "Tags",
    },
    {
      id: "reminders",
      title: "Create Reminders",
      description: "Set up automated follow-up reminders",
      target: TARGET,
      current: Math.min(triggers.length, TARGET),
      route: "/rel8/triggers",
      icon: "Bell",
    },
    {
      id: "activate",
      title: "Activate Contacts",
      description: "Start building rapport with key contacts",
      target: TARGET,
      current: Math.min(actv8Count, TARGET),
      route: "/rel8/actv8",
      icon: "Zap",
    },
  ];

  const completedCount = tasks.filter((task) => task.current >= task.target).length;
  const isComplete = completedCount === tasks.length;

  return {
    tasks,
    completedCount,
    totalTasks: tasks.length,
    isComplete,
    isLoading,
  };
};
