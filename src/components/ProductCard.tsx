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
      }, 6000); // 6 seconds

      return () => clearInterval(interval);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden rounded-2xl flex flex-col h-full">
      <div
        className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden"
        onMouseEnter={handleMediaHover}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative w-full h-full">
          {product.media.map((mediaItem, index) => {
            const isCurrent = index === currentMediaIndex;
            const isVideo = mediaItem.type === 'youtube';
            const mediaPoster = isVideo ? mediaItem.poster : mediaItem.src;
            const mediaVideoSrc = isVideo ? mediaItem.src.replace('watch?v=', 'embed/').replace('shorts/', 'embed/') + '&autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0' : undefined;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {isVideo ? (
                  <iframe
                    className="w-full h-full"
                    src={isCurrent ? mediaVideoSrc : undefined}
                    title={product.name}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={mediaPoster}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute top-2 left-2 flex gap-2 z-20">
          {product.badges?.map((b) => (
            <Badge key={b} variant="secondary" className="bg-white/90 text-gray-900">
              {b}
            </Badge>
          ))}
        </div>

        {product.media.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1 z-20">
            {product.media.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex(index);
                  setHovered(false); // Stop auto-advance when manually clicked
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                }`}
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


