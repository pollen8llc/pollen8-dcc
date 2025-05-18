
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  ArrowRight, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  ListChecks,
  Check,
  ExternalLink,
  Star
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      // If user is logged in, redirect to REL8 dashboard
      navigate("/rel8/dashboard");
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Testimonials data
  const testimonials = [
    {
      quote: "REL8 has completely transformed how I manage my professional network. The smart reminders ensure I never miss important follow-ups.",
      author: "Sarah Johnson",
      role: "Community Manager",
      company: "TechHub"
    },
    {
      quote: "The analytics insights have helped me identify patterns in my relationships I never would have noticed. Game-changer for relationship building.",
      author: "Michael Chen",
      role: "Ecosystem Lead",
      company: "Innovate Partners"
    },
    {
      quote: "I've tried many CRM tools, but REL8's focus on relationship quality rather than just quantity makes all the difference.",
      author: "Elena Rodriguez",
      role: "Network Coordinator",
      company: "Connect Alliance"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section - Full width with animated gradient */}
      <div className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#132731] z-0"></div>
        
        {/* Animated mesh grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00eada]/5 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00eada]/5 blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <header className="container mx-auto px-4 py-6 relative z-10 absolute top-0 left-0 right-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                <span className="text-[#00eada]">REL</span>8
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/documentation")}
                className="text-sm"
              >
                Documentation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="text-sm"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth?action=register")}
                className="text-sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <div className="animate-fade-in mb-6">
              <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-4 py-2 rounded-full">
                RELATIONSHIP-FIRST CRM PLATFORM
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight">
              Transform How You <br className="hidden md:inline" />
              <span className="text-[#00eada]">Build Relationships</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-xl">
              REL8 is the relationship management platform designed for community builders, connectors, and ecosystem leaders who value meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?action=register")}
                className="px-8 gap-2 shadow-lg shadow-[#00eada]/20"
              >
                Start For Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/profiles/search")}
                className="px-8"
              >
                Explore Profiles
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">JD</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">KT</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">AM</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/15 flex items-center justify-center text-xs text-[#00eada]/80">+5K</div>
              </div>
              <span>Trusted by 5,000+ community builders</span>
            </div>
          </div>
          
          {/* Hero image/illustration - Dashboard preview */}
          <div className="mt-12 md:mt-0 max-w-xl w-full animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00eada]/10 to-transparent rounded-xl blur-md"></div>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl relative z-10">
                <CardContent className="p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                    alt="REL8 Dashboard Preview" 
                    className="rounded-lg w-full h-auto object-cover"
                    style={{ maxHeight: '350px' }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor" 
              className="text-background"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Key Features Section */}
      <section className="py-20 bg-muted/10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              KEY FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Everything You Need To Manage Relationships</h2>
            <p className="text-muted-foreground">
              Our platform provides powerful tools for every aspect of relationship management, 
              helping you nurture connections that truly matter.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-[#00eada]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Contact Management</h3>
                <p className="text-muted-foreground mb-4">
                  Organize contacts with tags, notes, and reminders that help you remember key details and maintain authentic connections.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Intelligent tagging system</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Intuitive contact organization</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Custom fields and attributes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-[#00eada]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automated Follow-ups</h3>
                <p className="text-muted-foreground mb-4">
                  Never miss an important touchpoint with smart reminders and scheduling tools that keep your relationships active and engaged.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Customizable reminder schedules</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Follow-up templates</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Interaction history tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-[#00eada]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Relationship Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Gain valuable insights from your network data to understand patterns, identify key connectors, and improve engagement strategies.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Network visualization</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Engagement metrics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada]" />
                    <span>Custom reporting tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Interface Showcase Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/5 via-background to-background z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              INTUITIVE INTERFACE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Designed For Productivity</h2>
            <p className="text-muted-foreground">
              Our modern, intuitive interface makes managing relationships effortless and enjoyable.
            </p>
          </div>
          
          <div className="relative mt-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00eada]/5 to-transparent rounded-xl blur-xl"></div>
            
            <div className="relative z-10 rounded-2xl overflow-hidden border border-border/40 shadow-xl">
              <div className="bg-card/80 backdrop-blur-sm p-3 border-b border-border/40 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-muted-foreground">REL8 Dashboard</div>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="REL8 Interface" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/10 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground">
              Join thousands of community builders who have transformed their networking approach with REL8.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-border/20 bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-[#00eada]/20"
              >
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-[#00eada]" fill="#00eada" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada] mr-3">
                      {testimonial.author.split(' ').map(name => name[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">5,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">1M+</h3>
              <p className="text-muted-foreground">Relationships Tracked</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">98%</h3>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">42%</h3>
              <p className="text-muted-foreground">Network Growth</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-muted/5 z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-border/40 shadow-2xl relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00eada]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00eada]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Transform Your Network?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Join thousands of professionals who trust REL8 to manage their most valuable connections.
                  Get started for free — no credit card required.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth?action=register")}
                  className="px-8 gap-2 text-base shadow-lg shadow-[#00eada]/20"
                >
                  Start For Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/documentation")}
                  className="px-8 text-base gap-1"
                >
                  View Documentation
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-center text-sm text-muted-foreground mt-6">
                No credit card required • Free plan available • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img 
                  src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans-300x52.png" 
                  alt="Pollen8 Logo" 
                  width={100} 
                  height={30} 
                  className="mr-2" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-6 md:mb-0 justify-center">
              <Button variant="link" onClick={() => navigate("/documentation")}>Documentation</Button>
              <Button variant="link" onClick={() => navigate("/profiles/search")}>Find People</Button>
              <Button variant="link" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button variant="link" onClick={() => navigate("/rel8/dashboard")}>Dashboard</Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © Powered by pollen8 labs, 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
