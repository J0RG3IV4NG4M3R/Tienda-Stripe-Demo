import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    // Buscar precios activos del producto
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 10
    });

    if (prices.data.length === 0) {
      return NextResponse.json(
        { error: 'No hay precios activos para este producto' },
        { status: 400 }
      );
    }

    // Usar el primer precio activo (o podrías filtrar por moneda)
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

    return NextResponse.json(
      { url: session.url },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}
