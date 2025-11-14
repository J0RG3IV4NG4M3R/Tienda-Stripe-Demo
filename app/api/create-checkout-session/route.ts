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

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: quantity
      }],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
      locale: 'es',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
