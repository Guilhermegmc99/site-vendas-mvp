import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVehicleById } from "@/data/mock-vehicles";
import { 
  MessageCircle, 
  ArrowLeft, 
  Fuel, 
  Gauge, 
  Calendar, 
  Settings, 
  MapPin,
  Phone,
  Share2,
  Heart,
  Camera
} from "lucide-react";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const vehicle = id ? getVehicleById(id) : null;

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={isAuthenticated}
          onLogin={() => setIsAuthenticated(true)}
          onLogout={() => setIsAuthenticated(false)}
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Veículo não encontrado</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleWhatsAppClick = () => {
    // Register lead (mock implementation)
    console.log('Lead registered:', {
      vehicleId: vehicle.id,
      timestamp: new Date().toISOString(),
      referrer: window.location.href,
      page: 'detail'
    });

    // Generate WhatsApp message
    const message = `Olá, tenho interesse no ${vehicle.title} — ${window.location.href}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.title,
        text: `Confira este ${vehicle.title} por ${formatPrice(vehicle.price)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        onLogin={() => setIsAuthenticated(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos veículos
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden border-0 shadow-medium">
              <div className="relative aspect-[16/10]">
                <img
                  src={vehicle.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={vehicle.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-background/90 backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                    <Camera className="w-3 h-3 mr-1" />
                    {vehicle.images.length} fotos
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-glow' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${vehicle.title} - Foto ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            {/* Price & Title */}
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {vehicle.year}
                  </Badge>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(vehicle.price)}
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {vehicle.title}
                </h1>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {vehicle.location}
                </div>
                
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-accent hover:bg-accent-dark text-accent-foreground font-semibold py-6 text-lg shadow-soft hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full mt-3 border-primary/30 hover:bg-primary/5 text-primary"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar Agora
                </Button>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Especificações
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Gauge className="w-4 h-4" />
                      <span>Quilometragem</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {formatMileage(vehicle.mileage)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Fuel className="w-4 h-4" />
                      <span>Combustível</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {vehicle.fuel}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Settings className="w-4 h-4" />
                      <span>Transmissão</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {vehicle.transmission}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Ano</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {vehicle.year}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cor</span>
                    <span className="font-medium text-foreground">
                      {vehicle.color}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Equipamentos
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="mt-8 border-0 shadow-soft bg-gradient-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Descrição
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {vehicle.description}
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetail;