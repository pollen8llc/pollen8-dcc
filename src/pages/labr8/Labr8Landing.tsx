
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Badge className="bg-[#00eada]/10 text-[#00eada] border-[#00eada]/20 text-lg px-6 py-2">
              LABR8 Service Provider Portal
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00eada] to-blue-600 bg-clip-text text-transparent">
            Your Gateway to
            <br />
            Meaningful Partnerships
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with community organizers seeking your expertise. From volunteers to vendors, 
            LABR8 matches your skills with organizations that need them most.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-lg px-8 py-4"
          >
            {hasProfile ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

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
    </div>
  );
};

export default Labr8Landing;
