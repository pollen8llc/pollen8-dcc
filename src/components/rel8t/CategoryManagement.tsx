
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Tag, MoreVertical, UserPlus, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CategoryFormValues {
  name: string;
  color: string;
}

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
      color: '#6366f1'
    }
  });

  const loadCategories = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rms_contact_categories' as any)
        .select('*')
        .eq('user_id', currentUser.id)
        .order('name');
      
      if (error) throw error;
      setCategories((data as any[]) || []);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      toast({
        title: "Failed to load categories",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [currentUser]);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('rms_contact_categories' as any)
        .insert({
          user_id: currentUser.id,
          name: values.name,
          color: values.color
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Category created",
        description: `${values.name} has been added to your categories.`
      });
      
      form.reset();
      setIsDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: "Failed to create category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (!editingCategory || !currentUser) return;
    
    try {
      const { error } = await supabase
        .from('rms_contact_categories')
        .update({
          name: values.name,
          color: values.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCategory.id)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Category updated",
        description: `${values.name} has been updated.`
      });
      
      setEditingCategory(null);
      setIsDialogOpen(false);
      form.reset();
      loadCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Failed to update category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentUser || !categoryToDelete) return;
    
    try {
      const { error } = await supabase
        .from('rms_contact_categories')
        .delete()
        .eq('id', categoryToDelete.id)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Category deleted",
        description: "The category has been removed."
      });
      
      setCategoryToDelete(null);
      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleArchiveCategory = async (category: Category) => {
    toast({
      title: "Archive coming soon",
      description: `Archive functionality for "${category.name}" will be available soon.`
    });
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    form.reset({ name: '', color: '#6366f1' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      color: category.color || '#6366f1'
    });
    setIsDialogOpen(true);
  };

  const handleAddContact = (categoryId: string) => {
    navigate(`/rel8/contacts/new?category=${categoryId}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contact Categories</CardTitle>
            <CardDescription>
              Organize your contacts with custom categories
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading categories...</div>
          ) : categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Color</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: category.color || '#6366f1' }} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddContact(category.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add Contact
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveCategory(category)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setCategoryToDelete(category)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg">No categories created yet</h3>
              <p className="text-muted-foreground mb-4">
                Categories help you organize and filter your contacts
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(editingCategory ? handleUpdateCategory : handleCreateCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-16 h-10"
                        />
                        <span className="text-sm">{field.value}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{categoryToDelete?.name}" category? 
              This will not delete contacts associated with this category, 
              but they will no longer have this category assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
