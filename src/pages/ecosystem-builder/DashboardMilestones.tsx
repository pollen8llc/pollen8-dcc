import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';
import { MOCK_MILESTONES_NEW } from '@/data/ecosystemBuilderMock';

const DashboardMilestones = () => {
  const navigate = useNavigate();
  const milestones = MOCK_MILESTONES_NEW;

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progress = (completedCount / milestones.length) * 100;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Launch Journey</h1>
            <p className="text-muted-foreground">Follow these milestones to build a thriving community</p>
          </div>
          <Button onClick={() => navigate('/ecosystem-builder/platforms')} variant="outline">
            <Lightbulb className="h-4 w-4 mr-2" />
            View Tools
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">{completedCount} of {milestones.length} Milestones</p>
              <p className="text-sm text-muted-foreground">You're making great progress!</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Milestones List */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <Card 
              key={milestone.id} 
              className={`p-6 transition-all ${
                milestone.status === 'in-progress' ? 'border-2 border-primary' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {milestone.status === 'completed' ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : milestone.status === 'in-progress' ? (
                    <div className="h-8 w-8 rounded-full border-4 border-primary flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Milestone {index + 1}
                      </span>
                      {milestone.status === 'in-progress' && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  </div>

                  {/* Tools */}
                  {milestone.tools.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.tools.map((tool) => (
                          <span key={tool} className="px-3 py-1 bg-muted rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {milestone.resources.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.resources.map((resource) => (
                          <Button key={resource} variant="ghost" size="sm" className="h-auto py-1">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {resource}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {milestone.status !== 'completed' && (
                    <div className="flex gap-2 pt-2">
                      {milestone.status === 'in-progress' ? (
                        <>
                          <Button size="sm">
                            Continue
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button size="sm" variant="outline">Mark Complete</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled={milestone.status === 'pending'}>
                          Start Milestone
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Next Steps Card */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Pro Tip: Start Small</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Many successful communities start with just WhatsApp and Luma. Focus on hosting great events before investing in complex tools.
              </p>
              <Button variant="outline" size="sm">Learn More</Button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
};

export default DashboardMilestones;
