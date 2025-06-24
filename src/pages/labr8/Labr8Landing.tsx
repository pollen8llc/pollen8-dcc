
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  Zap, 
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock,
  Star
} from "lucide-react";

const Labr8Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Direct Client Connections",
      description: "Connect directly with organizers who need your services"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Transparent Pricing",
      description: "Set your rates and negotiate deals that work for you"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Efficient Workflow",
      description: "Streamlined project management from proposal to completion"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Build Your Reputation",
      description: "Showcase your expertise and build lasting client relationships"
    }
  ];

  const benefits = [
    "Access to high-quality service requests",
    "Integrated proposal and negotiation system",
    "Secure payment processing",
    "Project management tools",
    "Client feedback and ratings",
    "Portfolio showcase capabilities"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-10 w-10 text-black" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-[#00eada]">LAB-R8</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The premier platform for service providers to connect with organizers, 
              manage projects, and grow their business. Join the ecosystem where 
              expertise meets opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/labr8/auth')}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black px-8 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="px-8 py-3 text-lg"
              >
                Access Main Platform
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose LAB-R8?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for service providers who want to streamline 
              their client acquisition and project management processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-[#00eada]/10 flex items-center justify-center text-[#00eada] mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What You Get</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage your service business effectively
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Platform Benefits</h3>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#00eada]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-[#00eada]" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#00eada]" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#00eada] text-black flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="text-sm">Create your service provider profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#00eada] text-black flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="text-sm">Browse and respond to service requests</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#00eada] text-black flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <span className="text-sm">Negotiate and deliver your services</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/labr8/auth')}
                    className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Start Your Journey
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#00eada]/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join LAB-R8 today and start connecting with clients who need your expertise.
            </p>
            <Button 
              onClick={() => navigate('/labr8/auth')}
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black px-8 py-3 text-lg"
            >
              Join LAB-R8 Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8Landing;
