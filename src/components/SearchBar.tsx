'use client';

import { useState, useEffect } from 'react';

type SearchResult = {
  code: string;
  name: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedQuery = query.trim();
  const shouldSearch = trimmedQuery.length >= 2;

  useEffect(() => {
    if (!shouldSearch) {
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('Searc error:', error);
          setResults([]);
          setIsLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [trimmedQuery, shouldSearch]);

  const displayResults = shouldSearch ? results : [];

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Cari saham (BBCA, ASII, GOTO)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {!shouldSearch && (
        <p className="text-gray-400 text-xs mt-1">
          Minimal 2 karakter. Gunakan kode saham lengkap untuk hasil terbaik.
        </p>
      )}
      {isLoading && <p className="text-gray-500 text-sm mt-2">Mencari...</p>}

      {!isLoading && displayResults.length > 0 && (
        <div className="mt-3 space-y-2">
          {displayResults.map((stock) => (
            <div
              key={stock.code}
              className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-bold text-gray-900">{stock.code}</p>
              <p className="text-gray-500 text-sm">{stock.name}</p>
            </div>
          ))}
        </div>
      )}
      {!isLoading && shouldSearch && displayResults.length === 0 && (
        <div className="mt-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-gray-700 text-sm font-medium mb-1">
            Tidak ditemukan hasil untuk &quot;{trimmedQuery}&quot;
          </p>
          <p className="text-gray-500 text-xs">
            💡 Tip: Coba ketik kode saham lengkap seperti{' '}
            <span className="font-mono text-gray-700">BBCA</span>,{' '}
            <span className="font-mono text-gray-700">ASII</span>, atau{' '}
            <span className="font-mono text-gray-700">TLKM</span>
          </p>
        </div>
      )}
    </div>
  );
}
