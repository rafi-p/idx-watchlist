import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

export const revalidate = 60;

const yf = new YahooFinance();

type StockData = {
  code: string;
  name: string;
  price: number;
  change: number;
};

const IDX_STOCKS = [
  { code: 'BBCA.JK', name: 'BCA' },
  { code: 'BBRI.JK', name: 'BRI' },
  { code: 'BMRI.JK', name: 'Mandiri' },
  { code: 'TLKM.JK', name: 'Telkom' },
  { code: 'BREN.JK', name: 'Bren' },
];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      IDX_STOCKS.map(async (stock) => {
        const quote = await yf.quote(stock.code);
        return {
          code: stock.code.replace('.JK', ''),
          name: stock.name,
          price: quote.regularMarketPrice ?? 0,
          change: quote.regularMarketChangePercent ?? 0,
        } as StockData;
      })
    );
    const data = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<StockData>).value);

    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason);

    if (errors.length > 0) {
      console.error('Some stocks are failed to retrieve:', errors);
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Failed to retrieve stocks data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve stocks data' },
      { status: 500 }
    );
  }
}
