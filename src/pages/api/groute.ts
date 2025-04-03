export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(
      "sk_test_51R4OKfRO11XoyFzD1VFkWWvzB89TtYBhEfSraMY9R42IIXRKFjI1xq8sPY731PqhHWMmI98XpJ4gfx7vvFfdK9Ko00n8TY5Azv"
    );

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return the session metadata
    return new Response(
      JSON.stringify({
        customerName: session.metadata?.customerName,
        customerEmail: session.metadata?.customerEmail,
        customerPhone: session.metadata?.customerPhone,
        customerAddress: session.metadata?.customerAddress,
        subtotal: session.metadata?.subtotal,
        shipping: session.metadata?.shipping,
        tax: session.metadata?.tax,
        total: session.metadata?.total,
        tax_rate: session.metadata?.tax_rate
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error retrieving order details:", error);
    return new Response(
      JSON.stringify({ error: "Error retrieving order details" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};