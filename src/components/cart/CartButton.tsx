import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

interface CartButtonProps {
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ className }) => {
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();

  return (
    <Button variant="outline" className={`relative ${className}`}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

