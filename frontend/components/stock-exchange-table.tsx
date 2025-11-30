"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Circle, Pencil } from "lucide-react"
import { fetchStockExchanges } from "@/lib/api"
import { StockExchange } from "@/types/Stock"
import { CreateStockExchangeModal } from "@/components/createStockExchangeModal"
import { UpdateStockExchangeModal } from "@/components/updateStockExchangeModal"

export function StockExchangeTable() {
  const [exchanges, setExchanges] = useState<StockExchange[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pageSize, setPageSize] = useState(20)

  const loadExchanges = async () => {
    setIsLoading(true)
    try {
      const response = await fetchStockExchanges(currentPage, pageSize)
      setExchanges(
        Array.isArray(response.content) ? response.content : []
      )
      setTotalPages(response.totalPages ?? 0)
      setTotalElements(response.totalElements ?? 0)

      if (currentPage >= response.totalPages && response.totalPages > 0) {
        setCurrentPage(response.totalPages - 1)
      }
    } catch (error) {
      console.error("Error loading stock exchanges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExchanges()
  }, [currentPage, pageSize])

  const getRowNumber = (index: number) => {
    return currentPage * pageSize + index + 1
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(0)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Exchanges</h2>
          <p className="text-muted-foreground">
            View all available stock exchanges
          </p>
        </div>
        <CreateStockExchangeModal onExchangeCreated={loadExchanges} />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableCaption className="py-4">
            Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">#</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : exchanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No stock exchanges found
                </TableCell>
              </TableRow>
            ) : (
              exchanges.map((exchange, index) => (
                <TableRow key={exchange.stockExchangeId} className="hover:bg-muted/50">
                  <TableCell>{exchange.stockExchangeId}</TableCell>
                  <TableCell className="font-medium">{exchange.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {exchange.description || 'No description available'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Circle 
                        className={`h-3 w-3 mr-2 ${exchange.liveInMarket ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`} 
                      />
                      {exchange.liveInMarket ? 'Live' : 'Closed'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <UpdateStockExchangeModal 
                        exchange={exchange}
                        onExchangeUpdated={loadExchanges}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit exchange"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </UpdateStockExchangeModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage * pageSize) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((currentPage + 1) * pageSize, totalElements)}
              </span>{' '}
              of <span className="font-medium">{totalElements}</span> exchanges
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
            >
              Next
            </Button>
            
            <div className="flex items-center space-x-2 ml-4">
              <p className="text-sm text-muted-foreground">Rows per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-[70px] bg-background">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {[5, 10, 20, 50].map(size => (
                    <SelectItem key={size} value={size.toString()} className="hover:bg-accent">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
