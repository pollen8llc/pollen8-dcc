
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OutreachStatus = "pending" | "overdue" | "completed";
export type OutreachPriority = "low" | "medium" | "high";
export type OutreachFilterTab = "today" | "upcoming" | "overdue" | "completed" | "all";

export interface OutreachStatusCounts {
  today: number;
  upcoming: number;
  overdue: number;
  completed: number;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  organization?: string;
}

export interface Outreach {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: OutreachPriority;
  status: OutreachStatus;
  due_date: string;
  created_at?: string;
  updated_at?: string;
  contacts?: Contact[];
  ics_uid?: string;
  sequence?: number;
  calendar_sync_enabled?: boolean;
  system_email?: string;
  last_calendar_update?: string;
  raw_ics?: string;
  outreach_channel?: string | null;
  channel_details?: Record<string, any> | null;
}

export const getOutreachStatusCounts = async (): Promise<OutreachStatusCounts> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all outreach items
    const { data, error } = await supabase
      .from("rms_outreach")
      .select("id, due_date, status")
      .eq("user_id", user.id);
      
    if (error) throw error;
    
    // Process and categorize the data
    const counts = (data as any)?.reduce((acc: any, item: any) => {
      const dueDate = new Date(item.due_date || item.created_at);
      
      // Today's items (due today and pending)
      if (dueDate >= today && dueDate < tomorrow && item.status === 'pending') {
        acc.today++;
      }
      // Upcoming items (due after tomorrow and pending)
      else if (dueDate >= tomorrow && item.status === 'pending') {
        acc.upcoming++;
      }
      // Overdue items (due before today and still pending)
      else if (dueDate < today && item.status === 'pending') {
        acc.overdue++;
      }
      // Completed items
      else if (item.status === 'completed') {
        acc.completed++;
      }
      
      return acc;
    }, { today: 0, upcoming: 0, overdue: 0, completed: 0 });
    
    return counts || { today: 0, upcoming: 0, overdue: 0, completed: 0 };
  } catch (error: any) {
    console.error("Error fetching outreach counts:", error);
    return { today: 0, upcoming: 0, overdue: 0, completed: 0 };
  }
};

export const getOutreachById = async (id: string): Promise<Outreach | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts(
          contact_id,
          rms_contacts(
            id,
            name,
            email,
            organization
          )
        )
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Extract contacts from the junction table
    const contacts = Array.isArray((data as any).rms_outreach_contacts) 
      ? (data as any).rms_outreach_contacts
          .map((oc: any) => oc.rms_contacts)
          .filter((c: any) => c)
      : [];
    
    const priority = ((data as any).priority || 'medium') as OutreachPriority;
    
    return {
      id: (data as any).id,
      user_id: (data as any).user_id,
      title: (data as any).title,
      description: (data as any).message || (data as any).description,
      priority: priority,
      status: (data as any).status as OutreachStatus,
      due_date: (data as any).due_date || (data as any).created_at,
      created_at: (data as any).created_at,
      updated_at: (data as any).updated_at,
      system_email: (data as any).system_email,
      calendar_sync_enabled: (data as any).calendar_sync_enabled || false,
      ics_uid: (data as any).ics_uid,
      sequence: (data as any).sequence,
      last_calendar_update: (data as any).last_calendar_update,
      raw_ics: (data as any).raw_ics,
      outreach_channel: (data as any).outreach_channel,
      channel_details: (data as any).channel_details,
      contacts
    } as Outreach;
  } catch (error: any) {
    console.error("Error fetching outreach by ID:", error);
    return null;
  }
};

