export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body
    const body = await request.json();
    const { items, customerInfo, shipping, tax, total } = body;

    // Initialize Stripe
    const stripe = new Stripe(
      "sk_test_51R4OKfRO11XoyFzD1VFkWWvzB89TtYBhEfSraMY9R42IIXRKFjI1xq8sPY731PqhHWMmI98XpJ4gfx7vvFfdK9Ko00n8TY5Azv"
    );

    // Create or retrieve a customer
    let customer;
    try {
      // Try to find existing customer by email
      const customers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
        // Update customer with latest info
        customer = await stripe.customers.update(customer.id, {
          name: customerInfo.name,
          phone: customerInfo.phone,
          shipping: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
              country: 'ES',
            },
          },
        });
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          shipping: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
              country: 'ES',
            },
          },
        });
      }
    } catch (error) {
      console.error("Error creating/updating customer:", error);
      // Continue without customer if there's an error
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['ES'],
      },
      customer: customer?.id, // Associate with customer to pre-fill info
      customer_email: customer ? undefined : customerInfo.email, // Only use if no customer created
      line_items: [
        // Add product items
        ...items.map((item: { name: any; imageSrc: any; cat: any; id: any; price: string; }) => {
          return {
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.name || 'Buñuelo',
                description: item.cat || 'Producto',
                metadata: {
                  id: item.id,
                },
              },
              unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
              tax_behavior: "exclusive", // Changed to exclusive so tax is added on top
            },
            quantity: 1,
          };
        }),
        // Add tax as a separate line item
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'IVA (21%)',
              description: 'Impuesto sobre el valor añadido',
            },
            unit_amount: Math.round(tax * 100), // Convert tax to cents
            tax_behavior: "exclusive",
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/shop/cart`,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        subtotal: (total - shipping - tax).toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        tax_rate: "21%",
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shipping * 100), // Convert to cents
              currency: 'eur',
            },
            display_name: 'Envío estándar',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
    });

    // Return the session ID
    return new Response(
      JSON.stringify({ id: session.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Error creating checkout session" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};