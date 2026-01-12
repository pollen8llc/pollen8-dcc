
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

export interface StructuredNotes {
  interaction_outcome?: 'positive' | 'neutral' | 'negative';
  energy_level?: 'high' | 'medium' | 'low';
  followup_booked?: 'yes' | 'no' | 'maybe';
  followup_date?: string;
  key_topics?: string[];
  action_items?: string;
  rapport_progress?: 'strengthened' | 'maintained' | 'declined';
  free_notes?: string;
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
  contacts_notified_at?: string | null;
  trigger_id?: string | null;
  notes?: string | null;
  structured_notes?: StructuredNotes | null;
  // Actv8 Build Rapport integration
  actv8_contact_id?: string | null;
  actv8_step_index?: number | null;
  // Path association - outreach is specific to a development path instance
  path_id?: string | null; // Path definition ID (legacy, kept for backwards compatibility)
  path_instance_id?: string | null; // Unique instance ID for path isolation
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
        trigger_id,
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
      contacts_notified_at: (data as any).contacts_notified_at,
      trigger_id: (data as any).trigger_id,
      notes: (data as any).notes,
      structured_notes: (data as any).structured_notes,
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
        trigger_id,
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
        contacts_notified_at: item.contacts_notified_at,
        trigger_id: item.trigger_id,
        structured_notes: item.structured_notes,
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
    // First, get the outreach to check for actv8 linkage
    const { data: outreach, error: fetchError } = await supabase
      .from("rms_outreach")
      .select("actv8_contact_id, actv8_step_index")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Update the status
    const { error } = await supabase
      .from("rms_outreach")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    
    // If completed and linked to actv8 contact, advance the step
    if (status === 'completed' && outreach?.actv8_contact_id) {
      try {
        // Import the service dynamically to avoid circular imports
        const { 
          updateContactProgress, 
          getActv8Contact, 
          updateActv8Contact,
          completeStepInstance,
          createStepInstance 
        } = await import("@/services/actv8Service");
        
        // Get full outreach data to access structured notes
        const fullOutreach = await getOutreachById(id);
        
        // Get current actv8 contact data
        const actv8Contact = await getActv8Contact(outreach.actv8_contact_id);
        if (actv8Contact) {
          const currentStepIndex = actv8Contact.current_step_index || 0;
          const completedSteps = actv8Contact.completed_steps || [];
          const currentStep = actv8Contact.path?.steps?.[currentStepIndex];
          
          // Only advance if this is the current step
          if (outreach.actv8_step_index === currentStepIndex) {
            // Use actual step ID from path, not just index
            const stepId = currentStep?.id || `step_${currentStepIndex}`;
            const newCompletedSteps = [...completedSteps, stepId];
            const newStepIndex = currentStepIndex + 1;
            
            // Complete the step instance with metrics from structured notes
            await completeStepInstance(
              outreach.actv8_contact_id,
              currentStepIndex,
              id,
              {
                interaction_outcome: fullOutreach?.structured_notes?.interaction_outcome,
                rapport_progress: fullOutreach?.structured_notes?.rapport_progress
              }
            );
            
            // Update step progress on the contact
            await updateContactProgress(outreach.actv8_contact_id, newStepIndex, newCompletedSteps);
            
            // Create the next step instance as "active" so it appears unlocked
            const nextStep = actv8Contact.path?.steps?.[newStepIndex];
            if (nextStep && actv8Contact.development_path_id) {
              try {
                await createStepInstance(
                  outreach.actv8_contact_id,
                  nextStep.id,
                  newStepIndex,
                  actv8Contact.development_path_id,
                  'active'
                );
              } catch (stepError) {
                // Step instance might already exist, ignore
                console.log("Step instance may already exist:", stepError);
              }
            }
            
            // Upgrade connection strength based on completed steps
            const strengthProgression = ['spark', 'ember', 'flame', 'star'];
            const currentStrengthIndex = strengthProgression.indexOf(actv8Contact.connection_strength || 'spark');
            const stepsCompleted = newCompletedSteps.length;
            
            // Upgrade strength every 2 completed steps
            const targetStrengthIndex = Math.min(Math.floor(stepsCompleted / 2), 3);
            if (targetStrengthIndex > currentStrengthIndex) {
              await updateActv8Contact(outreach.actv8_contact_id, {
                connection_strength: strengthProgression[targetStrengthIndex]
              });
            }
            
            // Create a notification for step completion
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase
                .from("cross_platform_notifications")
                .insert({
                  user_id: user.id,
                  title: `${actv8Contact.path?.name || 'Path'} Progress`,
                  message: `Completed step ${currentStepIndex + 1} with ${actv8Contact.contact?.name || 'contact'}`,
                  notification_type: "actv8_step_complete",
                  is_read: false,
                  metadata: {
                    actv8ContactId: outreach.actv8_contact_id,
                    stepIndex: currentStepIndex,
                    newStepIndex: newStepIndex,
                    contactName: actv8Contact.contact?.name,
                    nextStepName: nextStep?.name || null
                  }
                });
            }
          }
        }
      } catch (actv8Error) {
        console.error("Error updating actv8 progress:", actv8Error);
        // Don't fail the status update if actv8 update fails
      }
    }
    
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
  userEmail: string,
  includeContactsAsAttendees?: boolean
): Promise<boolean> => {
  try {
    console.log('Sending calendar update:', { outreachId, updateType, userEmail, includeContactsAsAttendees });
    
    const { data, error } = await supabase.functions.invoke('send-calendar-update', {
      body: {
        outreachId,
        updateType,
        userEmail,
        includeContactsAsAttendees
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

export const updateOutreachNotes = async (id: string, notes: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error updating outreach notes:", error);
    return false;
  }
};

export const updateOutreachStructuredNotes = async (id: string, structuredNotes: StructuredNotes): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_outreach")
      .update({ 
        structured_notes: structuredNotes as any, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error updating structured notes:", error);
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
    
    // Get user's profile email and name
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("user_id", user.id)
      .single();
    
    const userEmail = profile?.email || user.email;
    const userFullName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
      : 'User';
    
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
        channel_details: outreach.channel_details || null,
        trigger_id: outreach.trigger_id || null,
        // Actv8 Build Rapport linkage
        actv8_contact_id: outreach.actv8_contact_id || null,
        actv8_step_index: outreach.actv8_step_index ?? null,
        // Path association for filtering (use instance ID for proper isolation)
        path_id: outreach.path_id || null,
        path_instance_id: outreach.path_instance_id || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    const outreachId = data.id;
    
    // Fetch contact details BEFORE generating ICS to include names
    let contactDetails: { id: string; name: string; email?: string }[] = [];
    if (contactIds.length > 0) {
      const { data: fetchedContacts } = await supabase
        .from("rms_contacts")
        .select("id, name, email")
        .in("id", contactIds);
      contactDetails = fetchedContacts || [];
    }
    
    // Generate system email and ICS UID
    const { generateOutreachSystemEmail } = await import("./systemEmailService");
    const systemEmail = generateOutreachSystemEmail(user.id, outreachId);
    const icsUid = `outreach-${outreachId}@ecosystembuilder.app`;
    
    // Generate ICS content with system email and actual contact names
    const { generateOutreachICS } = await import("@/utils/outreachIcsGenerator");
    const icsContent = generateOutreachICS(
      { ...data, contacts: contactDetails } as Outreach, 
      systemEmail,
      userEmail,
      outreach.outreach_channel,
      outreach.channel_details,
      outreachId,
      userFullName
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
      
      // Use already-fetched contact details for notification (fetched earlier for ICS)
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
    
    // Sync with Actv8: Find actv8 contact via contact_id if not already set
    let actv8ContactId = outreach.actv8_contact_id;
    let actv8StepIndex = outreach.actv8_step_index;
    
    // If no actv8_contact_id but we have contactIds, try to find matching actv8 contact
    if (!actv8ContactId && contactIds.length > 0) {
      try {
      const { data: matchingActv8 } = await supabase
        .from("rms_actv8_contacts")
        .select("id, current_step_index, current_path_instance_id")
        .eq("user_id", user.id)
        .in("contact_id", contactIds)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
        
        if (matchingActv8) {
          actv8ContactId = matchingActv8.id;
          // Use the current step index if not explicitly provided
          if (actv8StepIndex === null || actv8StepIndex === undefined) {
            actv8StepIndex = matchingActv8.current_step_index ?? 0;
          }
          
          // Update the outreach with the actv8 link
          await supabase
            .from("rms_outreach")
            .update({
              actv8_contact_id: actv8ContactId,
              actv8_step_index: actv8StepIndex,
              path_instance_id: matchingActv8.current_path_instance_id,
            })
            .eq("id", outreachId);
          
          console.log("✅ Auto-linked outreach to actv8 contact:", actv8ContactId, "step:", actv8StepIndex);
        }
      } catch (lookupError) {
        console.error("Error looking up actv8 contact:", lookupError);
      }
    }
    
    // Sync with Actv8 step instance if we have an actv8 contact
    if (actv8ContactId && actv8StepIndex !== null && actv8StepIndex !== undefined) {
      try {
        const { updateStepInstance, getStepInstances, createStepInstance, getActv8Contact } = await import("@/services/actv8Service");
        
        // Get step instances to find the one matching this step index
        const stepInstances = await getStepInstances(actv8ContactId);
        const matchingInstance = stepInstances.find(si => si.step_index === actv8StepIndex);
        
        if (matchingInstance) {
          // Update the step instance with the outreach ID and set status to active
          await updateStepInstance(matchingInstance.id, {
            outreach_id: outreachId,
            status: 'active',
            started_at: new Date().toISOString()
          });
          console.log("✅ Linked outreach to step instance:", matchingInstance.id);
        } else {
          // If no step instance exists, create one
          const actv8Contact = await getActv8Contact(actv8ContactId);
          if (actv8Contact?.path?.steps?.[actv8StepIndex]) {
            const step = actv8Contact.path.steps[actv8StepIndex];
            const newInstance = await createStepInstance(
              actv8ContactId,
              step.id,
              actv8StepIndex,
              actv8Contact.development_path_id,
              'active'
            );
            // Update the new instance with the outreach ID
            if (newInstance) {
              await updateStepInstance(newInstance.id, {
                outreach_id: outreachId,
                started_at: new Date().toISOString()
              });
              console.log("✅ Created and linked new step instance:", newInstance.id);
            }
          }
        }
      } catch (syncError) {
        console.error("Error syncing with Actv8 step instance:", syncError);
        // Don't fail the outreach creation if sync fails
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

export const getOutreachesByActv8Contact = async (actv8ContactId: string, pathInstanceId?: string | null): Promise<Outreach[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // First get the current path instance from the actv8 contact record
    const { data: actv8Record } = await supabase
      .from("rms_actv8_contacts")
      .select("contact_id, development_path_id, current_path_instance_id")
      .eq("id", actv8ContactId)
      .single();
    
    // Use provided pathInstanceId or fall back to current_path_instance_id
    // This ensures we only show outreaches for the CURRENT path "run"
    const filterInstanceId = pathInstanceId !== undefined ? pathInstanceId : actv8Record?.current_path_instance_id;
    
    // Fetch outreaches that are directly linked via actv8_contact_id
    // CRITICAL: Filter by path_instance_id for proper isolation between path runs
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
      .eq("user_id", user.id)
      .eq("actv8_contact_id", actv8ContactId);
    
    // Only filter by path instance if we have one (for proper run isolation)
    if (filterInstanceId) {
      query = query.eq("path_instance_id", filterInstanceId);
    }
    
    const { data: directLinked, error: directError } = await query.order("actv8_step_index", { ascending: true });
    
    if (directError) throw directError;
    
    // NOTE: We NO LONGER include "indirect linked" outreaches from rms_outreach_contacts
    // This was causing outreaches from other paths/runs to appear in the current path view
    // If you need to see all outreaches for a contact, use the global outreach list
    
    // Process data to format contacts  
    const formattedData = (directLinked || []).map((item: any) => {
      const contacts = Array.isArray(item.rms_outreach_contacts) 
        ? item.rms_outreach_contacts
            .map((oc: any) => oc.rms_contacts)
            .filter((c: any) => c)
        : [];
      
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
        contacts_notified_at: item.contacts_notified_at,
        trigger_id: item.trigger_id,
        actv8_contact_id: item.actv8_contact_id,
        actv8_step_index: item.actv8_step_index,
        path_instance_id: item.path_instance_id,
        contacts
      } as Outreach;
    });
    
    return formattedData || [];
  } catch (error: any) {
    console.error("Error fetching outreaches by actv8 contact:", error);
    return [];
  }
};

// Get outreaches linked to a specific contact (by contact_id, not actv8_contact_id)
// This helps find "orphan" outreaches that can be linked to an Actv8 step
export const getOutreachesForContact = async (contactId: string): Promise<Outreach[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Find outreaches that are linked to this contact via rms_outreach_contacts
    // and are NOT already linked to an actv8 step (or are pending)
    const { data, error } = await supabase
      .from("rms_outreach")
      .select(`
        *,
        rms_outreach_contacts!inner(
          contact_id,
          rms_contacts(
            id,
            name,
            email,
            organization
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("rms_outreach_contacts.contact_id", contactId)
      .eq("status", "pending")
      .order("due_date", { ascending: true });
    
    if (error) throw error;
    
    // Process data to format contacts  
    const formattedData = (data as any)?.map((item: any) => {
      const contacts = Array.isArray(item.rms_outreach_contacts) 
        ? item.rms_outreach_contacts
            .map((oc: any) => oc.rms_contacts)
            .filter((c: any) => c)
        : [];
      
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
        outreach_channel: item.outreach_channel,
        actv8_contact_id: item.actv8_contact_id,
        actv8_step_index: item.actv8_step_index,
        contacts
      } as Outreach;
    });
    
    return formattedData || [];
  } catch (error: any) {
    console.error("Error fetching outreaches for contact:", error);
    return [];
  }
};


// Sync existing outreaches to their actv8 contacts based on contact_id
// This is useful for linking legacy outreaches that weren't created through the wizard
export const syncOutreachesToActv8 = async (actv8ContactId: string): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Get the contact_id from actv8 record
    const { data: actv8Record } = await supabase
      .from("rms_actv8_contacts")
      .select("contact_id, current_step_index, development_path_id")
      .eq("id", actv8ContactId)
      .single();
    
    if (!actv8Record?.contact_id) return 0;
    
    // Find unlinked outreaches for this contact
    const { data: unlinkedOutreaches } = await supabase
      .from("rms_outreach_contacts")
      .select(`
        outreach_id,
        rms_outreach!inner(
          id,
          actv8_contact_id,
          status
        )
      `)
      .eq("contact_id", actv8Record.contact_id);
    
    // Filter to outreaches not yet linked
    const toSync = (unlinkedOutreaches || []).filter(
      oc => oc.rms_outreach && !oc.rms_outreach.actv8_contact_id
    );
    
    if (toSync.length === 0) return 0;
    
    // Update each outreach to link to the actv8 contact
    let synced = 0;
    for (const item of toSync) {
      const { error } = await supabase
        .from("rms_outreach")
        .update({
          actv8_contact_id: actv8ContactId,
          actv8_step_index: actv8Record.current_step_index ?? 0
        })
        .eq("id", item.outreach_id);
      
      if (!error) synced++;
    }
    
    console.log(`✅ Synced ${synced} outreaches to actv8 contact ${actv8ContactId}`);
    return synced;
  } catch (error) {
    console.error("Error syncing outreaches to actv8:", error);
    return 0;
  }
};
