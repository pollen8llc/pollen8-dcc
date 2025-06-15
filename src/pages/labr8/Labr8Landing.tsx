
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  Handshake, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Labr8Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">LAB-R8</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-white hover:text-[#00eada]"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => navigate('/labr8/auth')}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connect. Collaborate. <span className="text-[#00eada]">Create.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            LAB-R8 bridges the gap between organizers and service providers, 
            creating seamless partnerships for extraordinary projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/labr8/auth')}
              size="lg"
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black px-8"
            >
              Join as Service Provider
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/modul8')}
              variant="outline"
              size="lg"
              className="border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10 px-8"
            >
              Find Service Providers
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose LAB-R8?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#00eada]/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#00eada]" />
                </div>
                <CardTitle className="text-white">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our intelligent system connects you with the right partners based on expertise, 
                  location, and project requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#00eada]/20 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-[#00eada]" />
                </div>
                <CardTitle className="text-white">Seamless Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Built-in tools for project management, communication, and milestone tracking 
                  keep everyone aligned and productive.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#00eada]/20 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-[#00eada]" />
                </div>
                <CardTitle className="text-white">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Vetted professionals, transparent reviews, and secure payment processing 
                  ensure quality outcomes for every project.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Set up your service provider profile with your expertise and portfolio"
              },
              {
                step: "2", 
                title: "Receive Requests",
                description: "Get matched with relevant project requests from organizers"
              },
              {
                step: "3",
                title: "Collaborate",
                description: "Negotiate terms, scope, and timeline through our platform"
              },
              {
                step: "4",
                title: "Deliver",
                description: "Complete the project with built-in tools and get paid securely"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="h-12 w-12 rounded-full bg-[#00eada] text-black font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of service providers who have found their perfect project matches through LAB-R8.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/labr8/auth')}
              size="lg"
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black px-8"
            >
              Join LAB-R8 Today
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-4 w-4 text-black" />
              </div>
              <span className="text-white font-semibold">LAB-R8</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 LAB-R8. Part of the MODUL8 ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Labr8Landing;
