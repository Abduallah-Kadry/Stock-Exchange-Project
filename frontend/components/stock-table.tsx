"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

export interface Stock {
  id: string
  tickerSymbol: string
  companyName: string
  description: string
  marketCap: number
  listingDate: string
}

interface StockTableProps {
  data?: Stock[]
}

// Dummy data
const dummyStocks: Stock[] = [
  {
    id: "1",
    tickerSymbol: "AAPL",
    companyName: "Apple Inc.",
    description: "Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.",
    marketCap: 2800000000000,
    listingDate: "1980-12-12",
  },
  {
    id: "2",
    tickerSymbol: "MSFT",
    companyName: "Microsoft Corporation",
    description: "Technology company that develops, licenses, and sells software, consumer electronics, personal computers, and related services.",
    marketCap: 2100000000000,
    listingDate: "1986-03-13",
  },
  {
    id: "3",
    tickerSymbol: "GOOGL",
    companyName: "Alphabet Inc.",
    description: "Multinational technology company that specializes in Internet-related services and products, including online advertising technologies, a search engine, cloud computing, software, and hardware.",
    marketCap: 1800000000000,
    listingDate: "2004-08-19",
  },
]

export function StockTable({ data = dummyStocks }: StockTableProps) {
  const stocks = data || dummyStocks

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value}`
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of available stocks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Listed Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell className="font-medium">{stock.tickerSymbol}</TableCell>
              <TableCell>{stock.companyName}</TableCell>
              <TableCell className="max-w-xs line-clamp-2">{stock.description}</TableCell>
              <TableCell className="text-right">{formatMarketCap(stock.marketCap)}</TableCell>
              <TableCell className="text-right">
                {format(new Date(stock.listingDate), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}