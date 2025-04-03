export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

interface OrderItem {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  session_id: string;
  created_at: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  payment_status: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // Check authorization
    const authHeader = request.headers.get('Authorization');
    const correctPassword = "b4d331bb6950a11acaaa34db90990728";

    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== correctPassword) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(
      "sk_test_51R4OKfRO11XoyFzD1VFkWWvzB89TtYBhEfSraMY9R42IIXRKFjI1xq8sPY731PqhHWMmI98XpJ4gfx7vvFfdK9Ko00n8TY5Azv",
      {
        apiVersion: '2023-10-16'
      }
    );

    // Fetch completed checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items']
    });

    // Transform the data for our admin panel
    const orders: Order[] = sessions.data.map(session => {
      return {
        id: session.id.substring(session.id.length - 12, session.id.length),
        session_id: session.id,
        created_at: new Date(session.created * 1000).toISOString(),
        customerName: session.customer_details?.name || session.metadata?.customerName || 'N/A',
        customerEmail: session.customer_details?.email || session.metadata?.customerEmail || 'N/A',
        customerPhone: session.customer_details?.phone || session.metadata?.customerPhone || 'N/A',
        customerAddress: formatAddress(session.customer_details?.address) || session.metadata?.customerAddress || 'N/A',
        items: session.line_items?.data.map(item => ({
          name: item.description || '',
          price: ((item.amount_total || 0) / 100).toFixed(2),
          quantity: item.quantity || 1
        })) || [],
        subtotal: ((session.amount_subtotal || 0) / 100).toFixed(2),
        shipping: session.metadata?.shipping || '2.50', // Default shipping cost
        tax: (((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100).toFixed(2),
        total: ((session.amount_total || 0) / 100).toFixed(2),
        payment_status: session.payment_status || 'unknown'
      };
    });

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Error retrieving orders' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Helper function to format address
function formatAddress(address?: Stripe.Address | null): string {
  if (!address) return '';

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
}