"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stock } from "@/types/Stock"
import { updateStock } from "@/lib/api"
import { toast } from 'react-hot-toast';

interface UpdateStockModalProps {
    stock: Stock;
    onStockUpdated: () => void;
}

export function UpdateStockModal({ stock, onStockUpdated }: UpdateStockModalProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(stock.currentPrice.toString());
    const [error, setError] = useState<string | null>(null);

    const validateForm = () => {
        const price = parseFloat(currentPrice);
        if (isNaN(price) || price <= 0) {
            setError('Please enter a valid price greater than 0');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await updateStock(stock.stockId.toString(), {
                currentPrice: parseFloat(currentPrice)
            });

            setOpen(false);
            toast.success('Stock price updated successfully');
            onStockUpdated();
        } catch (error: any) {
            console.error("Error updating stock price:", error);
            setError(error.response?.data?.message || "Failed to update stock price. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isSubmitting) {
            setCurrentPrice(stock.currentPrice.toString());
            setError(null);
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Update Price
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Stock Price</DialogTitle>
                        <DialogDescription>
                            Update the price for {stock.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="currentPrice">
                                New Price (USD) <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="currentPrice"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(e.target.value)}
                                    className={`pl-7 ${error ? "border-destructive" : ""}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Price"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
