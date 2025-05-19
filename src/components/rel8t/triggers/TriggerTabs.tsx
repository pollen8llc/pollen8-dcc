
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TriggersList } from "./TriggersList";
import { EmailNotificationsList } from "./EmailNotificationsList";
import { Trigger } from "@/services/rel8t/triggerService";
import { EmailNotification } from "@/services/rel8t/emailService";

interface TriggerTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredTriggers: Trigger[];
  isLoading: boolean;
  emailNotifications: EmailNotification[];
  handleEditTrigger: (trigger: Trigger) => void;
  handleDeleteTrigger: (id: string) => void;
  handleToggleActive: (id: string, isActive: boolean) => void;
  renderIcon: (action: string) => React.ReactNode;
}

export function TriggerTabs({
  activeTab,
  setActiveTab,
  filteredTriggers,
  isLoading,
  emailNotifications,
  handleEditTrigger,
  handleDeleteTrigger,
  handleToggleActive,
  renderIcon
}: TriggerTabsProps) {
  return (
    <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="active">Active Triggers</TabsTrigger>
        <TabsTrigger value="inactive">Inactive Triggers</TabsTrigger>
        <TabsTrigger value="all">All Triggers</TabsTrigger>
        <TabsTrigger value="notifications">Email Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="space-y-4">
        <TriggersList
          triggers={filteredTriggers}
          isLoading={isLoading}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTrigger}
          onToggleActive={handleToggleActive}
          renderIcon={renderIcon}
        />
      </TabsContent>
      <TabsContent value="inactive" className="space-y-4">
        <TriggersList
          triggers={filteredTriggers}
          isLoading={isLoading}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTrigger}
          onToggleActive={handleToggleActive}
          renderIcon={renderIcon}
        />
      </TabsContent>
      <TabsContent value="all" className="space-y-4">
        <TriggersList
          triggers={filteredTriggers}
          isLoading={isLoading}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTrigger}
          onToggleActive={handleToggleActive}
          renderIcon={renderIcon}
        />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <EmailNotificationsList notifications={emailNotifications} />
      </TabsContent>
    </Tabs>
  );
}
