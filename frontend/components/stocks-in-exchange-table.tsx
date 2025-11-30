'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchStocksInExchange, removeStocksFromExchange } from '@/lib/api';
import {Stock} from "@/types/Stock";

export function StocksInExchangeTable({ exchangeId }: { exchangeId: string }) {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingStocks, setIsDeletingStocks] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const numericExchangeId = Number(exchangeId);

  const loadStocks = async () => {
    if (isNaN(numericExchangeId)) return;

    setIsLoading(true);
    try {
      const response = await fetchStocksInExchange(numericExchangeId, currentPage, pageSize);
      setStocks(Array.isArray(response.content) ? response.content : []);
      setTotalPages(response.totalPages ?? 0);
      setTotalElements(response.totalElements ?? 0);

      if (currentPage >= response.totalPages && response.totalPages > 0) {
        setCurrentPage(response.totalPages - 1);
      }
    } catch (error) {
      console.error("Error loading stocks in exchange:", error);
      toast.error('Failed to load stocks in exchange');
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

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
    setSelectedStockIds([]);
  };

  const handleSelectStock = (stockId: string, checked: boolean) => {
    if (checked) {
      setSelectedStockIds(prev => [...prev, stockId]);
    } else {
      setSelectedStockIds(prev => prev.filter(id => id !== stockId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStockIds(stocks.map(stock => stock.stockId || ''));
    } else {
      setSelectedStockIds([]);
    }
  };

  const handleDeleteStocks = async () => {
    if (selectedStockIds.length === 0) return;

    try {
      setIsDeletingStocks(true);
      await removeStocksFromExchange(numericExchangeId, selectedStockIds);
      toast.success('Successfully removed stocks from exchange');
      setSelectedStockIds([]);
      loadStocks(); // Refresh the list
    } catch (error) {
      console.error('Error removing stocks from exchange:', error);
      toast.error('Failed to remove stocks from exchange');
    } finally {
      setIsDeletingStocks(false);
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Stocks in Exchange</h3>
        <Button
          variant="destructive"
          onClick={() => selectedStockIds.length > 0 && setIsConfirmDialogOpen(true)}
          disabled={selectedStockIds.length === 0 || isDeletingStocks}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeletingStocks ? 'Deleting...' : `Delete ${selectedStockIds.length} selected stocks`}
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableCaption className="py-4">
            Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={stocks.length > 0 && selectedStockIds.length === stocks.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-semibold">Stock ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold">Price</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Loading stocks in exchange...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">No stocks found in this exchange</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock) => (
                <TableRow key={stock.stockId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStockIds.includes(stock.stockId || '')}
                      onCheckedChange={(checked) =>
                        handleSelectStock(stock.stockId || '', checked as boolean)
                      }
                      aria-label={`Select stock ${stock.stockId}`}
                    />
                  </TableCell>
                  <TableCell>{stock.stockId}</TableCell>
                  <TableCell className="font-medium">
                    {stock.name || 'Unnamed Stock'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {stock.description || 'No description available'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatMarketCap(stock.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View details"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/stocks/${stock.stockId}`);
                        }}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium">
            {stocks.length > 0 ? currentPage * pageSize + 1 : 0} -{' '}
            {Math.min((currentPage + 1) * pageSize, totalElements)}
          </span>{' '}
          of <span className="font-medium">{totalElements}</span> stocks
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages - 1 || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to remove {selectedStockIds.length} selected stock(s) from this exchange?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isDeletingStocks}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteStocks}
                disabled={isDeletingStocks}
              >
                {isDeletingStocks ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
