import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

const OnboardingNew = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => step === 1 ? navigate('/ecosystem-builder') : setStep(step - 1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Build Your Network</h1>
          <p className="text-muted-foreground">
            Let's define your community DNA and create your launch plan
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((num) => (
            <React.Fragment key={num}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {num}
              </div>
              {num < 4 && <div className={`flex-1 h-1 ${step > num ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Community Vision */}
        {step === 1 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Define Your Vision</h2>
              <p className="text-sm text-muted-foreground mb-6">
                What's your community all about?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Community Name</Label>
                <Input placeholder="e.g., Tech Founders Circle" className="mt-2" />
              </div>

              <div>
                <Label>Mission Statement</Label>
                <Textarea 
                  placeholder="Describe what your community aims to achieve..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {/* Step 2: Target Audience */}
        {step === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Who Is Your Audience?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Help us understand who you're building for
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Primary Age Range</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                  <option>All ages</option>
                </select>
              </div>

              <div>
                <Label>Geographic Focus</Label>
                <Input placeholder="e.g., San Francisco Bay Area" className="mt-2" />
              </div>

              <div>
                <Label>Identity Focus (optional)</Label>
                <Input placeholder="e.g., Women in Tech, LGBTQ+ Professionals" className="mt-2" />
              </div>

              <div>
                <Label>Expected Starting Size</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>1-10 people</option>
                  <option>11-50 people</option>
                  <option>51-100 people</option>
                  <option>100+ people</option>
                </select>
              </div>
            </div>

            <Button onClick={() => setStep(3)} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {/* Step 3: Community Type & Purpose */}
        {step === 3 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Community Structure</h2>
              <p className="text-sm text-muted-foreground mb-6">
                How will your community operate?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Community Type</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>Local (in-person)</option>
                  <option>Online (virtual)</option>
                  <option>Hybrid (both)</option>
                  <option>Membership-based</option>
                  <option>Chapter-based</option>
                  <option>Event-driven</option>
                </select>
              </div>

              <div>
                <Label>Primary Purpose</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>Advocacy</option>
                  <option>Learning / Education</option>
                  <option>Lifestyle / Wellness</option>
                  <option>Business / Entrepreneurship</option>
                  <option>Social Connection</option>
                  <option>Professional Development</option>
                  <option>Creative / Artistic</option>
                </select>
              </div>
            </div>

            <Button onClick={() => setStep(4)} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {/* Step 4: Review & Launch */}
        {step === 4 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">You're All Set!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your inputs, we've created a customized roadmap for your community
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Recommended Starter Tech Stack</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ WhatsApp - For group communication</li>
                  <li>✓ Luma - For event management</li>
                  <li>✓ Notion - For knowledge base</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Your First Milestones</h3>
                <ul className="space-y-2 text-sm">
                  <li>1. Set up your communication channels</li>
                  <li>2. Create your first event</li>
                  <li>3. Build your member directory</li>
                  <li>4. Launch member management</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => navigate('/ecosystem-builder/dashboard/milestones')} className="w-full">
              Go to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </Shell>
  );
};

export default OnboardingNew;
