
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TriggersList } from "./TriggersList";
import { Trigger } from "@/services/rel8t/triggerService";

interface TriggerTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredTriggers: Trigger[];
  isLoading: boolean;
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
    </Tabs>
  );
}
