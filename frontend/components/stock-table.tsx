"use client"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchStocks } from "@/lib/api"
import { Stock } from "@/types/Stock"
import {CreateStockModal} from "@/components/createStockModal";


// todo problem with table and problem with saving with update date


export function StockTable() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pageSize, setPageSize] = useState(5)

  const loadStocks = async () => {
    setIsLoading(true)
    try {
      const response = await fetchStocks(currentPage, pageSize)
      setStocks(
        Array.isArray(response.content) ? response.content : []
      )
      setTotalPages(response.totalPages ?? 0)
      setTotalElements(response.totalElements ?? 0)


      if (currentPage >= response.totalPages && response.totalPages > 0) {
        setCurrentPage(response.totalPages - 1)
      }
    } catch (error) {
      console.error("Error loading stocks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStocks()
  }, [currentPage, pageSize])

  const formatMarketCap = (value?: number) => {
    if (value === undefined || value === null || isNaN(value) || value <= 0) return "N/A"

    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toFixed(2)}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid Date"
    }
  }

  const getRowNumber = (index: number) => {
    return currentPage * pageSize + index + 1
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(0)
  }

  const handleStockCreated = () => {
    // Refresh the table after creating a stock
    loadStocks()
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Portfolio</h2>
          <p className="text-muted-foreground">
            Manage and view all your stocks
          </p>
        </div>
        <CreateStockModal onStockCreated={handleStockCreated} />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableCaption className="py-4">
            Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Stock ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold">Price</TableHead>
              {/*<TableHead className="text-right font-semibold">Created At</TableHead>*/}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Loading stocks...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">No stocks found</p>
                    <p className="text-sm text-muted-foreground">Create your first stock to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock, index) => (
                <TableRow key={stock.stockId} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    {stock.stockId || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {stock.name || "Unnamed Stock"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {stock.description || "No description available"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatMarketCap(stock.currentPrice)}
                  </TableCell>

                  {/*todo only when u think of adding create and update dates*/}
                  {/*<TableCell className="text-right text-sm text-muted-foreground">*/}
                  {/*  {formatDate(stock.updatedAt)}*/}
                  {/*</TableCell>*/}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {stocks.length > 0 && totalElements > 0 ? (
              <span>
                Showing {getRowNumber(0)} to {Math.min(getRowNumber(stocks.length - 1), totalElements)} of {totalElements} entries
              </span>
            ) : (
              <span>No entries</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">
              Page {currentPage + 1}
            </span>
            <span className="text-sm text-muted-foreground">
              of {Math.max(totalPages, 1)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1 || totalPages === 0 || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}