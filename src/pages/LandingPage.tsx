
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  BarChart3, 
  Check,
  Star,
  ExternalLink,
  Search,
  MessageSquare,
  Database,
  Settings,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import { Shell } from "@/components/layout/Shell";

// Testimonial data
const testimonials = [
  {
    quote: "The Dot Connector Collective has completely transformed how I manage my professional network. The smart reminders ensure I never miss important follow-ups.",
    author: "Sarah Johnson",
    role: "Community Manager",
    company: "TechHub"
  },
  {
    quote: "REL8's analytics insights have helped me identify patterns in my relationships I never would have noticed. Game-changer for relationship building.",
    author: "Michael Chen",
    role: "Ecosystem Lead",
    company: "Innovate Partners"
  },
  {
    quote: "I've tried many CRM tools, but the Dot Connector platform's focus on relationship quality rather than just quantity makes all the difference.",
    author: "Elena Rodriguez",
    role: "Network Coordinator",
    company: "Connect Alliance"
  }
];

// Feature data
const features = [
  {
    icon: Users,
    title: "Smart Contact Management",
    description: "Organize contacts with tags, notes, and reminders that help you remember key details and maintain authentic connections.",
    points: [
      "Intelligent tagging system", 
      "Intuitive contact organization", 
      "Custom fields and attributes"
    ]
  },
  {
    icon: Calendar,
    title: "Automated Follow-ups",
    description: "Never miss an important touchpoint with smart reminders and scheduling tools that keep your relationships active and engaged.",
    points: [
      "Customizable reminder schedules", 
      "Follow-up templates", 
      "Interaction history tracking"
    ]
  },
  {
    icon: BarChart3,
    title: "Relationship Analytics",
    description: "Gain valuable insights from your network data to understand patterns, identify key connectors, and improve engagement strategies.",
    points: [
      "Network visualization", 
      "Engagement metrics", 
      "Custom reporting tools"
    ]
  },
  {
    icon: MessageSquare,
    title: "Community Engagement",
    description: "Build stronger communities through data-driven insights and relationship-focused engagement strategies.",
    points: [
      "Community health monitoring", 
      "Engagement optimization", 
      "Member satisfaction tracking"
    ]
  },
  {
    icon: Database,
    title: "Centralized Data Hub",
    description: "Keep all your relationship data in one secure, accessible place with powerful search and filtering capabilities.",
    points: [
      "Unified contact database", 
      "Cross-platform integrations", 
      "Advanced search functionality"
    ]
  },
  {
    icon: Settings,
    title: "Customizable Workflows",
    description: "Tailor the platform to your specific needs with flexible workflows, custom fields, and personalized automation rules.",
    points: [
      "Custom workflow builder", 
      "Automation triggers", 
      "Personalized dashboards"
    ]
  },
];

