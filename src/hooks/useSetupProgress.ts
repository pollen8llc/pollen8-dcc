import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCategories, getContactCount } from "@/services/rel8t/contactService";


export interface SetupTask {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  route: string;
  icon: string;
  steps: string[];
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

const getBuildRapportProgressCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  
  // Count Actv8 contacts on Build Rapport path who have made progress (step > 0)
  const { count, error } = await supabase
    .from("rms_actv8_contacts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("development_path_id", "build_rapport")
    .gt("current_step_index", 0);
  
  if (error) {
    console.error("Error fetching build rapport count:", error);
    return 0;
  }
  return count || 0;
};

export const useSetupProgress = (): SetupProgressData => {
  const TARGET = 1;

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


  const { data: actv8Count = 0, isLoading: actv8Loading } = useQuery({
    queryKey: ["setup-actv8-count"],
    queryFn: getActv8ContactCount,
    staleTime: 1000 * 30,
  });

  const { data: buildRapportCount = 0, isLoading: buildRapportLoading } = useQuery({
    queryKey: ["setup-build-rapport-count"],
    queryFn: getBuildRapportProgressCount,
    staleTime: 1000 * 30,
  });

  const isLoading = categoriesLoading || contactsLoading || categorizedLoading || actv8Loading || buildRapportLoading;

  const tasks: SetupTask[] = [
    {
      id: "categories",
      title: "Create a Category",
      description: "Organize your network into meaningful groups",
      target: TARGET,
      current: Math.min(categories.length, TARGET),
      route: "/rel8/categories",
      icon: "Folder",
      steps: [
        "Click \"Let's Go\" to open Categories",
        "Click the \"Add Category\" button",
        "Enter a category name (e.g., Family, Work, Friends)",
        "Choose a color and click Save",
      ],
    },
    {
      id: "contacts",
      title: "Add a Contact",
      description: "Add someone to your network",
      target: TARGET,
      current: Math.min(contactCount, TARGET),
      route: "/rel8/connect",
      icon: "UserPlus",
      steps: [
        "Click \"Let's Go\" to open Connect",
        "Click the \"+\" button to add a contact",
        "Enter their name and any details you have",
        "Click Save to add them to your network",
      ],
    },
    {
      id: "categorize",
      title: "Categorize a Contact",
      description: "Assign a contact to a category",
      target: TARGET,
      current: Math.min(categorizedCount, TARGET),
      route: "/rel8/contacts",
      icon: "Tags",
      steps: [
        "Click \"Let's Go\" to open Contacts",
        "Click on any contact to view their profile",
        "Find the Category field and select a category",
        "Your contact is now organized!",
      ],
    },
    {
      id: "activate",
      title: "Activate a Contact",
      description: "Start building a stronger relationship",
      target: TARGET,
      current: Math.min(actv8Count, TARGET),
      route: "/rel8/actv8",
      icon: "Zap",
      steps: [
        "Click \"Let's Go\" to open Actv8",
        "Find a contact you want to develop",
        "Click the \"Activate\" button on their card",
        "They're now in your active development list!",
      ],
    },
    {
      id: "build-rapport",
      title: "Build Rapport",
      description: "Make progress on a relationship path",
      target: TARGET,
      current: Math.min(buildRapportCount, TARGET),
      route: "/rel8/actv8",
      icon: "Coffee",
      steps: [
        "Click \"Let's Go\" to open Actv8",
        "Click on an activated contact",
        "Select a relationship level in the accordion",
        "Complete your first path step",
      ],
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
