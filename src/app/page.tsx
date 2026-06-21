import StockCard from "@/components/StockCard"
import {Stock } from "@/types/stock"

async function getStocks(): Promise<Stock[]> {
  const res = await fetch("http://localhost:3000/api/stocks", {
    next: {revalidate: 20}
  })

  if(!res.ok) {
    
    throw new Error("Failed to fetch stocks")
  }

  return res.json()
}

export default async function Home() {
  const stocks = await getStocks();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IDX Watchlist
        </h1>
        <p className="text-gray-500 mb-6">
          Pantau harga saham Indonesia favoritmu
        </p>

        <div className="space-y-3">
          {
            stocks.map((stock) => (
              <StockCard
                key={stock.code}
                code={stock.code}
                name={stock.name}
                price={stock.price}
                change={stock.change}
              />
            ))
          }
        </div>
      </div>
    </main>
  )
}