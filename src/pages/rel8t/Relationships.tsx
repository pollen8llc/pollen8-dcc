
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { OutreachCard } from "@/components/rel8t/OutreachCard";
import Navbar from "@/components/Navbar";
import { getOutreach, getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OutreachForm from "@/components/rel8t/OutreachForm";
import { createOutreach } from "@/services/rel8t/outreachService";
import { useDebounce } from "@/hooks/useDebounce";

const Relationships = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [outreachDialogOpen, setOutreachDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);

  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 }, isLoading: countLoading } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });

  // Get outreach data based on active tab
  const { data: outreach = [], isLoading: outreachLoading } = useQuery({
    queryKey: ["outreach", activeTab],
    queryFn: () => getOutreach(activeTab),
  });

  const handleCreateOutreach = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createOutreach(
        {
          title: values.title,
          description: values.description,
          priority: values.priority,
          due_date: values.due_date.toISOString(),
        },
        values.contactIds
      );
      setOutreachDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter outreach based on search term
  const filteredOutreach = debouncedSearch 
    ? outreach.filter(item => 
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (item.description?.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        item.contacts?.some(contact => 
          contact.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      )
    : outreach;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Relationship Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your professional relationships
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setOutreachDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Build a Relationship
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search relationships..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-9 rounded-md border border-input bg-background px-4 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Priority Levels</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Tabs and Outreach listing */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="today" className="relative">
              Today
              {outreachCounts.today > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                  {outreachCounts.today}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {outreachCounts.upcoming > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-600 text-[10px] text-white px-1">
                  {outreachCounts.upcoming}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="relative">
              Needs Attention
              {outreachCounts.overdue > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-600 text-[10px] text-white px-1">
                  {outreachCounts.overdue}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
            </TabsTrigger>
          </TabsList>
          
          {["today", "upcoming", "overdue", "completed"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {outreachLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredOutreach.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <h3 className="mt-2 font-semibold">
                    {debouncedSearch
                      ? "No matching relationships found"
                      : `No ${tab === "completed" ? "completed" : tab === "upcoming" ? "upcoming" : tab === "overdue" ? "overdue" : "today's"} relationships`
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {debouncedSearch
                      ? "Try adjusting your search term"
                      : `You don't have any ${tab} relationship outreach.`
                    }
                  </p>
                  {!debouncedSearch && (
                    <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Build a Relationship
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {debouncedSearch && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      Found {filteredOutreach.length} results matching "{debouncedSearch}"
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-4">
                    {filteredOutreach.map((item) => (
                      <OutreachCard key={item.id} outreach={item} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Dialog */}
        <Dialog open={outreachDialogOpen} onOpenChange={setOutreachDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Build a Relationship</DialogTitle>
            </DialogHeader>
            <OutreachForm
              onSubmit={handleCreateOutreach}
              onCancel={() => setOutreachDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Relationships;
