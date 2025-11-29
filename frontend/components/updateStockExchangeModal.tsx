"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { StockExchange } from "@/types/Stock"
import { updateStockExchange } from "@/lib/api"
import { toast } from 'react-hot-toast';

interface UpdateStockExchangeModalProps {
  exchange: StockExchange;
  onExchangeUpdated: () => void;
}

export function UpdateStockExchangeModal({ exchange, onExchangeUpdated }: UpdateStockExchangeModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: exchange.name,
    description: exchange.description || '',
    liveInMarket: exchange.liveInMarket || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await updateStockExchange(exchange.stockExchangeId, formData);
      toast.success('Stock exchange updated successfully');
      setOpen(false);
      onExchangeUpdated();
    } catch (error: any) {
      console.error("Error updating stock exchange:", error);
      
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({
          general: error.response?.data?.message || "Failed to update stock exchange. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      // Reset form when closing and not submitting
      setFormData({
        name: exchange.name,
        description: exchange.description || '',
        liveInMarket: exchange.liveInMarket || false
      });
      setErrors({});
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Stock Exchange</DialogTitle>
            <DialogDescription>
              Update the stock exchange information below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {errors.general && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">
                Exchange Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., New York Stock Exchange"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                maxLength={30}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.name.length}/30 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the stock exchange"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                maxLength={100}
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/100 characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="liveInMarket">Live in Market</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.liveInMarket ? 'Exchange is currently active' : 'Exchange is currently inactive'}
                </p>
              </div>
              <Switch
                id="liveInMarket"
                checked={formData.liveInMarket}
                onCheckedChange={(checked) => handleInputChange("liveInMarket", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Exchange"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