export const getOutreach = async (tab: OutreachFilterTab = "all"): Promise<Outreach[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let query = supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts(
          contact_id,
          rms_contacts(
            id,
            name,
            email,
            organization
          )
        )
      `)
      .eq("user_id", user.id);
    
    // Apply filter based on tab
    switch (tab) {
      case "today":
        query = query.gte("due_date", today.toISOString())
                     .lt("due_date", tomorrow.toISOString())
                     .eq("status", "pending");
        break;
      case "upcoming":
        query = query.gte("due_date", tomorrow.toISOString())
                     .eq("status", "pending");
        break;
      case "overdue":
        query = query.lt("due_date", today.toISOString())
                     .eq("status", "pending");
        break;
      case "completed":
        query = query.eq("status", "completed");
        break;
      // "all" tab doesn't need additional filters
    }
    
    // Execute query
    const { data, error } = await query.order("due_date", { ascending: true });
    
    if (error) throw error;
    
    // Process data to format contacts  
    const formattedData = (data as any)?.map((item: any) => {
      // Extract contacts from the junction table and nested rms_contacts
      const contacts = Array.isArray(item.rms_outreach_contacts) 
        ? item.rms_outreach_contacts
            .map((oc: any) => oc.rms_contacts) // Extract the nested contact object
            .filter((c: any) => c) // Remove any null entries
        : [];
      
      // Ensure priority is correctly typed
      const priority = (item.priority || 'medium') as OutreachPriority;
      
      return {
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.message || item.description,
        priority: priority,
        status: item.status as OutreachStatus,
        due_date: item.due_date || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        system_email: item.system_email,
        calendar_sync_enabled: item.calendar_sync_enabled || false,
        ics_uid: item.ics_uid,
        sequence: item.sequence,
        last_calendar_update: item.last_calendar_update,
        raw_ics: item.raw_ics,
        outreach_channel: item.outreach_channel,
        channel_details: item.channel_details,
        contacts
      } as Outreach;
    });
    
    return formattedData || [];
  } catch (error: any) {
    console.error(`Error fetching ${tab} outreach:`, error);
    toast({
      title: `Error fetching outreach items`,
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const updateOutreachStatus = async (id: string, status: OutreachStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Status updated",
      description: `Outreach status has been changed to ${status}.`,
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error updating outreach status:`, error);
    toast({
      title: "Error updating status",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const updateOutreach = async (
  id: string,
  updates: Partial<Outreach>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({
        title: updates.title,
        description: updates.description,
        due_date: updates.due_date,
        priority: updates.priority,
        outreach_channel: updates.outreach_channel,
        channel_details: updates.channel_details,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Outreach updated",
      description: "Outreach item has been successfully updated.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error updating outreach:`, error);
    toast({
      title: "Error updating outreach",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const sendCalendarUpdate = async (
  outreachId: string,
  updateType: 'update' | 'reschedule' | 'cancel',
  userEmail: string
): Promise<boolean> => {
  try {
    console.log('Sending calendar update:', { outreachId, updateType, userEmail });
    
    const { data, error } = await supabase.functions.invoke('send-calendar-update', {
      body: {
        outreachId,
        updateType,
        userEmail
      }
    });

    if (error) {
      console.error('Error sending calendar update:', error);
      return false;
    }

    console.log('Calendar update sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send calendar update:', error);
    return false;
  }
};

export const deleteOutreach = async (id: string): Promise<boolean> => {
  try {
    // First delete associated contacts
    const { error: contactError } = await supabase
      .from("rms_outreach_contacts")
      .delete()
      .eq("outreach_id", id);
    
    if (contactError) throw contactError;
    
    // Then delete the outreach
    const { error } = await supabase
      .from("rms_outreach")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    toast({
      title: "Outreach deleted",
      description: "Outreach item has been successfully removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting outreach:`, error);
    toast({
      title: "Error deleting outreach",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const createOutreach = async (outreach: Omit<Outreach, "id" | "user_id" | "created_at" | "updated_at">, contactIds: string[]): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user's profile email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", user.id)
      .single();
    
    const userEmail = profile?.email || user.email;
    
    // Create outreach
    const { data, error } = await supabase
      .from("rms_outreach")
      .insert([{ 
        user_id: user.id,
        title: outreach.title,
        message: outreach.description || '',
        description: outreach.description || '',
        priority: outreach.priority,
        status: outreach.status,
        due_date: outreach.due_date,
        scheduled_at: outreach.due_date,
        outreach_channel: outreach.outreach_channel || null,
        channel_details: outreach.channel_details || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    const outreachId = data.id;
    
    // Generate system email and ICS UID
    const { generateOutreachSystemEmail } = await import("./systemEmailService");
    const systemEmail = generateOutreachSystemEmail(user.id, outreachId);
    const icsUid = `outreach-${outreachId}@ecosystembuilder.app`;
    
    // Generate ICS content with system email
    const { generateOutreachICS } = await import("@/utils/outreachIcsGenerator");
    const icsContent = generateOutreachICS(
      { ...data, contacts: [] } as Outreach, 
      systemEmail,
      userEmail,
      outreach.outreach_channel,
      outreach.channel_details,
      outreachId
    );
    
    // Create email notification with ICS attachment
    const { data: notificationData, error: notificationError } = await supabase
      .from("rms_email_notifications")
      .insert({
        user_id: user.id,
        subject: `Reminder set: ${outreach.title} #${outreachId.slice(0, 8)}`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00eada;">New Outreach Task Created</h2>
            <p>You have a new outreach task scheduled.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin-top: 0;">${outreach.title}</h3>
              ${outreach.description ? `<p>${outreach.description}</p>` : ''}
              <p><strong>Priority:</strong> ${outreach.priority}</p>
              <p><strong>Due Date:</strong> ${new Date(outreach.due_date).toLocaleDateString()}</p>
            </div>
            <p>The calendar invitation is attached to this email. Add it to your calendar to stay on track!</p>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">
              System Email: ${systemEmail}
            </p>
          </div>
        `,
        status: "pending",
        notification_type: "outreach_created",
        has_ics_attachment: true,
        ics_data: icsContent,
        metadata: {
          outreachId,
          systemEmail,
          userEmail
        }
      })
      .select()
      .single();
    
    if (notificationError) {
      console.error("Error creating email notification:", notificationError);
    }
    
    // Send email via edge function
    if (notificationData && userEmail) {
      try {
        const { error: sendError } = await supabase.functions.invoke("send-email", {
          body: {
            to: userEmail,
            subject: notificationData.subject,
            html: notificationData.body,
            icsAttachment: {
              content: icsContent,
              filename: `outreach-${outreachId}.ics`
            }
          }
        });
        
        // Update notification status
        if (sendError) {
          await supabase
            .from("rms_email_notifications")
            .update({ 
              status: "failed",
              error_message: sendError.message
            })
            .eq("id", notificationData.id);
        } else {
          await supabase
            .from("rms_email_notifications")
            .update({ 
              status: "sent",
              sent_at: new Date().toISOString()
            })
            .eq("id", notificationData.id);
        }
      } catch (emailError: any) {
        console.error("Error sending email:", emailError);
        await supabase
          .from("rms_email_notifications")
          .update({ 
            status: "failed",
            error_message: emailError.message
          })
          .eq("id", notificationData.id);
      }
    }
    
    // Update outreach with ICS UID, system email, and enable calendar sync
    const { error: updateError } = await supabase
      .from("rms_outreach")
      .update({
        ics_uid: icsUid,
        system_email: systemEmail,
        calendar_sync_enabled: true,
        sequence: 0,
        raw_ics: icsContent
      })
      .eq("id", outreachId);
    
    if (updateError) {
      console.error("Error setting ICS UID and system email:", updateError);
    }
    
    // Associate contacts if provided
    if (contactIds.length > 0) {
      const contactsToInsert = contactIds.map(contactId => ({
        outreach_id: outreachId,
        contact_id: contactId
      }));
      
      const { error: contactsError } = await supabase
        .from("rms_outreach_contacts")
        .insert(contactsToInsert);
      
      if (contactsError) {
        // If contact association fails, delete the outreach
        await supabase.from("rms_outreach").delete().eq("id", outreachId);
        throw contactsError;
      }
      
      // Fetch contact details to include in notification
      const { data: contactDetails } = await supabase
        .from("rms_contacts")
        .select("id, name, email")
        .in("id", contactIds);
      
      // Create cross-platform notification with contact metadata
      const contactNames = contactDetails?.map(c => c.name).join(", ") || "contacts";
      const { error: notifError } = await supabase
        .from("cross_platform_notifications")
        .insert({
          user_id: user.id,
          title: "New Outreach Task Created",
          message: `${outreach.title} - Due ${new Date(outreach.due_date).toLocaleDateString()}`,
          notification_type: "outreach_created",
          is_read: false,
          metadata: {
            outreachId: outreachId,
            contactIds: contactIds,
            contactName: contactNames,
            contactNames: contactNames,
            priority: outreach.priority,
            dueDate: outreach.due_date
          }
        });
      
      if (notifError) {
        console.error("Error creating cross-platform notification:", notifError);
      }
    }
    
    toast({
      title: "Outreach created",
      description: "Calendar invitation sent to your email.",
    });
    
    return outreachId;
  } catch (error: any) {
    console.error("Error creating outreach:", error);
    toast({
      title: "Error creating outreach",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};
