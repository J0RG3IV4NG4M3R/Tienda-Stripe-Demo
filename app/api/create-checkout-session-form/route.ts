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
    const successUrl = formData.get('successUrl') as string;
    const cancelUrl = formData.get('cancelUrl') as string;
    
    // Obtener los nombres de los asistentes
    const attendeeNames: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const name = formData.get(`attendeeName${i}`) as string;
      if (name) attendeeNames.push(name);
    }

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
    
    // Crear metadata con los nombres de los asistentes
    const metadata: any = {
      quantity: quantity.toString(),
      attendeeNames: attendeeNames.join(', ')
    };
    
    // Agregar cada nombre individualmente para mejor tracking
    attendeeNames.forEach((name, index) => {
      metadata[`attendee_${index + 1}`] = name;
    });
    
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: quantity
      }],
      mode: 'payment',
      success_url: successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/cancel`,
      locale: 'es-419', // Español de Latinoamérica - formato mexicano
      metadata: metadata,
      custom_fields: [
        {
          key: 'buyer_name',
          label: {
            type: 'custom',
            custom: 'Nombre del comprador'
          },
          type: 'text',
        }
      ],
      phone_number_collection: {
        enabled: true
      }
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
