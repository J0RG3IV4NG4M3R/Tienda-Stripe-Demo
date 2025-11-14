import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Manejar POST desde formulario HTML (form-data)
export async function POST(request: NextRequest) {
  try {
    // Parsear form-data en lugar de JSON
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const quantity = parseInt(formData.get('quantity') as string) || 1;

    // Buscar precios activos del producto
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 10
    });

    if (prices.data.length === 0) {
      // Devolver una página HTML con error
      return new NextResponse(
        `<html>
          <body>
            <script>
              window.parent.postMessage({
                type: 'stripe-checkout-error',
                error: 'No hay precios activos para este producto'
              }, '*');
            </script>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    const priceId = prices.data[0].id;
    const origin = request.headers.get('origin') || 'https://tuapp.com';
    
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: quantity
      }],
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      locale: 'es',
    });

    // Devolver una página HTML que envía el mensaje a Framer
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.parent.postMessage({
              type: 'stripe-checkout-success',
              url: '${session.url}'
            }, '*');
          </script>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error: any) {
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.parent.postMessage({
              type: 'stripe-checkout-error',
              error: '${error.message}'
            }, '*');
          </script>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}
