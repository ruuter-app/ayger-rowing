import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';
import { formatPriceEur } from '@/lib/products';
import { PayPalButton } from '@/components/payments/PayPalButton';

interface CartSidebarProps {
  trigger?: React.ReactNode;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ trigger }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePayPalSuccess = (orderID: string) => {
    console.log('Payment successful, clearing cart');
    clearCart();
    setIsOpen(false);
    alert(`Payment successful! Order ID: ${orderID}`);
  };

  const defaultTrigger = (
    <Button variant="outline" className="relative">
      <ShoppingCart className="h-4 w-4 mr-2" />
      Cart
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? 'Your cart is empty' : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingCart className="h-12 w-12 mb-4" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some products to get started!</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Cart Items */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <Card key={item.product.slug} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                        {item.product.media[0]?.type === 'image' ? (
                          <img
                            src={item.product.media[0].src}
                            alt={item.product.name}
                            className="w-full h-full object-contain rounded-md"
                          />
                        ) : (
                          <div className="text-xs text-gray-400">Video</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{formatPriceEur(item.product.priceEur)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.product.slug)}
                            className="ml-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Cart Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span className="font-medium">{formatPriceEur(getTotalPrice())}</span>
              </div>

              <div className="text-sm text-gray-600">
                VAT included • Shipping calculated at checkout
              </div>

              {/* PayPal Checkout */}
              <div className="space-y-2">
                <PayPalButton
                  amountEur={getTotalPrice()}
                  onApproved={handlePayPalSuccess}
                />
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

