import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Rocket, Users, Zap, TrendingUp, Target } from 'lucide-react';

const EcosystemBuilderLanding = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold">Ecosystem Builder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your community operating system. Build, optimize, and scale your network with AI-powered insights and recommendations.
          </p>
        </div>

        {/* Two Entry Paths */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Existing Network Path */}
          <Card className="p-8 hover:shadow-lg transition-all border-2 hover:border-primary cursor-pointer group"
                onClick={() => navigate('/ecosystem-builder/onboarding/existing')}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">I Already Have a Network</h2>
                  <p className="text-muted-foreground">Optimize & Grow</p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Import existing community data and map your tech stack</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Get analytics on growth, retention, and engagement</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Receive optimization suggestions and benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Access ECO8, REL8, Modul8, and Labr8 modules</span>
                </li>
              </ul>

              <Button className="w-full" size="lg">
                Optimize My Network
              </Button>
            </div>
          </Card>

          {/* New Network Path */}
          <Card className="p-8 hover:shadow-lg transition-all border-2 hover:border-primary cursor-pointer group"
                onClick={() => navigate('/ecosystem-builder/onboarding/new')}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">I Want to Build a Network</h2>
                  <p className="text-muted-foreground">Start & Launch</p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Guided onboarding to define your community DNA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Get a suggested starter tech stack tailored to your needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Follow milestone playbooks to launch your first event</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Gamified progress toward a full-fledged ecosystem</span>
                </li>
              </ul>

              <Button className="w-full" size="lg">
                Build From Scratch
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Ecosystem Profile</h3>
            <p className="text-sm text-muted-foreground">
              Capture your community DNA: demographics, purpose, type, and tech stack
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Platform Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered suggestions across 12 platform categories tailored to your needs
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Milestones Engine</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step playbooks connecting modules and tools to real-world goals
            </p>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default EcosystemBuilderLanding;
