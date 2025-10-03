import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ProductRecord, formatPriceEur } from '@/lib/products';
import { PayPalButton } from '@/components/payments/PayPalButton';
import { QuoteModal } from '@/components/quotes/QuoteModal';

interface ProductCardProps {
  product: ProductRecord;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  const currentMedia = product.media[currentMediaIndex];
  const isVideo = currentMedia?.type === 'youtube';
  const poster = isVideo ? currentMedia.poster : currentMedia?.src;

  const videoSrc = isVideo ? currentMedia.src.replace('watch?v=', 'embed/').replace('shorts/', 'embed/') + '&autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0' : undefined;

  const handleMediaHover = () => {
    if (product.media.length > 1) {
      setHovered(true);
      // Auto-advance through media items
      const interval = setInterval(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % product.media.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden rounded-2xl flex flex-col h-full">
      <div
        className="relative h-48 bg-gray-100 flex items-center justify-center"
        onMouseEnter={handleMediaHover}
        onMouseLeave={() => setHovered(false)}
      >
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            {!hovered && poster ? (
              <img src={poster} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <iframe
                className="w-full h-full"
                src={videoSrc}
                title={product.name}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          <img src={poster} alt={product.name} className="w-full h-full object-contain" />
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.badges?.map((b) => (
            <Badge key={b} variant="secondary" className="bg-white/90 text-gray-900">
              {b}
            </Badge>
          ))}
        </div>
        {product.media.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.media.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{product.name}</span>
          <span className="text-ayger-navy">{formatPriceEur(product.priceEur)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 flex-1">
          {product.bullets.slice(0, 3).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/product/${product.slug}`} className="flex-1 flex">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          <div className="flex-1 flex">
            <PayPalButton amountEur={product.priceEur} className="w-full" />
          </div>
        </div>
        <div className="pt-2">
          <QuoteModal
            defaultProduct={product}
            trigger={<Button variant="outline" size="sm" className="w-full text-xs">Get a Quote</Button>}
          />
        </div>
      </CardContent>
    </Card>
  );
};


