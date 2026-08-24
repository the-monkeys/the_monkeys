const SCRIPT_ID = 'razorpay-checkout';

type PayArgs = {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  email?: string;
  prefillName?: string;
};

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject();
  if (document.getElementById(SCRIPT_ID) && (window as any).Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load payment'));
    document.body.appendChild(script);
  });
}

export async function openRazorpay(args: PayArgs): Promise<boolean> {
  await loadScript();
  const Razorpay = (window as any).Razorpay;
  if (!Razorpay) throw new Error('Payment is not available');

  return new Promise((resolve) => {
    const checkout = new Razorpay({
      key: args.key,
      amount: Math.round(args.amount * 100),
      currency: args.currency || 'INR',
      name: 'Monkeys',
      description: args.description || args.name,
      order_id: args.orderId,
      theme: { color: '#FF4B4B' },
      prefill: {
        email: args.email,
        name: args.prefillName,
      },
      handler: () => resolve(true),
      modal: { ondismiss: () => resolve(false) },
    });
    checkout.open();
  });
}
