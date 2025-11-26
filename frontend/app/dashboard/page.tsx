// app/dashboard/page.tsx
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {cookies} from "next/headers"
import {StockTable} from "@/components/stock-table";

async function getStock() {
	// const token = (await cookies()).get('session_token')?.value
	//
	// const res = await fetch('http://localhost:8080/api/stock', {
	//   headers: { Authorization: `Bearer ${token}` }
	// })
	// return res.json()
}

export default async function DashboardPage() {
	const stock = await getStock() // Fetch happens on server!

	return (
		<div className="p-6">
			<Tabs defaultValue="stocks">  {/* Changed from "users" to "stocks" */}
				<TabsList>
					<TabsTrigger value="stocks">Stocks</TabsTrigger> {/* Changed from "users" to "stocks" */}
					<TabsTrigger value="exchanges">Stock Exchanges</TabsTrigger> {/* Changed from "orders" to "exchanges" */}
				</TabsList>
				<TabsContent value="stocks" className="mt-4">  {/* Changed from "stock" to "stocks" */}
					<StockTable/>
				</TabsContent>
				<TabsContent value="exchanges" className="mt-4">  {/* Changed from "orders" to "exchanges" */}
					<p>Stock Exchanges Table Here...</p>
				</TabsContent>
			</Tabs>
		</div>
	)
}