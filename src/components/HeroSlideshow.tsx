import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const heroImages = [
  'row-1-column-1-3-1536x1536.jpg',
  'MG_6079-2048x1365.jpg',
  'MG_4750-2048x1365.jpg',
  '355107851_233403419458080_1293222362991503148_n-e1740766065354.jpeg',
  'high-angle-shot-two-people-paddling-boat-middle-sea-scaled.jpg'
];

export function HeroSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log('HeroSlideshow mounted, images:', heroImages);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % heroImages.length;
        console.log('Changing to image index:', newIndex, 'image:', heroImages[newIndex]);
        return newIndex;
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  console.log('Current image index:', currentImageIndex, 'Current image:', heroImages[currentImageIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-30' : 'opacity-0'
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/ayger/${image}`}
            alt={`Hero background ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${image}`, e);
            }}
            onLoad={() => {
              console.log(`Successfully loaded image: ${image}`);
            }}
          />
        </div>
      ))}
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="text-center px-6">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 px-4 py-2 rounded-full shadow-lg">
              <span className="text-black font-bold text-sm">🇩🇪</span>
              <span className="text-black font-bold text-sm tracking-wide">MADE IN GERMANY</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
            High-end Rowing Equipment
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto drop-shadow-md mb-8">
            Cut Through Air • Conquer the Water
          </p>
          
          {/* Action Buttons */}
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
              className="border-white text-white hover:bg-white hover:text-ayger-navy bg-transparent dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-ayger-navy"
              onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Videos
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 dark:from-gray-900/20 dark:via-transparent dark:to-gray-900/40 z-10"></div>
    </div>
  );
}
