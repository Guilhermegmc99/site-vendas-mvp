import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import apiService, { Vehicle } from "@/services/api";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Car, 
  TrendingUp, 
  Users, 
  MessageCircle,
  MoreHorizontal,
  LogOut,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalViews: 0,
    leadsGenerated: 0
  });
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadVehicles();
    loadStats();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVehicles({
        search: searchTerm
      });
      setVehicles(response.vehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getLeadStats();
      setStats({
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'ACTIVE').length,
        totalViews: 0, // TODO: Implementar contador de views
        leadsGenerated: response.stats.totalLeads
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadVehicles();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleDeleteVehicle = async (vehicleId: string, vehicleTitle: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${vehicleTitle}"?`)) {
      return;
    }

    try {
      await apiService.deleteVehicle(vehicleId);
      toast.success(`${vehicleTitle} foi removido com sucesso.`);
      loadVehicles(); // Recarregar lista
      loadStats(); // Atualizar estatísticas
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir veículo');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Painel do Vendedor</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-primary/30 hover:bg-primary/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-muted-foreground">
            Gerencie seus veículos e acompanhe suas vendas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Veículos</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalVehicles}</p>
                </div>
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Car className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeVehicles}</p>
                </div>
                <div className="p-3 bg-gradient-accent rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Visualizações</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalViews}</p>
                </div>
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Leads</p>
                  <p className="text-2xl font-bold text-foreground">{stats.leadsGenerated}</p>
                </div>
                <div className="p-3 bg-gradient-accent rounded-lg">
                  <MessageCircle className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Management */}
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                Meus Veículos
              </CardTitle>
              <Button 
                asChild
                className="bg-gradient-primary hover:bg-primary-dark text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <Link to="/dashboard/vehicle/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Veículo
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar veículos..."
                className="pl-10 border-border/50 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando veículos...</span>
              </div>
            ) : (
              /* Vehicle List */
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={vehicle.images?.[0]?.url || "/placeholder.svg"}
                      alt={vehicle.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{vehicle.title}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                      {vehicle.plate && (
                        <p className="text-xs text-muted-foreground">Placa: {vehicle.plate}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={vehicle.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className={vehicle.status === 'ACTIVE' ? 'bg-success text-success-foreground' : ''}
                        >
                          {vehicle.status === 'ACTIVE' ? 'Ativo' : vehicle.status === 'SOLD' ? 'Vendido' : 'Inativo'}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          {formatPrice(vehicle.price)}
                        </span>
                        {vehicle._count?.leads && vehicle._count.leads > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {vehicle._count.leads} leads
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/vehicle/${vehicle.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/vehicle/${vehicle.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteVehicle(vehicle.id, vehicle.title)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                ))}

                {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum veículo encontrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "Tente ajustar sua busca" : "Comece cadastrando seu primeiro veículo"}
                  </p>
                  <Button asChild className="bg-gradient-primary hover:bg-primary-dark">
                    <Link to="/dashboard/vehicle/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Veículo
                    </Link>
                  </Button>
                </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;