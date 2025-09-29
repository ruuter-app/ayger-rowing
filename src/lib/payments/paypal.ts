declare global {
  interface Window {
    paypal?: any;
  }
}

// Simple PayPal SDK loading
export function loadPayPalSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.paypal && window.paypal.Buttons) {
      resolve();
      return;
    }

    // Check if script is already loading or loaded
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      // Wait for it to load
      const checkPayPal = () => {
        if (window.paypal && window.paypal.Buttons) {
          resolve();
        } else {
          setTimeout(checkPayPal, 100);
        }
      };
      checkPayPal();
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=EUR&components=buttons';
    script.async = true;

    script.onload = () => {
      console.log('PayPal SDK loaded');
      resolve();
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      reject(new Error('Failed to load PayPal SDK'));
    };

    document.head.appendChild(script);
  });
}

// Simple PayPal button rendering
export async function renderPayPalButtons(params: {
  container: HTMLElement;
  amountEur: number;
  onApprove?: (data: { orderID: string }) => void;
  onError?: (err: unknown) => void;
}) {
  const { container, amountEur, onApprove, onError } = params;

  try {
    await loadPayPalSdk();

    if (!window.paypal || !window.paypal.Buttons) {
      throw new Error('PayPal SDK not available');
    }

    // Clear container
    container.innerHTML = '';

    const buttons = window.paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 40
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: amountEur.toFixed(2),
              },
            },
          ],
          intent: 'CAPTURE',
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          console.log('Payment approved:', details);
          onApprove?.({ orderID: details.id });
        } catch (error) {
          console.error('Payment capture failed:', error);
          onError?.(error);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        onError?.(err);
      }
    });

    buttons.render(container);
    return buttons;
  } catch (error) {
    console.error('Failed to render PayPal buttons:', error);

    // Create fallback button
    container.innerHTML = '';
    const fallbackButton = document.createElement('button');
    fallbackButton.textContent = `PayPal (€${amountEur.toFixed(2)})`;
    fallbackButton.className = 'w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded transition-colors';
    fallbackButton.onclick = () => {
      alert('PayPal is in test mode. Set up a proper PayPal developer account for live payments.');
    };
    container.appendChild(fallbackButton);
  }
}


