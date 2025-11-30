'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchStocksInExchange } from '@/lib/api';
import { Stock } from '@/types/Stock';

export function StocksInExchangeTable({ exchangeId }: { exchangeId: string }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const loadStocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetchStocksInExchange(Number(exchangeId), currentPage, pageSize);
      setStocks(Array.isArray(response.content) ? response.content : []);
      setTotalPages(response.totalPages ?? 0);
      
      if (currentPage >= response.totalPages && response.totalPages > 0) {
        setCurrentPage(response.totalPages - 1);
      }
    } catch (error) {
      console.error("Error loading stocks in exchange:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, [currentPage, pageSize, exchangeId]);

  const formatMarketCap = (value?: number) => {
    if (value === undefined || value === null || isNaN(value) || value <= 0) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const getRowNumber = (index: number) => {
    return currentPage * pageSize + index + 1;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-muted-foreground">Loading stocks...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : stocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-muted-foreground">No stocks found in this exchange</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            stocks.map((stock, index) => (
              <TableRow key={stock.stockId}>
                <TableCell>{getRowNumber(index)}</TableCell>
                <TableCell className="font-medium">
                  {stock.name || "Unnamed Stock"}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {stock.description || "No description available"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatMarketCap(stock.currentPrice)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{stocks.length}</span> of{' '}
          <span className="font-medium">{totalPages * pageSize}</span> stocks
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {Math.max(totalPages, 1)}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage >= totalPages - 1}
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
