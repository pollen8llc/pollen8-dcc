import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { DataNormalizer, NormalizedContact } from "@/utils/dataNormalizer";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, UserPlus, Send, Search, Link2 } from "lucide-react";
import { InviteMethodTabs } from "@/components/invites/InviteMethodTabs";
import { InviteMetricsCard } from "@/components/invites/InviteMetricsCard";
import { useInvites } from "@/hooks/useInvites";
import { Separator } from "@/components/ui/separator";

const ImportCSV = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInvalidating, setIsInvalidating] = useState(false);

  const isRel8Import = location.pathname.includes('/rel8');
  const backPath = isRel8Import ? '/rel8/contacts' : '/imports';
  const successPath = isRel8Import ? '/rel8/contacts' : '/a10d';

  const {
    invites,
    isLoading: invitesLoading,
    getInvitesByCreator,
    invalidateInvite
  } = useInvites();

  const activeInvites = invites.filter(invite => invite.is_active);

  useEffect(() => {
    if (isRel8Import) {
      getInvitesByCreator();
      
      // Auto-scroll to invite section if on /rel8/invites route
      if (location.pathname === '/rel8/invites') {
        setTimeout(() => {
          const inviteSection = document.getElementById('invite-section');
          inviteSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isRel8Import, location.pathname]);

  const handleInviteCreated = async () => {
    await getInvitesByCreator();
  };

  const handleInvalidateInvite = async (inviteId: string) => {
    setIsInvalidating(true);
    try {
      await invalidateInvite(inviteId);
      toast({
        title: "Success",
        description: "Invite link has been deactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate invite link",
        variant: "destructive",
      });
    } finally {
      setIsInvalidating(false);
    }
  };

  const handleImportComplete = async (importedContacts: NormalizedContact[]) => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const contact of importedContacts) {
        try {
          const serviceContact = DataNormalizer.transformToServiceContact(contact);
          await createContact(serviceContact);
          successCount++;
        } catch (error: any) {
          errorCount++;
          console.error('Error importing contact:', contact.name, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Contacts imported successfully",
          description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
        });
        
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        navigate(successPath);
      } else {
        toast({
          title: "Import failed",
          description: "No contacts were successfully imported.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Import process error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred during the import process.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {isRel8Import && <Rel8OnlyNavigation />}
        
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Upload className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Connect Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Connect contacts from CSV, vCard, Excel files, or other options
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/30"
            onClick={() => navigate(isRel8Import ? '/rel8/contacts/new' : '/contacts/new')}
          >
            <CardContent className="p-3 text-center">
              <UserPlus className="h-5 w-5 text-primary mx-auto mb-1" />
              <h3 className="font-medium text-xs">Create Contact</h3>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-3 text-center">
              <Upload className="h-5 w-5 text-primary mx-auto mb-1" />
              <h3 className="font-medium text-xs">Import Files</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/30"
            onClick={() => {
              const inviteSection = document.getElementById('invite-section');
              inviteSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <CardContent className="p-3 text-center">
              <Send className="h-5 w-5 text-primary mx-auto mb-1" />
              <h3 className="font-medium text-xs">Invite Contacts</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/30"
            onClick={() => navigate(isRel8Import ? '/rel8/contacts' : '/contacts')}
          >
            <CardContent className="p-3 text-center">
              <Search className="h-5 w-5 text-primary mx-auto mb-1" />
              <h3 className="font-medium text-xs">Find Contact</h3>
            </CardContent>
          </Card>
        </div>

        {isRel8Import && (
          <>
            <div id="invite-section" className="space-y-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Generate Invite Links</h2>
                <p className="text-muted-foreground">
                  Create shareable links to collect contact information
                </p>
              </div>

              <InviteMethodTabs onInviteCreated={handleInviteCreated} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Active Invite Links
                  </CardTitle>
                  <CardDescription>
                    Manage and track your active invitation links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitesLoading ? (
                    <p className="text-muted-foreground text-center py-8">Loading...</p>
                  ) : activeInvites.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No active invite links. Create one above!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {activeInvites.map((invite) => (
                        <InviteMetricsCard
                          key={invite.id}
                          invite={invite}
                          onInvalidate={handleInvalidateInvite}
                          isInvalidating={isInvalidating}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator className="my-8" />
          </>
        )}
        
        <Card className="glass-morphism border-0 backdrop-blur-md">
          <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="text-lg">File Import</CardTitle>
            <CardDescription>Choose a file to import your contacts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isProcessing ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span>Importing contacts...</span>
              </div>
            ) : (
              <ImportContactsStep 
                onNext={(data) => handleImportComplete(data.importedContacts)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportCSV;
