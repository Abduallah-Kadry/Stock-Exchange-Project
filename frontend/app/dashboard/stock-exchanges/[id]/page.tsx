import { notFound, redirect } from 'next/navigation';
import { fetchStockExchange } from '@/lib/api';
import { Suspense } from 'react';
import { StockTable } from '@/components/stock-table';
import { StocksInExchangeTable } from '@/components/stocks-in-exchange-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp } from 'lucide-react';

interface StockExchangeDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StockExchangeDetails({ params }: StockExchangeDetailsProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params;

  // Ensure we have the ID before proceeding
  if (!resolvedParams?.id) {
    console.error('No ID provided in params');
    notFound();
  }

  const id = resolvedParams.id;

  // Validate ID is a number
  const numericId = Number(id);
  if (isNaN(numericId) || numericId <= 0) {
    console.error('Invalid ID format:', id);
    notFound();
  }

  let stockExchange;

  try {
    console.log('Fetching stock exchange with ID:', numericId);
    stockExchange = await fetchStockExchange(numericId);

    if (!stockExchange) {
      console.error('Stock exchange not found for ID:', numericId);
      notFound();
    }

    console.log('Successfully fetched stock exchange:', stockExchange.name);
  } catch (error: unknown) {
    console.error('Error fetching stock exchange:', error);

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        console.log('User unauthorized, redirecting to login');
        redirect('/login');
      }
      console.error('Error message:', error.message);
    }

    // For any other errors, show not found
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl">{stockExchange.name}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {stockExchange.description || 'No description available'}
              </CardDescription>
            </div>
            <Badge
              variant={stockExchange.liveInMarket ? "default" : "secondary"}
              className={stockExchange.liveInMarket ? "bg-green-500" : ""}
            >
              {stockExchange.liveInMarket ? 'Live Market' : 'Market Closed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Exchange ID</span>
              <span className="text-lg font-semibold">{stockExchange.stockExchangeId}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-lg font-semibold">
                {stockExchange.liveInMarket ? 'Active Trading' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stocks in Exchange Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Stocks Listed in {stockExchange.name}</CardTitle>
          </div>
          <CardDescription>
            View all stocks currently listed on this exchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState message="Loading exchange stocks..." />}>
            <StocksInExchangeTable exchangeId={id} />
          </Suspense>
        </CardContent>
      </Card>

      {/* All Stocks Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Available Stocks</CardTitle>
          <CardDescription>
            Browse all stocks in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState message="Loading all stocks..." />}>
            <StockTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component for better UX
function LoadingState({ message }: { message: string }) {
  return (
    <div className="h-32 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StockExchangeDetailsProps) {
  try {
    const resolvedParams = await params;
    const stockExchange = await fetchStockExchange(Number(resolvedParams.id));

    return {
      title: `${stockExchange.name} - Stock Exchange Details`,
      description: stockExchange.description || `View details for ${stockExchange.name}`,
    };
  } catch {
    return {
      title: 'Stock Exchange Details',
      description: 'View stock exchange information',
    };
  }
}