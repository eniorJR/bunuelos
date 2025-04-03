export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const orderId = url.searchParams.get('id');

        if (!orderId) {
            return new Response(JSON.stringify({ error: 'Order ID is required' }), {
                status: 400,
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

        // Try to find the session by ID or partial ID
        let session;

        // First try direct lookup if it's a full session ID
        if (orderId.length === 8) {
            try {
                session = await stripe.checkout.sessions.retrieve(orderId, {
                    expand: ['line_items']
                });
            } catch (error) {
                console.log('Not a full session ID, trying list search');
            }
        }

        // If not found, try to search in the list
        if (!session) {
            const sessions = await stripe.checkout.sessions.list({
                limit: 100,
                expand: ['data.line_items']
            });

            // Find session that starts with the provided ID
            session = sessions.data.find(s =>

                s.id.substring(s.id.length - 12, s.id.length) === orderId
            );
        }

        if (!session) {
            return new Response(JSON.stringify({ error: 'Order not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Format the order data
        const order = {
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
            shipping: session.metadata?.shipping || '2.50',
            tax: (((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100).toFixed(2),
            total: ((session.amount_total || 0) / 100).toFixed(2),
            payment_status: session.payment_status || 'unknown'
        };

        return new Response(JSON.stringify(order), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error retrieving order:', error);
        return new Response(JSON.stringify({ error: 'Error retrieving order' }), {
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