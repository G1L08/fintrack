import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=MXN,EUR',
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error('Frankfurter no respondió correctamente');
    }

    const data = await res.json();

    return NextResponse.json({
      base: data.base,
      fecha: data.date,
      tasas: data.rates,
    });
  } catch {
    return NextResponse.json(
      { error: 'No se pudieron obtener los tipos de cambio' },
      { status: 500 }
    );
  }
}