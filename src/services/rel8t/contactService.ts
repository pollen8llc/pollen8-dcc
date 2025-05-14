
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
  created_at: string;
  tags?: string[];
  image_url?: string;
  category_id?: string;
  location?: string;
  last_contact_date?: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  groups?: {
    id: string;
    name: string;
  }[];
}

export interface ContactCategory {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  user_id: string;
}

// Get all contacts or filter by query
export async function getContacts(options?: { searchQuery?: string }): Promise<Contact[]> {
  // This is mock data
  const mockContacts = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "555-123-4567",
      organization: "TechCorp",
      role: "CTO",
      notes: "Met at the SF conference",
      created_at: "2023-06-12T00:00:00.000Z",
      tags: ["tech", "investor"],
      category_id: "cat1",
      location: "San Francisco, CA",
      last_contact_date: "2023-10-15T00:00:00.000Z",
      category: {
        id: "cat1",
        name: "Client",
        color: "#4f46e5"
      },
      groups: [
        { id: "group1", name: "VIP" }
      ]
    },
    {
      id: "2",
      name: "Jamie Smith",
      email: "jamie@example.com",
      phone: "555-987-6543",
      organization: "DesignStudio",
      role: "Designer",
      notes: "Worked together on the rebrand project",
      created_at: "2023-07-15T00:00:00.000Z",
      tags: ["design", "freelancer"],
      category_id: "cat2",
      location: "New York, NY",
      last_contact_date: "2023-11-02T00:00:00.000Z",
      category: {
        id: "cat2",
        name: "Partner",
        color: "#10b981"
      },
      groups: [
        { id: "group2", name: "Design" }
      ]
    },
    {
      id: "3",
      name: "Taylor Wilson",
      email: "taylor@example.com",
      phone: "555-567-8901",
      organization: "InnovateCo",
      role: "Product Manager",
      notes: "Introduced by Jamie",
      created_at: "2023-08-20T00:00:00.000Z",
      tags: ["product", "manager"],
      category_id: "cat3",
      location: "Austin, TX",
      last_contact_date: "2023-12-01T00:00:00.000Z",
      category: {
        id: "cat3",
        name: "Lead",
        color: "#f59e0b"
      },
      groups: [
        { id: "group1", name: "VIP" },
        { id: "group3", name: "Product" }
      ]
    }
  ];

  if (options?.searchQuery) {
    const lowerQuery = options.searchQuery.toLowerCase();
    return mockContacts.filter(contact => 
      contact.name.toLowerCase().includes(lowerQuery) || 
      contact.email.toLowerCase().includes(lowerQuery) || 
      (contact.organization && contact.organization.toLowerCase().includes(lowerQuery))
    );
  }

  return mockContacts;
}

// Get a single contact by ID
export async function getContactById(id: string): Promise<Contact | null> {
  const contacts = await getContacts();
  return contacts.find(contact => contact.id === id) || null;
}

// Add this alias for backward compatibility
export async function getContact(id: string): Promise<Contact | null> {
  return getContactById(id);
}

export async function createContact(values: Partial<Contact>): Promise<Contact> {
  // This is a mock implementation
  console.log(`Creating contact with values:`, values);
  const newContact = {
    id: `new-${Math.floor(Math.random() * 1000)}`,
    name: values.name || "New Contact",
    email: values.email || "",
    created_at: new Date().toISOString(),
    ...values
  };
  
  return newContact as Contact;
}

export async function updateContact(id: string, values: Partial<Contact>): Promise<Contact> {
  // This is a mock implementation
  console.log(`Updating contact ${id} with values:`, values);
  return { id, ...values } as Contact;
}

export async function deleteContact(id: string): Promise<boolean> {
  // This is a mock implementation
  console.log(`Deleting contact ${id}`);
  return true;
}

export async function deleteMultipleContacts(ids: string[]): Promise<boolean> {
  // This is a mock implementation
  console.log(`Deleting contacts: ${ids.join(', ')}`);
  return true;
}

// Get contact count
export async function getContactCount(): Promise<number> {
  const contacts = await getContacts();
  return contacts.length;
}

// Get contact categories
export async function getCategories(): Promise<ContactCategory[]> {
  // Mock categories
  return [
    { id: "cat1", name: "Client", color: "#4f46e5", user_id: "user1" },
    { id: "cat2", name: "Partner", color: "#10b981", user_id: "user1" },
    { id: "cat3", name: "Lead", color: "#f59e0b", user_id: "user1" },
    { id: "cat4", name: "Vendor", color: "#ef4444", user_id: "user1" }
  ];
}

// Get contact groups
export async function getContactGroups(): Promise<ContactGroup[]> {
  // Mock groups
  return [
    { id: "group1", name: "VIP", description: "Very important contacts", color: "#4f46e5", user_id: "user1" },
    { id: "group2", name: "Design", description: "Design contacts", color: "#10b981", user_id: "user1" },
    { id: "group3", name: "Product", description: "Product contacts", color: "#f59e0b", user_id: "user1" }
  ];
}

// Create a new contact group
export async function createContactGroup(values: Partial<ContactGroup>): Promise<ContactGroup> {
  // Mock implementation
  console.log(`Creating contact group with values:`, values);
  return {
    id: `group-${Math.floor(Math.random() * 1000)}`,
    name: values.name || "New Group",
    description: values.description,
    color: values.color || "#4f46e5",
    user_id: "user1"
  };
}

// Add a contact to a group
export async function addContactToGroup(contactId: string, groupId: string): Promise<boolean> {
  // Mock implementation
  console.log(`Adding contact ${contactId} to group ${groupId}`);
  return true;
}
