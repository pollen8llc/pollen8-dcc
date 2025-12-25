import { 
  MockNetworkContact, 
  DevelopmentPathStep,
  getDevelopmentPath 
} from "@/data/mockNetworkData";
import { MessagingInterface, MessagingData } from "./MessagingInterface";
import { ResourceSharingInterface, ResourceData } from "./ResourceSharingInterface";
import { MeetingSchedulerInterface, MeetingData } from "./MeetingSchedulerInterface";
import { CollaborationPlannerInterface, CollaborationData } from "./CollaborationPlannerInterface";

interface StepInterfaceRouterProps {
  contact: MockNetworkContact;
  stepIndex: number;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

// Determine which interface to show based on the step's suggested action and channel
function getInterfaceType(step: DevelopmentPathStep): 'messaging' | 'resource' | 'meeting' | 'collaboration' {
  const { suggestedAction, suggestedChannel } = step;
  
  // Messaging interface for check-ins, social replies, post-event follows
  if (['soft_checkin', 'post_event', 'compliment'].includes(suggestedAction)) {
    if (['in_person', 'call'].includes(suggestedChannel)) {
      return 'meeting';
    }
    return 'messaging';
  }
  
  // Resource sharing interface
  if (suggestedAction === 'send_resource') {
    return 'resource';
  }
  
  // Meeting interface for coffee, events, calls, in-person
  if (['coffee', 'attend_event', 'invite_mixer'].includes(suggestedAction)) {
    return 'meeting';
  }
  
  // Collaboration interface for co-creation, introductions
  if (['co_create', 'introduce'].includes(suggestedAction)) {
    return 'collaboration';
  }
  
  // Default based on channel
  if (['in_person', 'call', 'invite'].includes(suggestedChannel)) {
    return 'meeting';
  }
  
  return 'messaging';
}

export function StepInterfaceRouter({ 
  contact, 
  stepIndex, 
  onComplete, 
  onCancel 
}: StepInterfaceRouterProps) {
  const path = contact.developmentPathId ? getDevelopmentPath(contact.developmentPathId) : null;
  
  if (!path || stepIndex >= path.steps.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No step found to manage.</p>
      </div>
    );
  }
  
  const step = path.steps[stepIndex];
  const interfaceType = getInterfaceType(step);
  
  switch (interfaceType) {
    case 'messaging':
      return (
        <MessagingInterface
          contact={contact}
          step={step}
          onSave={(data: MessagingData) => onComplete({ type: 'messaging', ...data })}
          onCancel={onCancel}
        />
      );
    
    case 'resource':
      return (
        <ResourceSharingInterface
          contact={contact}
          step={step}
          onSave={(data: ResourceData) => onComplete({ type: 'resource', ...data })}
          onCancel={onCancel}
        />
      );
    
    case 'meeting':
      return (
        <MeetingSchedulerInterface
          contact={contact}
          step={step}
          onSave={(data: MeetingData) => onComplete({ type: 'meeting', ...data })}
          onCancel={onCancel}
        />
      );
    
    case 'collaboration':
      return (
        <CollaborationPlannerInterface
          contact={contact}
          step={step}
          onSave={(data: CollaborationData) => onComplete({ type: 'collaboration', ...data })}
          onCancel={onCancel}
        />
      );
    
    default:
      return (
        <MessagingInterface
          contact={contact}
          step={step}
          onSave={(data: MessagingData) => onComplete({ type: 'messaging', ...data })}
          onCancel={onCancel}
        />
      );
  }
}

export { getInterfaceType };
