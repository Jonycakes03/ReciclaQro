import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Procesar el webhook según el tipo
    console.log('Webhook recibido:', body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}
