import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

export interface FilterOptions {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuel?: string;
  transmission?: string;
  minMileage?: number;
  maxMileage?: number;
}

export const SearchFilters = ({ onFiltersChange, className }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className={cn("border-0 shadow-soft bg-gradient-card", className)}>
      <CardContent className="p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por marca, modelo, ano..."
            className="pl-10 border-border/50 focus:border-primary bg-background"
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary border-primary/30 hover:bg-primary/5"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Preço Mínimo</label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Preço Máximo</label>
              <Input
                type="number"
                placeholder="R$ 999.999"
                value={filters.maxPrice || ""}
                onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ano Mínimo</label>
              <Select onValueChange={(value) => updateFilters({ minYear: Number(value) || undefined })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Combustível</label>
              <Select onValueChange={(value) => updateFilters({ fuel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Etanol">Etanol</SelectItem>
                  <SelectItem value="Flex">Flex</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Elétrico">Elétrico</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Transmissão</label>
              <Select onValueChange={(value) => updateFilters({ transmission: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automática">Automática</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">KM Mínima</label>
              <Input
                type="number"
                placeholder="0 km"
                value={filters.minMileage || ""}
                onChange={(e) => updateFilters({ minMileage: Number(e.target.value) || undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">KM Máxima</label>
              <Input
                type="number"
                placeholder="200.000 km"
                value={filters.maxMileage || ""}
                onChange={(e) => updateFilters({ maxMileage: Number(e.target.value) || undefined })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};