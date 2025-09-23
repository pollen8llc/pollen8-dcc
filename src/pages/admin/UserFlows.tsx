import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Settings, FileText, Briefcase, Contact, ArrowRight, CheckCircle, Clock, User } from "lucide-react";
const moduleFlows = [{
  id: "a10d",
  name: "A10D",
  description: "Automated Contact Discovery & Database",
  icon: Contact,
  color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  flows: [{
    title: "Contact Import Flow",
    steps: ["Navigate to A10D Dashboard", "Click 'Import Contacts'", "Select import method (CSV, Email, Phone, Website)", "Upload/Configure data source", "Map contact fields", "Review and validate contacts", "Import contacts to database"],
    entryPoints: ["/a10d", "/a10d/import"]
  }, {
    title: "Profile Management Flow",
    steps: ["Access A10D Dashboard", "View contact profiles grid", "Select individual profile", "View detailed contact information", "Edit contact details if needed", "Save changes to database"],
    entryPoints: ["/a10d", "/a10d/profile/:id"]
  }]
}, {
  id: "rel8t",
  name: "REL8T",
  description: "Relationship Management & Automation",
  icon: MessageSquare,
  color: "from-green-500/20 to-green-600/20 border-green-500/30",
  flows: [{
    title: "Contact Management Flow",
    steps: ["Access REL8T Dashboard", "Navigate to Contacts section", "Create new contact or import", "Assign categories and tags", "Set relationship priority", "Configure outreach triggers"],
    entryPoints: ["/rel8/contacts", "/rel8/contacts/create"]
  }, {
    title: "Trigger Configuration Flow",
    steps: ["Go to Triggers section", "Create new trigger", "Select trigger type (time-based, event-based)", "Configure trigger conditions", "Set up notification template", "Test and activate trigger"],
    entryPoints: ["/rel8/triggers", "/rel8/triggers/wizard"]
  }, {
    title: "Outreach Campaign Flow",
    steps: ["Access Dashboard", "Review contact segments", "Create outreach campaign", "Select target contacts", "Design email template", "Schedule and send campaign", "Track engagement metrics"],
    entryPoints: ["/rel8", "/rel8/outreach"]
  }]
}, {
  id: "modul8",
  name: "MODUL8",
  description: "Modular Service Request Management",
  icon: Briefcase,
  color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  flows: [{
    title: "Service Request Flow (Client)",
    steps: ["Access MODUL8 Dashboard", "Create new service request", "Fill request details and requirements", "Submit request to provider network", "Review incoming proposals", "Negotiate terms and scope", "Accept proposal and start project"],
    entryPoints: ["/modul8", "/modul8/request-wizard"]
  }, {
    title: "Provider Response Flow",
    steps: ["Access Provider Portal", "View available requests", "Review request details", "Submit proposal with pricing", "Engage in negotiation process", "Finalize contract terms", "Begin project execution"],
    entryPoints: ["/modul8/provider-portal"]
  }]
}, {
  id: "labr8",
  name: "LABR8",
  description: "Collaborative Project Workspace",
  icon: Users,
  color: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  flows: [{
    title: "Project Creation Flow",
    steps: ["Access LABR8 Dashboard", "Create new project", "Define project scope and timeline", "Invite team members", "Set up project workspace", "Configure project milestones", "Begin collaborative work"],
    entryPoints: ["/labr8", "/labr8/project/create"]
  }, {
    title: "Team Collaboration Flow",
    steps: ["Join project workspace", "Review project requirements", "Claim or assign tasks", "Track progress updates", "Communicate with team", "Submit deliverables", "Complete project milestones"],
    entryPoints: ["/labr8/project/:id"]
  }]
}, {
  id: "knowledge",
  name: "Knowledge Base",
  description: "Community Knowledge & Content Management",
  icon: FileText,
  color: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
  flows: [{
    title: "Content Creation Flow",
    steps: ["Access Knowledge Base", "Choose content type (Article, Poll, Question, Quote)", "Create content using editor", "Add tags and categories", "Review and preview content", "Publish to community", "Monitor engagement and feedback"],
    entryPoints: ["/knowledge", "/knowledge/create"]
  }, {
    title: "Content Discovery Flow",
    steps: ["Browse Knowledge Base", "Search by topics or tags", "Filter by content type", "Read articles and resources", "Vote and comment on content", "Save favorites", "Share with community"],
    entryPoints: ["/knowledge", "/knowledge/topics"]
  }]
}];
const UserFlows = () => {
  return <div className="space-y-8">
      {/* Header */}
      <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Flows by Module</h1>
            <p className="text-muted-foreground">Complete user journey mappings for all platform modules</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {moduleFlows.map(module => {
          const Icon = module.icon;
          return <div key={module.id} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <p className="font-medium text-sm">{module.name}</p>
                <p className="text-xs text-muted-foreground">{module.flows.length} flows</p>
              </div>;
        })}
        </div>
      </div>

      {/* Module Flows */}
      <div className="space-y-8">
        {moduleFlows.map(module => {
        const Icon = module.icon;
        return <div key={module.id} className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
              {/* Module Header */}
              <div className="flex items-center gap-4 mb-6">
                
                <div>
                  <h2 className="text-xl font-bold text-foreground">{module.name}</h2>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {module.flows.length} flows
                </Badge>
              </div>

              {/* Flows Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {module.flows.map((flow, flowIndex) => <Card key={flowIndex} className="glass-morphism border border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5 text-primary" />
                        {flow.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Entry Points */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Entry Points:</h4>
                        <div className="flex flex-wrap gap-2">
                          {flow.entryPoints.map((entry, entryIndex) => <Badge key={entryIndex} variant="outline" className="text-xs">
                              {entry}
                            </Badge>)}
                        </div>
                      </div>

                      {/* Flow Steps */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">User Journey:</h4>
                        <div className="space-y-3">
                          {flow.steps.map((step, stepIndex) => <div key={stepIndex} className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium mt-0.5">
                                {stepIndex + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-foreground">{step}</p>
                                {stepIndex < flow.steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mt-2" />}
                              </div>
                            </div>)}
                        </div>
                      </div>

                      {/* Flow Completion */}
                      <div className="pt-3 border-t border-primary/10">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Flow Complete</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>Est. {Math.floor(flow.steps.length * 1.5)}-{flow.steps.length * 2} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>;
      })}
      </div>

      {/* Flow Analytics Summary */}
      <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Flow Analytics Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{moduleFlows.length}</div>
            <div className="text-sm text-muted-foreground">Total Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {moduleFlows.reduce((acc, module) => acc + module.flows.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Flows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {moduleFlows.reduce((acc, module) => acc + module.flows.reduce((flowAcc, flow) => flowAcc + flow.steps.length, 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {moduleFlows.reduce((acc, module) => acc + module.flows.reduce((flowAcc, flow) => flowAcc + flow.entryPoints.length, 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Entry Points</div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserFlows;