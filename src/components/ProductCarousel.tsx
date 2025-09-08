import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  category: string;
  categoryColor: string;
  image: string;
  link: string;
}

const products: Product[] = [
  {
    id: 'speedair-pro',
    name: 'SpeedAir Pro',
    description: 'Racing Sculls designed for maximum performance and speed',
    tagline: 'Forget Wind Resistance, Feel the Speed! 🚀💨',
    category: 'Professional',
    categoryColor: 'bg-blue-100 text-blue-800',
    image: '/ayger-rowing/images/ayger/speedair-pro.jpg?v=1',
    link: '/product/speedair-pro'
  },
  {
    id: 'speedair-coastal',
    name: 'SpeedAir Coastal',
    description: 'Coastal Racing Sculls built for durability and performance',
    tagline: 'Unbreakable Strength, Unstoppable Speed',
    category: 'Innovative',
    categoryColor: 'bg-green-100 text-green-800',
    image: '/ayger-rowing/images/ayger/speedair-coastal.jpg?v=1',
    link: '/product/speedair-coastal'
  },
  {
    id: 'rowbill-lite',
    name: 'RowBill Lite',
    description: 'Essential rowing monitor for beginners and enthusiasts',
    tagline: 'Simple, Reliable, Effective!',
    category: 'Entry Level',
    categoryColor: 'bg-orange-100 text-orange-800',
    image: '/ayger-rowing/images/ayger/rowbill-lite.jpg?v=1',
    link: '/product/rowbill-lite'
  },
  {
    id: 'rowbill-speed',
    name: 'RowBill Speed',
    description: 'Advanced rowing monitor with comprehensive data analysis',
    tagline: 'Your Rowing, Your Data, Your Progress!',
    category: 'High End',
    categoryColor: 'bg-purple-100 text-purple-800',
    image: '/ayger-rowing/images/ayger/rowbill-speed.jpg?v=1',
    link: '/product/rowbill-speed'
  }
];

export function ProductCarousel() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full">
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-ayger-navy">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center flex flex-col justify-between flex-grow">
                  <div>
                    <Badge variant="secondary" className={`mb-4 ${product.categoryColor}`}>
                      {product.category}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                  </div>
                  <Link to={product.link}>
                    <Button className="w-full bg-ayger-navy hover:bg-ayger-navy/90">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
      
      {/* Custom indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? 'bg-ayger-navy w-8' : 'bg-gray-300'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
