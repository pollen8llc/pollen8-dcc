
import { supabase } from "@/integrations/supabase/client";
import { OutreachProps } from "@/components/rel8t/OutreachCard";
import { OutreachFilterType } from "@/components/rel8t/OutreachList";

export interface OutreachCounts {
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

export async function getOutreach(
  filter: OutreachFilterType = "today",
  limit?: number
): Promise<OutreachProps[]> {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)).toISOString();

  // Mock data
  let mockOutreach = [
    {
      id: "1",
      title: "Follow up on project proposal",
      description: "Check if they've reviewed the proposal we sent last week",
      due_date: new Date().toISOString(),
      priority: "high",
      status: "pending",
      contacts: [
        { id: "c1", name: "Alex Johnson", email: "alex@example.com", organization: "TechCorp" }
      ]
    },
    {
      id: "2",
      title: "Coffee meetup",
      description: "Casual networking coffee",
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      priority: "medium",
      status: "pending",
      contacts: [
        { id: "c2", name: "Jamie Smith", email: "jamie@example.com", organization: "DesignStudio" }
      ]
    },
    {
      id: "3",
      title: "Send conference details",
      description: "Share details about the upcoming industry conference",
      due_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      priority: "low",
      status: "pending",
      contacts: [
        { id: "c3", name: "Taylor Wilson", email: "taylor@example.com", organization: "InnovateCo" },
        { id: "c4", name: "Morgan Lee", email: "morgan@example.com", organization: "TechCorp" }
      ]
    },
    {
      id: "4",
      title: "Project kickoff meeting",
      description: "Initial discussion about the collaboration",
      due_date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      priority: "high",
      status: "completed",
      contacts: [
        { id: "c5", name: "Casey Brown", email: "casey@example.com", organization: "Solutions Inc" }
      ]
    }
  ];

  // Filter by status
  switch (filter) {
    case "today":
      mockOutreach = mockOutreach.filter(
        item =>
          item.status !== "completed" &&
          new Date(item.due_date).toDateString() === new Date().toDateString()
      );
      break;
    case "upcoming":
      mockOutreach = mockOutreach.filter(
        item =>
          item.status !== "completed" &&
          new Date(item.due_date) > new Date(endOfDay)
      );
      break;
    case "overdue":
      mockOutreach = mockOutreach.filter(
        item =>
          item.status !== "completed" &&
          new Date(item.due_date) < new Date(startOfDay)
      );
      break;
    case "completed":
      mockOutreach = mockOutreach.filter(item => item.status === "completed");
      break;
  }

  // Apply limit if provided
  if (limit && mockOutreach.length > limit) {
    mockOutreach = mockOutreach.slice(0, limit);
  }

  return mockOutreach;
}

export async function getOutreachStatusCounts(): Promise<OutreachCounts> {
  // In a real app, this would be a database query
  const today = await getOutreach("today");
  const upcoming = await getOutreach("upcoming");
  const overdue = await getOutreach("overdue");
  const completed = await getOutreach("completed");

  return {
    today: today.length,
    upcoming: upcoming.length,
    overdue: overdue.length,
    completed: completed.length
  };
}

export async function updateOutreachStatus(id: string, status: string): Promise<boolean> {
  // This is a mock implementation
  console.log(`Updating outreach ${id} status to ${status}`);
  return true;
}

export async function createOutreach(outreach: any, contactIds: string[]): Promise<any> {
  // This is a mock implementation
  console.log("Creating outreach:", outreach, "for contacts:", contactIds);
  return { id: Math.random().toString(), ...outreach };
}

export async function deleteOutreach(id: string): Promise<boolean> {
  // This is a mock implementation
  console.log(`Deleting outreach ${id}`);
  return true;
}
