import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CheckCheck, ClipboardList, Copy, CopyCheck, PlusCircle, RefreshCw, User2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ProjectList } from "@/components/labr8/ProjectList";
import RequestList from "@/components/labr8/RequestList";
import { ServiceRequest } from "@/types/modul8";
import { Project } from "@/types/labr8";
import { useLabr8Requests } from "@/hooks/useLabr8Requests";
import { useLabr8Projects } from "@/hooks/useLabr8Projects";

const Labr8Dashboard = () => {
  const { currentUser, isLoading } = useUser();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<ServiceRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const {
    requests: allRequests,
    isLoading: isLoadingRequests,
    error: requestsError,
    mutate: mutateRequests,
  } = useLabr8Requests();
  const {
    projects: allProjects,
    isLoading: isLoadingProjects,
    error: projectsError,
    mutate: mutateProjects,
  } = useLabr8Projects();

  useEffect(() => {
    if (allRequests) {
      setIncomingRequests(allRequests.filter(r => r.status === 'pending' || r.status === 'negotiating'));
      setActiveRequests(allRequests.filter(r => r.status === 'agreed'));
      setCompletedRequests(allRequests.filter(r => r.status === 'completed' || r.status === 'cancelled'));
    }
  }, [allRequests]);

  useEffect(() => {
    setProjects(allProjects || []);
  }, [allProjects]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard.",
        })
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link to clipboard.",
        })
      });
  };

  const refreshData = async () => {
    await mutateRequests();
    await mutateProjects();
    toast({
      title: "Refreshing data",
      description: "Requests and projects are being reloaded..."
    });
  };

  const handleDeleteRequest = async () => {
    await mutateRequests();
    toast({
      title: "Request deleted",
      description: "The request has been removed from your inbox."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/labr8/auth" replace />;
  }

  if (currentUser.role !== 'SERVICE_PROVIDER') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <PlusCircle className="h-4 w-4" /> Create New Project
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ClipboardList className="h-4 w-4" /> View All Tasks
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" /> Manage Clients
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Share Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input type="text" value={window.location.href} readOnly />
                <Button className="w-full" onClick={handleCopyClick} disabled={copied}>
                  {copied ? (
                    <>
                      <CopyCheck className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="border p-3 rounded-md">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Incoming Requests */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Inbox</h2>
              <Button variant="outline" size="sm" onClick={refreshData} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>

            <RequestList
              title="Incoming Requests"
              requests={incomingRequests}
              type="incoming"
              loading={isLoadingRequests}
              emptyLabel="No new requests at this time."
              onDelete={handleDeleteRequest}
            />

            <RequestList
              title="Active Engagements"
              requests={activeRequests}
              type="active"
              loading={isLoadingRequests}
              emptyLabel="No active engagements at this time."
              onDelete={handleDeleteRequest}
            />

            <RequestList
              title="Completed Projects"
              requests={completedRequests}
              type="completed"
              loading={isLoadingRequests}
              emptyLabel="No completed projects to display."
              onDelete={handleDeleteRequest}
            />

            <ProjectList
              title="Current Projects"
              projects={projects}
              loading={isLoadingProjects}
              emptyLabel="No projects to display."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8Dashboard;
