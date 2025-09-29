import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getProductBySlug, formatPriceEur, ProductRecord } from '@/lib/products';
import { PayPalButton } from '@/components/payments/PayPalButton';
import { QuoteModal } from '@/components/quotes/QuoteModal';

// Switched to centralized product catalog

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductBySlug(productId) : undefined;

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {(() => {
        // SPA SEO: update title/meta/JSON-LD for this product
        const images = product.media.filter(m => m.type === 'image').map(m => m.src);
        const ogImage = images[0] || product.media[0]?.poster || '';
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          brand: { '@type': 'Brand', name: 'Ayger' },
          image: images,
          description: product.summary,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: product.priceEur.toFixed(2),
            availability: 'https://schema.org/InStock'
          }
        };

        // Immediate DOM updates (safe in CSR)
        document.title = `${product.name} — Ayger`;
        const ensureMeta = (selector: string, attrs: Record<string, string>) => {
          let el = document.head.querySelector(selector) as HTMLMetaElement | null;
          if (!el) {
            el = document.createElement('meta');
            Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
            document.head.appendChild(el);
          } else if (attrs['content']) {
            el.setAttribute('content', attrs['content']);
          }
          return el;
        };
        ensureMeta('meta[name="description"]', { name: 'description', content: product.summary });
        ensureMeta('meta[property="og:title"]', { property: 'og:title', content: `${product.name} — Ayger` } as any);
        ensureMeta('meta[property="og:description"]', { property: 'og:description', content: product.summary } as any);
        ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'product' } as any);
        ensureMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage } as any);

        let script = document.getElementById('product-json-ld') as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'product-json-ld';
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(jsonLd);
      })()}
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={`${import.meta.env.BASE_URL}images/ayger/logo.png?v=1`} 
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

      {/* Media + sticky buy box */}
      <section className="py-10 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
                {product.media[0]?.type === 'youtube' ? (
                  <iframe
                    className="w-full h-full"
                    src={product.media[0].src.replace('watch?v=', 'embed/').replace('shorts/', 'embed/') + '&mute=1&controls=1&playsinline=1'}
                    title={product.name}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img src={product.media[0]?.src} alt={product.media[0]?.alt || product.name} className="w-full h-full object-cover" />
                )}
              </div>

              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">{product.summary}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Key Features</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300"><CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />{b}</li>
                  ))}
                </ul>
              </div>

              {product.overview && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Overview</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{product.overview}</p>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>Ships from Germany, EU.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">{formatPriceEur(product.priceEur)}</div>
                  <PayPalButton amountEur={product.priceEur} />
                  <QuoteModal defaultProduct={product as ProductRecord} />
                  {product.badges && (
                    <div className="flex gap-2 pt-2">
                      {product.badges.map((b) => (
                        <Badge key={b} variant="secondary">{b}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections can be added here: Tech Specs, Included, Shipping */}

      {/* Specs section omitted until structured data is available */}

      {/* Pricing section merged into sticky buy box */}

      {/* Related products deferred */}

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
