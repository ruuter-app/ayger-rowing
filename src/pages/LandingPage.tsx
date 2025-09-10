import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Shield, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCarousel } from '@/components/ProductCarousel';
import { ScrollNavigation } from '@/components/ScrollNavigation';
import { VideoSlideshow } from '@/components/VideoSlideshow';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroSlideshow } from '@/components/HeroSlideshow';

export function LandingPage() {
  const sections = ['hero', 'videos', 'products', 'about', 'blog', 'contact'];

  // Initialize theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark theme
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <ScrollNavigation sections={sections} />
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={`${import.meta.env.BASE_URL}images/ayger/logo.png?v=1`} 
                alt="Ayger Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#videos" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Videos</a>
              <a href="#products" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Products</a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
              <a href="#blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Slideshow */}
      <section className="relative min-h-screen overflow-hidden">
        <HeroSlideshow />
      </section>

      {/* Video Section */}
      <section id="videos" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-8 scroll-snap-section bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
          {/* Video Slideshow */}
          <div className="w-full flex justify-center">
            <VideoSlideshow />
          </div>

          {/* Buttons under video */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-ayger-navy hover:bg-ayger-navy/90 text-white"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-ayger-navy text-ayger-navy hover:bg-ayger-navy hover:text-white"
              onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Videos
            </Button>
          </div>
        </div>
      </section>

      {/* Products Carousel */}
      <section id="products" className="min-h-screen flex items-center justify-center px-6 bg-gray-100 dark:bg-gray-800 scroll-snap-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Products</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional Products, Innovative Technologies.
            </p>
          </div>

          <ProductCarousel />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden scroll-snap-section">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/ayger/rowing-lifestyle-2.jpg?v=1`} 
            alt="Competitive Rowing" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">About Ayger</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Kürek sporunda en iyiye ulaşmak için en kaliteli ekipmanlara ihtiyacınız var. 
              Ayger olarak, dünya çapında en iyi kürek ekipmanlarını sizlere sunuyoruz. 
              Karbon fiber küreklerden yarış teknelerine, dayanıklı aksesuar ve yedek parçalara 
              kadar her şeyi en yüksek standartlarda üretiyor ve temin ediyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="min-h-screen flex items-center justify-center px-6 bg-gray-800 scroll-snap-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-300">Stay updated with the latest in rowing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">
                  February 28, 2025
                </Badge>
                <CardTitle className="text-ayger-navy">Kürek Sporuna Yeni Başlayanlar İçin Ekipman Rehberi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Kürek sporu, hem fiziksel hem de zihinsel dayanıklılık gerektiren, teknik bilgi...
                </p>
                <Button variant="link" className="p-0 text-ayger-navy hover:text-ayger-navy/80">
                  Continue reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">
                  February 28, 2025
                </Badge>
                <CardTitle className="text-ayger-navy">Profesyonel Kürekçiler İçin En İyi Antrenman Teknikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Kürek sporunda başarılı olmak sadece su üzerinde antrenman yapmakla sınırlı değildir...
                </p>
                <Button variant="link" className="p-0 text-ayger-navy hover:text-ayger-navy/80">
                  Continue reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">
                  February 28, 2025
                </Badge>
                <CardTitle className="text-ayger-navy">Karbon Fiber Küreklerin Avantajları ve Kullanım Rehberi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Karbon fiber kürekler, profesyonel ve yarı-şampiyona seviyesindeki kürekçiler tarafından...
                </p>
                <Button variant="link" className="p-0 text-ayger-navy hover:text-ayger-navy/80">
                  Continue reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 to-blue-900 scroll-snap-section">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Contact Us</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-ayger-navy mb-2">Location</h3>
                  <p className="text-gray-600">
                    Krefelder Str. 4 D-53909 Zülpich<br />
                    Germany
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ayger-navy mb-2">Hours</h3>
                  <p className="text-gray-600">Monday-Friday 8:00-17:00</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ayger-navy mb-2">Contact</h3>
                  <p className="text-gray-600">
                    +49 2252 8380180<br />
                    ayger.rowing@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-ayger-navy mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayger-navy focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="E-Mail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayger-navy focus:border-transparent"
                />
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayger-navy focus:border-transparent">
                  <option>I have some technical questions</option>
                  <option>I like to know, if i can try?</option>
                  <option>What about the prices</option>
                  <option>I just want to find some friends</option>
                  <option>Others</option>
                </select>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayger-navy focus:border-transparent"
                ></textarea>
                <Button className="w-full bg-ayger-navy hover:bg-ayger-navy/90">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ayger-navy text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={`${import.meta.env.BASE_URL}images/ayger/logo.png?v=1`} 
                  alt="Ayger Logo" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
                <span className="text-xl font-bold">2025</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SpeedAir</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">SpeedAir Pro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SpeedAir Coastal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">RowBill</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">RowBill Lite</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RowBill Speed</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">X</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