// Platform modules data
const platformModules = [
  {
    name: "CORE",
    description: "Community organizer research and education knowledgebase powered by insights from the dot connector collective.",
    color: "from-[#00eada]/20 to-[#00eada]/5"
  },
  {
    name: "ECO8",
    description: "A constantly growing directory of community organizers and dot connectors.",
    color: "from-[#00eada]/30 to-[#00eada]/10"
  },
  {
    name: "REL8",
    description: "Relationship management module for community organizers and dot connectors.",
    color: "from-[#00eada]/40 to-[#00eada]/15"
  },
  {
    name: "GNR8",
    description: "A Community data report dashboard - (coming soon).",
    color: "from-[#00eada]/30 to-[#00eada]/5"
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-[#00eada]">DOT</span> CONNECTOR
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4">
              <a href="#features" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#platform" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Platform</a>
              <a href="#testimonials" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Testimonials</a>
              <a href="#cta" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Get Started</a>
            </nav>
            
            <ThemeToggle />
            
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="border-[#00eada]/40 text-[#00eada]"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
            
            <Button 
              asChild 
              size="sm"
            >
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button 
              asChild 
              size="sm"
              variant="outline"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-16">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#132731] z-0"></div>
        
        {/* Animated mesh grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00eada]/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00eada]/5 blur-[150px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between py-12 md:py-20 gap-10">
          <div className="max-w-2xl">
            <div className="animate-fade-in mb-6">
              <span className="bg-[#00eada]/10 text-[#00eada] text-xs font-semibold px-4 py-2 rounded-full">
                THE RELATIONSHIP PLATFORM FOR COMMUNITY BUILDERS
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              Connecting <span className="text-[#00eada]">Communities</span>, Building <span className="text-[#00eada]">Relationships</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-xl">
              The Dot Connector Collective is a living directory of community organizers with powerful relationship management tools designed for meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
              <Button 
                asChild
                size="lg" 
                className="px-8 gap-2 shadow-lg shadow-[#00eada]/20 w-full sm:w-auto"
              >
                <Link to="/auth">
                  Join The Collective
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="px-8 w-full sm:w-auto"
              >
                <Link to="/communities">
                  Explore Directory
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">JD</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">KT</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs text-[#00eada]">AM</div>
                <div className="w-8 h-8 rounded-full bg-[#00eada]/15 flex items-center justify-center text-xs text-[#00eada]/80">+2K</div>
              </div>
              <span>Trusted by 2,000+ community builders</span>
            </div>
          </div>
          
          {/* Hero image - Dashboard preview */}
          <div className="w-full md:w-[45%] animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00eada]/10 to-transparent rounded-xl blur-md"></div>
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl card-hover-effect">
                <CardContent className="p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                    alt="Dot Connector Dashboard Preview" 
                    className="rounded-lg w-full h-auto object-cover"
                    style={{ maxHeight: '380px' }}
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
      </section>
      
      {/* Platform Modules Section */}
      <section id="platform" className="py-24 relative z-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              PLATFORM MODULES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">A Complete Ecosystem for Community Builders</h2>
            <p className="text-muted-foreground">
              Our integrated modules work together to provide a complete toolset for community organizers and dot connectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformModules.map((module, index) => (
              <Card 
                key={index} 
                className="border-border/30 bg-card/80 backdrop-blur-sm hover:border-[#00eada]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${module.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
                  <p className="text-muted-foreground">{module.description}</p>
                  
                  {module.name === "REL8" && (
                    <Button 
                      asChild
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 gap-1 hover:bg-[#00eada]/10 hover:text-[#00eada]"
                    >
                      <Link to="/rel8/dashboard">
                        Learn more
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 relative z-20 bg-background">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#00eada]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-[#00eada] flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Interface Showcase Section */}
      <section className="py-24 relative bg-muted/5">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Powerful Relationship Dashboard</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00eada]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#00eada]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Visual Analytics</h4>
                    <p className="text-muted-foreground">Track your network growth and engagement with intuitive visualizations</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00eada]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#00eada]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Smart Reminders</h4>
                    <p className="text-muted-foreground">Never miss important follow-ups with AI-powered reminder suggestions</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00eada]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#00eada]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Customizable Workspace</h4>
                    <p className="text-muted-foreground">Personalize your dashboard to focus on what matters most to you</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Button 
                  asChild
                  variant="outline"
                  className="gap-2 border-[#00eada]/30 text-[#00eada] hover:bg-[#00eada]/10"
                >
                  <Link to="/documentation">
                    View Documentation
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
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
                  style={{ maxHeight: '350px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/5 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground">
              Join thousands of community builders who have transformed their networking approach with the Dot Connector Collective.
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">2,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">500K+</h3>
              <p className="text-muted-foreground">Relationships Tracked</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">96%</h3>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">38%</h3>
              <p className="text-muted-foreground">Network Growth</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="cta" className="py-28 relative bg-muted/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-border/40 shadow-2xl relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00eada]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00eada]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Join the Collective?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Become part of a growing network of community organizers and dot connectors who are building meaningful relationships every day.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="px-8 gap-2 text-base shadow-lg shadow-[#00eada]/20"
                >
                  <Link to="/auth?action=register">
                    Join Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="px-8 text-base gap-1"
                >
                  <Link to="/documentation">
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">DOT Connector</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Building stronger communities through meaningful relationships.
              </p>
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
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/rel8/dashboard" className="text-muted-foreground hover:text-foreground text-sm">REL8</Link></li>
                <li><Link to="/communities" className="text-muted-foreground hover:text-foreground text-sm">ECO8</Link></li>
                <li><Link to="/documentation" className="text-muted-foreground hover:text-foreground text-sm">Documentation</Link></li>
                <li><Link to="/profiles/search" className="text-muted-foreground hover:text-foreground text-sm">Search Profiles</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">LinkedIn</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Discord</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/20">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © Powered by pollen8 labs, 2024. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button 
                asChild
                variant="outline" 
                size="sm"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
