import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const videos = [
  {
    id: 'j_g8nd-3lg8',
    title: 'Ayger Rowing Technology',
    url: 'https://www.youtube.com/embed/j_g8nd-3lg8'
  },
  {
    id: 'yFl49AgJPHM',
    title: 'Professional Rowing Equipment',
    url: 'https://www.youtube.com/embed/yFl49AgJPHM'
  },
  {
    id: 'E3eL2fa6PmM',
    title: 'SpeedAir Sculls in Action',
    url: 'https://www.youtube.com/embed/E3eL2fa6PmM'
  },
  {
    id: 'KPuSwrWjN7c',
    title: 'RowBill Performance Monitor',
    url: 'https://www.youtube.com/embed/KPuSwrWjN7c'
  },
  {
    id: '7FKfkQ3isJU',
    title: 'Rowing Innovation',
    url: 'https://www.youtube.com/embed/7FKfkQ3isJU'
  },
  {
    id: 'D6VU5J8Id4s',
    title: 'Advanced Rowing Technology',
    url: 'https://www.youtube.com/embed/D6VU5J8Id4s'
  },
  {
    id: 'SVExeopZ0UU',
    title: 'Professional Rowing Solutions',
    url: 'https://www.youtube.com/embed/SVExeopZ0UU'
  },
  {
    id: 'T0n90Z9Am9M',
    title: 'Rowing Excellence',
    url: 'https://www.youtube.com/embed/T0n90Z9Am9M'
  },
  {
    id: 'JAuKKl-6Gm0',
    title: 'High-Performance Rowing',
    url: 'https://www.youtube.com/embed/JAuKKl-6Gm0'
  },
  {
    id: 'qdivVy9Qu6I',
    title: 'Rowing Innovation Showcase',
    url: 'https://www.youtube.com/embed/qdivVy9Qu6I'
  }
];

export function VideoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-advance slideshow
  useEffect(() => {
    if (isAutoPlay && isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 5000); // Change video every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, isPlaying]);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main Video Display */}
      <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl max-h-[70vh]">
        <iframe
          key={currentIndex}
          src={`${videos[currentIndex].url}?autoplay=${isPlaying ? 1 : 0}&mute=1&loop=1&playlist=${videos[currentIndex].id}&controls=1&showinfo=0&rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        
        {/* Video Overlay Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="secondary"
          size="sm"
          onClick={prevVideo}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={nextVideo}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>


      {/* Video Title */}
      <div className="mt-4 text-center">
        <h3 className="text-base font-semibold text-white">
          {videos[currentIndex].title}
        </h3>
        <p className="text-sm text-gray-300">
          {currentIndex + 1} of {videos.length}
        </p>
      </div>
    </div>
  );
}
