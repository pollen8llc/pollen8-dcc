import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider } from '@/services/modul8Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Labr8Landing = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingProfile();
  }, [session?.user?.id]);

  const checkExistingProfile = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const provider = await getUserServiceProvider(session.user.id);
      setHasProfile(!!provider);
    } catch (error) {
      console.error('Error checking service provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (!session?.user) {
      navigate('/auth');
      return;
    }

    if (hasProfile) {
      navigate('/labr8/dashboard');
    } else {
      navigate('/labr8/setup');
    }
  };

  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-[#00eada]" />,
      title: "Professional Opportunities",
      description: "Connect with organizations seeking your expertise across 8 specialized domains"
    },
    {
      icon: <Users className="h-8 w-8 text-[#00eada]" />,
      title: "Structured Negotiations",
      description: "Clear proposal system with guided negotiations and transparent terms"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-[#00eada]" />,
      title: "Streamlined Contracts",
      description: "Automated contract generation through Deel integration for secure payments"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-[#00eada]" />,
      title: "Quality Assurance",
      description: "Vetted organizations and clear project requirements ensure quality partnerships"
    }
  ];

  const providerTypes = [
    { type: "Vendors", description: "Specialized service companies and agencies" },
    { type: "Volunteers", description: "Skilled professionals offering pro-bono services" },
    { type: "Affiliates", description: "Partner organizations and consultants" },
    { type: "Service Providers", description: "Independent contractors and freelancers" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-[#00eada]">LABR8</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with event organizers seeking specialized services. 
              Join the ecosystem as a verified service provider and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold px-8"
                onClick={() => navigate('/labr8/auth')}
              >
                Join as Service Provider
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/modul8')}
              >
                Browse Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Who Can Join LABR8?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providerTypes.map((provider, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#00eada]">{provider.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{provider.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose LABR8?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-[#00eada]/10 to-blue-600/10 border-[#00eada]/20">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building Partnerships?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of service providers already connecting with organizations 
            through our structured partnership platform.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-lg px-8 py-4"
          >
            {hasProfile ? 'Access Your Dashboard' : 'Create Your Profile'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Labr8Landing;
