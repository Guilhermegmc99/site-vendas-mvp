import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { SearchFilters, FilterOptions } from "@/components/ui/search-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import apiService, { Vehicle } from "@/services/api";
import { Search, TrendingUp, Shield, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-automotive-new.jpg";

const Index = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPublicVehicles({
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        fuel: filters.fuel,
        transmission: filters.transmission,
        page: 1,
        limit: 12
      });
      
      setVehicles(response.vehicles);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = async (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    try {
      // Register lead
      await apiService.createLead({
        vehicleId,
        utmSource: 'site_vendas',
        utmMedium: 'whatsapp_cta',
        utmCampaign: 'home_page'
      });

      // Generate WhatsApp message
      const message = `Olá, tenho interesse no ${vehicle.title} — ${window.location.origin}/vehicle/${vehicleId}`;
      const whatsappUrl = `https://wa.me/5562999999999?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error registering lead:', error);
      // Still open WhatsApp even if lead registration fails
      const message = `Olá, tenho interesse no ${vehicle.title} — ${window.location.origin}/vehicle/${vehicleId}`;
      const whatsappUrl = `https://wa.me/5562999999999?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        onLogin={() => {}}
        onLogout={logout}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Encontre o
            <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Carro Perfeito
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Milhares de veículos selecionados com qualidade garantida e as melhores condições de financiamento.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-accent hover:bg-accent-dark text-accent-foreground font-semibold px-8 py-6 text-lg shadow-strong hover:shadow-glow transition-all duration-300"
            onClick={() => document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Search className="w-5 h-5 mr-2" />
            Ver Veículos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
                <p className="text-muted-foreground font-medium">Veículos Vendidos</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">10+</h3>
                <p className="text-muted-foreground font-medium">Anos de Experiência</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-soft bg-gradient-card">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">98%</h3>
                <p className="text-muted-foreground font-medium">Clientes Satisfeitos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search & Vehicles Section */}
      <section id="vehicles" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Encontre Seu Próximo Carro
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Use nossos filtros avançados para encontrar exatamente o que você procura
            </p>
          </div>

          {/* Search Filters */}
          <SearchFilters 
            onFiltersChange={setFilters}
            className="mb-8"
          />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {pagination.total} veículos encontrados
              </Badge>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            /* Vehicle Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={{
                    id: vehicle.id,
                    title: vehicle.title,
                    price: vehicle.price,
                    year: vehicle.year,
                    mileage: vehicle.mileageKm,
                    fuel: vehicle.fuel,
                    transmission: vehicle.transmission,
                    color: vehicle.color,
                    location: vehicle.location,
                    description: vehicle.description,
                    images: vehicle.images?.map(img => img.url) || ["/placeholder.svg"],
                    features: [],
                    status: vehicle.status as any,
                    createdAt: vehicle.createdAt
                  }}
                  onWhatsAppClick={handleWhatsAppClick}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && vehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Nenhum veículo encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
