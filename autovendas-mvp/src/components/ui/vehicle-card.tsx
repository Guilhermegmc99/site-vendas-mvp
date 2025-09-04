import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Fuel, Gauge, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: {
    id: string;
    title: string;
    price: number;
    year: number;
    mileage: number;
    fuel: string;
    transmission: string;
    images: string[];
    location: string;
  };
  onWhatsAppClick?: (vehicleId: string) => void;
  className?: string;
}

export const VehicleCard = ({ vehicle, onWhatsAppClick, className }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString('pt-BR')} km`;
  };

  return (
    <Card className={cn(
      "group cursor-pointer overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={vehicle.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {vehicle.year}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-semibold">
            {formatPrice(vehicle.price)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">
            {vehicle.title}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.location}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gauge className="w-3 h-3" />
            <span>{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Fuel className="w-3 h-3" />
            <span>{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Settings className="w-3 h-3" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onWhatsAppClick?.(vehicle.id)}
          className="w-full bg-gradient-accent hover:bg-accent-dark transition-all duration-300 font-medium"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Falar no WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};