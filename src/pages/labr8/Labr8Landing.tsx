
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider } from '@/services/modul8Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { 
  Building2, 
  ArrowRight, 
  Users, 
  Briefcase, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star,
  CheckCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Labr8Landing = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkProviderStatus();
  }, [session?.user?.id]);

  const checkProviderStatus = async () => {
    if (!session?.user?.id) return;
    
    try {
      const provider = await getUserServiceProvider(session.user.id);
      setServiceProvider(provider);
    } catch (error) {
      console.error('Error checking provider status:', error);
    }
  };

  const handleGetStarted = async () => {
    if (!session?.user) {
      navigate('/labr8/auth');
      return;
    }

    setLoading(true);
    try {
      if (serviceProvider) {
        navigate('/labr8/dashboard');
      } else {
        navigate('/labr8/setup');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Briefcase,
      title: "Project Matching",
      description: "Get matched with high-quality projects that fit your expertise and availability.",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Streamlined Proposals",
      description: "Submit professional proposals with our guided workflow and templates.",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "All payments and contracts are handled securely through our integrated platform.",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Fast Communication",
      description: "Real-time messaging and notifications keep you connected with clients.",
      color: "text-orange-600"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with organizations worldwide and expand your client base.",
      color: "text-teal-600"
    },
    {
      icon: Star,
      title: "Reputation Building",
      description: "Build your professional reputation with client reviews and portfolio showcase.",
      color: "text-yellow-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Projects", icon: Briefcase },
    { number: "5K+", label: "Service Providers", icon: Users },
    { number: "98%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UX Designer",
      company: "Design Studio Pro",
      content: "POLLEN-8 Providers has transformed how I find and manage client projects. The platform is intuitive and the project quality is exceptional.",
      avatar: null,
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Full-Stack Developer",
      company: "Tech Solutions Inc",
      content: "The proposal system is brilliant. I can submit professional proposals quickly and track everything in one place. Highly recommended!",
      avatar: null,
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Marketing Consultant",
      company: "Growth Marketing Co",
      content: "Finally, a platform that understands service providers. The client matching is spot-on and payments are always on time.",
      avatar: null,
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold gradient-text">
                POLLEN-8 Providers
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with premium organizations, submit winning proposals, and grow your service business with our advanced provider platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={handleGetStarted}
                disabled={loading}
                size="lg"
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium px-8 py-4 rounded-xl text-lg min-w-[200px]"
              >
                {loading ? (
                  "Loading..."
                ) : serviceProvider ? (
                  <>
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : session?.user ? (
                  <>
                    Complete Setup <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              {!session?.user && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/labr8/auth')}
                  className="px-8 py-4 rounded-xl text-lg min-w-[200px]"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Provider Status Card */}
            {session?.user && (
              <Card className="max-w-md mx-auto glass border-[#00eada]/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={serviceProvider?.logo_url} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h3 className="font-semibold">
                        {serviceProvider?.business_name || "Welcome back!"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={serviceProvider ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {serviceProvider ? "Active Provider" : "Setup Required"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center feature-card">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-[#00eada] mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to grow your service business and connect with quality clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card h-full">
                <CardHeader>
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and start connecting with clients today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00eada] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Set up your professional profile with your services, portfolio, and expertise areas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00eada] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Projects</h3>
              <p className="text-muted-foreground">
                Browse available projects or get matched with opportunities that fit your skills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00eada] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Submit Proposals</h3>
              <p className="text-muted-foreground">
                Create compelling proposals with our guided tools and start building client relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by professionals worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our service providers have to say about their experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="feature-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00eada]/10 to-[#00eada]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful service providers who are building their businesses with POLLEN-8 Providers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleGetStarted}
              disabled={loading}
              size="lg"
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium px-8 py-4 rounded-xl text-lg min-w-[200px]"
            >
              {loading ? "Loading..." : "Get Started Today"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No setup fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#00eada] flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-black" />
                </div>
                <span className="font-bold text-lg">POLLEN-8</span>
              </div>
              <p className="text-muted-foreground">
                Connecting service providers with quality opportunities worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">For Providers</a></li>
                <li><a href="#" className="hover:text-foreground">For Organizations</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@pollen8.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 POLLEN-8 Providers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Labr8Landing;
