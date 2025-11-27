"use client"

import {useEffect, useState} from "react"
import {
	Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {format} from "date-fns"
import {Button} from "@/components/ui/button"
import {fetchStocks} from "@/lib/api"
import {Stock} from "@/types/Stock"

export function StockTable() {
	const [stocks, setStocks] = useState<Stock[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const pageSize = 5

	useEffect(() => {
		const loadStocks = async () => {
			setIsLoading(true)
			try {
				const response = await fetchStocks(currentPage, pageSize)

				setStocks(
					Array.isArray(response.content) ? response.content : []
				)

				setTotalPages(response.totalPages ?? 0)

				// Fix invalid page number
				if (currentPage >= response.totalPages && response.totalPages > 0) {
					setCurrentPage(response.totalPages - 1)
				}
			} catch (error) {
				console.error("Error loading stocks:", error)
			} finally {
				setIsLoading(false)
			}
		}

		loadStocks()
	}, [currentPage])

	const formatMarketCap = (value?: number) => {
		if (!value || value <= 0) return "N/A"
		if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
		if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
		if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
		return `$${value}`
	}

	return (
		<div className="w-full space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableCaption>
						Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
					</TableCaption>

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
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-4">
									Loading...
								</TableCell>
							</TableRow>
						) : stocks.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-4">
									No stocks found
								</TableCell>
							</TableRow>
						) : (
							stocks.map((stock, index) => (
								<TableRow key={stock.id ?? stock.tickerSymbol ?? index}>

									<TableCell className="font-medium">{stock.tickerSymbol}</TableCell>
									<TableCell>{stock.companyName}</TableCell>
									<TableCell className="max-w-xs line-clamp-2">{stock.description}</TableCell>
									<TableCell className="text-right">{formatMarketCap(stock.marketCap)}</TableCell>
									<TableCell className="text-right">
										{stock.listingDate
											? format(new Date(stock.listingDate), "MMM d, yyyy")
											: "N/A"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
					disabled={currentPage === 0 || isLoading}
				>
					Previous
				</Button>

				<span>
          Page {currentPage + 1} of {Math.max(totalPages, 1)}
        </span>

				<Button
					variant="outline"
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
					}
					disabled={currentPage >= totalPages - 1 || totalPages === 0 || isLoading}
				>
					Next
				</Button>
			</div>
		</div>
	)
}
