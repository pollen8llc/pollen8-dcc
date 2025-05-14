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
}

// Get all contacts or filter by query
export async function getContacts(query?: string): Promise<Contact[]> {
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
      tags: ["tech", "investor"]
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
      tags: ["design", "freelancer"]
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
      tags: ["product", "manager"]
    }
  ];

  if (query) {
    const lowerQuery = query.toLowerCase();
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

export async function updateContact(id: string, values: any): Promise<any> {
  // This is a mock implementation
  console.log(`Updating contact ${id} with values:`, values);
  return { id, ...values };
}

export async function deleteContact(id: string): Promise<boolean> {
  // This is a mock implementation
  console.log(`Deleting contact ${id}`);
  return true;
}
