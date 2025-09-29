import React from 'react';
import { renderPayPalButtons } from '@/lib/payments/paypal';

interface PayPalButtonProps {
  amountEur: number;
  onApproved?: (orderID: string) => void;
  className?: string;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ amountEur, onApproved, className }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    renderPayPalButtons({
      container,
      amountEur,
      onApprove: ({ orderID }) => {
        console.log('Payment successful, order ID:', orderID);
        onApproved?.(orderID);
      },
      onError: (error) => {
        console.error('PayPal error:', error);
      },
    });
  }, [amountEur, onApproved]);

  return <div ref={containerRef} className={className} />;
};


