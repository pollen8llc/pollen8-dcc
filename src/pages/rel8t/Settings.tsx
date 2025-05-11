
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HexColorPicker } from "react-colorful";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import {
  Folder,
  Plus,
  Save,
  Trash2,
  Edit,
  X,
  Check,
  Mail,
  Calendar,
} from "lucide-react";
import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import { supabase } from "@/integrations/supabase/client";

// Type definitions
interface ContactCategory {
  id: string;
  name: string;
  color: string;
}

const Settings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("categories");
  
  // States for category management
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#3b82f6" });
  
  // Fetch categories
  const { data: fetchedCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rms_contact_categories")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data || [];
    },
  });
  
  // Update categories state when data is fetched
  useState(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (category: { name: string, color: string }) => {
      const { data, error } = await supabase
        .from("rms_contact_categories")
        .insert([{ 
          name: category.name,
          color: category.color,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-categories"] });
      toast({
        title: "Category created",
        description: "The contact category has been created successfully.",
      });
      setIsAdding(false);
      setNewCategory({ name: "", color: "#3b82f6" });
    },
    onError: (error) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: ContactCategory) => {
      const { data, error } = await supabase
        .from("rms_contact_categories")
        .update({ name: category.name, color: category.color })
        .eq("id", category.id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-categories"] });
      toast({
        title: "Category updated",
        description: "The contact category has been updated successfully.",
      });
      setEditingId(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rms_contact_categories")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-categories"] });
      toast({
        title: "Category deleted",
        description: "The contact category has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle category actions
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Invalid category",
        description: "Please provide a name for the category.",
        variant: "destructive",
      });
      return;
    }
    
    addCategoryMutation.mutate(newCategory);
  };
  
  const handleUpdateCategory = (category: ContactCategory) => {
    updateCategoryMutation.mutate(category);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">REL8T Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your relationship settings, categories and triggers
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="categories">
              Categories
            </TabsTrigger>
            <TabsTrigger value="tags">
              Tags
            </TabsTrigger>
            <TabsTrigger value="triggers">
              Triggers
            </TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact Categories</CardTitle>
                <Button 
                  onClick={() => {
                    setIsAdding(!isAdding); 
                    setEditingId(null);
                  }}
                >
                  {isAdding ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {isAdding && (
                  <div className="mb-6 border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">New Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input 
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          placeholder="Enter category name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <div className="flex space-x-4">
                          <div 
                            className="w-10 h-10 rounded-md border" 
                            style={{ backgroundColor: newCategory.color }}
                          />
                          <div className="flex-1">
                            <HexColorPicker 
                              color={newCategory.color}
                              onChange={(color) => setNewCategory({...newCategory, color})}
                              style={{ width: '100%', height: '120px' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleAddCategory}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Category
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {loadingCategories ? (
                    <div className="text-center py-4">Loading categories...</div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <Folder className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-2 text-lg font-semibold">No categories yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Create categories to organize your contacts
                      </p>
                      {!isAdding && (
                        <Button onClick={() => setIsAdding(true)} className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                      )}
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="flex items-center justify-between border p-4 rounded-lg"
                      >
                        {editingId === category.id ? (
                          <div className="flex-1 flex items-center gap-4">
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <Input 
                              value={category.name}
                              onChange={(e) => {
                                const updatedCategories = categories.map(c => 
                                  c.id === category.id ? {...c, name: e.target.value} : c
                                );
                                setCategories(updatedCategories);
                              }}
                              className="max-w-[200px]"
                            />
                            <div>
                              <HexColorPicker 
                                color={category.color}
                                onChange={(color) => {
                                  const updatedCategories = categories.map(c => 
                                    c.id === category.id ? {...c, color} : c
                                  );
                                  setCategories(updatedCategories);
                                }}
                                style={{ width: '150px', height: '100px' }}
                              />
                            </div>
                            <div className="flex ml-auto">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleUpdateCategory(category)}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-6 h-6 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingId(category.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tags Tab */}
          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>Contact Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tags help you organize your contacts based on interests, skills, or any other attribute.
                </p>
                
                <div className="mt-4">
                  {/* Tags management UI would go here */}
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <Mail className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-2 text-lg font-semibold">Tag Management Coming Soon</h3>
                    <p className="text-muted-foreground mt-1">
                      This feature is under development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Triggers Tab */}
          <TabsContent value="triggers">
            <TriggerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
