import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

export const revalidate = 60;

const yf = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const searchResult = await yf.search(query, { quotesCount: 10 });

    const indonesianStocks = searchResult.quotes
      .filter((quote) => {
        if (!('symbol' in quote)) return false;
        if (typeof quote.symbol !== 'string') return false;
        return quote.symbol.endsWith('.JK');
      })
      .map((quote) => {
        const q = quote as {
          symbol: string;
          shortname?: string;
          longname?: string;
        };
        return {
          code: q.symbol.replace('.JK', ''),
          name: q.shortname || q.longname || q.symbol,
        };
      });

    return NextResponse.json({ results: indonesianStocks });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
