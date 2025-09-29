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
  const firstMedia = product.media[0];
  const poster = firstMedia.type === 'image' ? firstMedia.src : firstMedia.poster || undefined;
  const firstVideo = product.media.find(m => m.type === 'youtube');

  const [hovered, setHovered] = React.useState(false);
  const videoRef = React.useRef<HTMLIFrameElement | null>(null);

  const videoSrc = firstVideo ? firstVideo.src.replace('watch?v=', 'embed/').replace('shorts/', 'embed/') + '&autoplay=1&mute=1&loop=1&controls=0&playsinline=1' : undefined;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden rounded-2xl flex flex-col h-full">
      <div className="relative h-48 bg-gray-100 flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {firstVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            {!hovered && poster ? (
              <img src={poster} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <iframe
                ref={videoRef}
                className="w-full h-full"
                src={videoSrc}
                title={product.name}
                allow="autoplay; encrypted-media; picture-in-picture"
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


