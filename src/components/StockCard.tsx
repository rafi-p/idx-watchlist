import { Stock } from "@/types/stock"


export default function StockCard({ code, name, price, change }: Stock) {
  const isPositive = change >= 0;

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-lg text-gray-900">{code}</p>
          <p className="text-gray-500 text-sm">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            Rp {price.toLocaleString("id-ID")}
          </p>
          <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}