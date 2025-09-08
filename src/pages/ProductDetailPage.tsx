import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Shield, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  price: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

const products: Product[] = [
  {
    id: 'speedair-pro',
    name: 'SpeedAir Pro',
    category: 'SpeedAir',
    tagline: 'Forget Wind Resistance, Feel the Speed! 🚀💨',
    description: 'Professional racing sculls designed for maximum performance and speed. The SpeedAir Pro represents the pinnacle of rowing technology, engineered to cut through air resistance and deliver unmatched speed on the water.',
    features: [
      'Advanced aerodynamic design for minimal wind resistance',
      'Carbon fiber construction for maximum strength and lightness',
      'Professional-grade finish for competition use',
      'Optimized blade shape for maximum efficiency',
      'Ergonomic handle design for superior grip',
      'Precision-balanced for perfect stroke execution'
    ],
    specifications: {
      'Material': 'Premium Carbon Fiber',
      'Weight': '1.2 kg per oar',
      'Length': '370 cm',
      'Blade Area': '1200 cm²',
      'Handle Type': 'Ergonomic Grip',
      'Finish': 'Competition Grade'
    },
    price: '€2,499',
    badge: 'Professional',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Zap,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'speedair-coastal',
    name: 'SpeedAir Coastal',
    category: 'SpeedAir',
    tagline: 'Unbreakable Strength, Unstoppable Speed',
    description: 'Coastal racing sculls built for durability and performance in challenging conditions. The SpeedAir Coastal combines rugged construction with advanced aerodynamics for reliable performance in any environment.',
    features: [
      'Reinforced construction for coastal conditions',
      'Enhanced durability for rough water use',
      'Advanced blade design for stability',
      'Weather-resistant materials and finish',
      'Optimized for coastal racing conditions',
      'Professional performance in challenging environments'
    ],
    specifications: {
      'Material': 'Reinforced Carbon Fiber',
      'Weight': '1.4 kg per oar',
      'Length': '370 cm',
      'Blade Area': '1250 cm²',
      'Handle Type': 'Enhanced Grip',
      'Finish': 'Weather Resistant'
    },
    price: '€2,799',
    badge: 'Innovative',
    badgeColor: 'bg-green-100 text-green-800',
    icon: Shield,
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'rowbill-lite',
    name: 'RowBill Lite',
    category: 'RowBill',
    tagline: 'Simple, Reliable, Effective!',
    description: 'Essential rowing monitor for beginners and enthusiasts. The RowBill Lite provides accurate performance tracking with an intuitive interface, making it perfect for those starting their rowing journey.',
    features: [
      'Easy-to-use interface for beginners',
      'Accurate stroke rate and distance tracking',
      'Waterproof design for all conditions',
      'Long battery life for extended sessions',
      'Compact and lightweight design',
      'Affordable entry-level pricing'
    ],
    specifications: {
      'Display': 'LCD Screen',
      'Battery Life': '20 hours',
      'Waterproof Rating': 'IPX7',
      'Weight': '150g',
      'Connectivity': 'Bluetooth 4.0',
      'Compatibility': 'iOS & Android'
    },
    price: '€299',
    badge: 'Entry Level',
    badgeColor: 'bg-orange-100 text-orange-800',
    icon: Target,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'rowbill-speed',
    name: 'RowBill Speed',
    category: 'RowBill',
    tagline: 'Your Rowing, Your Data, Your Progress!',
    description: 'Advanced rowing monitor with comprehensive data analysis. The RowBill Speed provides detailed performance metrics and advanced analytics to help serious rowers optimize their training and performance.',
    features: [
      'Advanced performance analytics',
      'Real-time stroke analysis',
      'GPS tracking and route mapping',
      'Heart rate monitoring integration',
      'Customizable training programs',
      'Professional coaching insights'
    ],
    specifications: {
      'Display': 'High-Resolution Touchscreen',
      'Battery Life': '30 hours',
      'Waterproof Rating': 'IPX8',
      'Weight': '200g',
      'Connectivity': 'Bluetooth 5.0 & WiFi',
      'Sensors': 'GPS, Accelerometer, Gyroscope'
    },
    price: '€599',
    badge: 'High End',
    badgeColor: 'bg-purple-100 text-purple-800',
    icon: Star,
    gradient: 'from-purple-500 to-purple-600'
  }
];

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ayger-navy mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = product.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/ayger/logo.png" 
                alt="Ayger Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-ayger-navy text-ayger-navy hover:bg-ayger-navy hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Product Hero */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className={`mb-4 ${product.badgeColor}`}>
                {product.badge}
              </Badge>
              <h1 className="text-5xl font-bold text-ayger-navy mb-4">{product.name}</h1>
              <p className="text-2xl text-gray-600 mb-6">{product.tagline}</p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{product.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-ayger-navy hover:bg-ayger-navy/90 text-white">
                  Get Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-ayger-navy text-ayger-navy hover:bg-ayger-navy hover:text-white">
                  Contact Sales
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl flex items-center justify-center shadow-2xl p-8">
                <img 
                  src={`/images/ayger/${product.id}.jpg`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ayger-navy mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">What makes {product.name} exceptional</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ayger-navy mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-600">Detailed specifications for {product.name}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-ayger-navy">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ayger-navy mb-4">Pricing</h2>
            <p className="text-xl text-gray-600">Investment in excellence</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-ayger-navy to-blue-900 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">{product.name}</CardTitle>
                <CardDescription className="text-gray-300">{product.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold mb-6">{product.price}</div>
                <Button size="lg" className="w-full bg-white text-ayger-navy hover:bg-gray-100">
                  Request Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-gray-300 mt-4">
                  *Pricing may vary based on configuration and quantity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-ayger-navy mb-4">Related Products</h2>
            <p className="text-xl text-gray-600">Explore our complete product line</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.id !== product.id).map((relatedProduct) => {
              const RelatedIcon = relatedProduct.icon;
              return (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-br from-slate-50 to-blue-50">
                      <img 
                        src={`/images/ayger/${relatedProduct.id}.jpg`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="text-center">
                      <CardTitle className="text-ayger-navy">{relatedProduct.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {relatedProduct.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="secondary" className={`mb-4 ${relatedProduct.badgeColor}`}>
                        {relatedProduct.badge}
                      </Badge>
                      <p className="text-sm text-gray-600 mb-4">
                        {relatedProduct.description.substring(0, 100)}...
                      </p>
                      <Button className="w-full bg-ayger-navy hover:bg-ayger-navy/90">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
                  src="/images/ayger/logo.png" 
                  alt="Ayger Logo" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
                <span className="text-xl font-bold">2025</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SpeedAir</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/product/speedair-pro" className="hover:text-white transition-colors">SpeedAir Pro</Link></li>
                <li><Link to="/product/speedair-coastal" className="hover:text-white transition-colors">SpeedAir Coastal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">RowBill</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/product/rowbill-lite" className="hover:text-white transition-colors">RowBill Lite</Link></li>
                <li><Link to="/product/rowbill-speed" className="hover:text-white transition-colors">RowBill Speed</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>+49 2252 8380180</p>
                <p>ayger.rowing@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
