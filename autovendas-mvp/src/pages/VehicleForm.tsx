import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import apiService, { Vehicle } from "@/services/api";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Car, 
  Save,
  Eye,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const VehicleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = id !== "new";
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    year: new Date().getFullYear(),
    mileageKm: 0,
    fuel: "",
    transmission: "",
    color: "",
    location: "",
    plate: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SOLD"
  });

  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      loadVehicle(id);
    }
  }, [isEditing, id]);

  const loadVehicle = async (vehicleId: string) => {
    try {
      setLoadingVehicle(true);
      const response = await apiService.getVehicleById(vehicleId);
      const vehicle = response.vehicle;
      
      setFormData({
        title: vehicle.title,
        description: vehicle.description,
        price: vehicle.price,
        year: vehicle.year,
        mileageKm: vehicle.mileageKm,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        color: vehicle.color,
        location: vehicle.location,
        plate: vehicle.plate || "",
        status: vehicle.status
      });
      
      setImages(vehicle.images?.map(img => img.url) || []);
    } catch (error: any) {
      toast.error('Erro ao carregar veículo: ' + error.message);
      navigate('/dashboard');
    } finally {
      setLoadingVehicle(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Mock image upload - in real app, upload to server
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const vehicleData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        year: formData.year,
        mileageKm: formData.mileageKm,
        fuel: formData.fuel,
        transmission: formData.transmission,
        color: formData.color,
        location: formData.location,
        plate: formData.plate || undefined,
        status: formData.status
      };

      if (isEditing && id) {
        await apiService.updateVehicle(id, vehicleData);
        toast.success(`${formData.title} foi atualizado com sucesso!`);
      } else {
        await apiService.createVehicle(vehicleData);
        toast.success(`${formData.title} foi cadastrado com sucesso!`);
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar veículo');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link 
              to="/dashboard" 
              className="flex items-center text-muted-foreground hover:text-primary transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isEditing ? "Editar Veículo" : "Novo Veículo"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isEditing ? "Atualize as informações" : "Cadastre um novo veículo"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/vehicle/${id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loadingVehicle ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando veículo...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Título do Anúncio *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Honda Civic 2.0 EXL CVT"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-foreground">
                    Preço (R$) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="95000"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", Number(e.target.value))}
                    className="mt-1 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year" className="text-sm font-medium text-foreground">
                    Ano *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("year", Number(value))}>
                    <SelectTrigger className="mt-1 border-border/50 focus:border-primary">
                      <SelectValue placeholder={formData.year ? formData.year.toString() : "Selecione o ano"} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mileageKm" className="text-sm font-medium text-foreground">
                    Quilometragem (km) *
                  </Label>
                  <Input
                    id="mileageKm"
                    type="number"
                    placeholder="25000"
                    value={formData.mileageKm || ""}
                    onChange={(e) => handleInputChange("mileageKm", Number(e.target.value))}
                    className="mt-1 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="plate" className="text-sm font-medium text-foreground">
                    Placa (Opcional)
                  </Label>
                  <Input
                    id="plate"
                    placeholder="ABC1234"
                    value={formData.plate}
                    onChange={(e) => handleInputChange("plate", e.target.value.toUpperCase())}
                    className="mt-1 border-border/50 focus:border-primary"
                    maxLength={7}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Visível apenas para você. Formato: ABC1234 ou ABC1D23
                  </p>
                </div>

                <div>
                  <Label htmlFor="fuel" className="text-sm font-medium text-foreground">
                    Combustível *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("fuel", value)}>
                    <SelectTrigger className="mt-1 border-border/50 focus:border-primary">
                      <SelectValue placeholder={formData.fuel || "Selecione"} />
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

                <div>
                  <Label htmlFor="transmission" className="text-sm font-medium text-foreground">
                    Transmissão *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("transmission", value)}>
                    <SelectTrigger className="mt-1 border-border/50 focus:border-primary">
                      <SelectValue placeholder={formData.transmission || "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automática">Automática</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color" className="text-sm font-medium text-foreground">
                    Cor
                  </Label>
                  <Input
                    id="color"
                    placeholder="Ex: Branco Pérola"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="mt-1 border-border/50 focus:border-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-foreground">
                    Localização *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ex: São Paulo, SP"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="mt-1 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o veículo, estado de conservação, itens inclusos..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1 border-border/50 focus:border-primary min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="features" className="text-sm font-medium text-foreground">
                  Equipamentos (separados por vírgula)
                </Label>
                <Textarea
                  id="features"
                  placeholder="Ex: Central multimídia, Câmera de ré, Ar condicionado..."
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  className="mt-1 border-border/50 focus:border-primary"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => handleInputChange("status", checked)}
                />
                <Label htmlFor="status" className="text-sm font-medium text-foreground">
                  Anúncio ativo (visível no site)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-soft bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Fotos do Veículo
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Adicione até 10 fotos. A primeira foto será a capa do anúncio.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-dashed border-primary/30 hover:bg-primary/5"
                  disabled={images.length >= 10}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {images.length === 0 ? "Adicionar Fotos" : "Adicionar Mais"}
                </Button>
                <Badge variant="secondary">
                  {images.length}/10 fotos
                </Badge>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border border-border/50">
                        <img
                          src={image}
                          alt={`Foto ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute -top-2 -left-2 bg-accent text-accent-foreground">
                          Capa
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="border-2 border-dashed border-border/30 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhuma foto adicionada</p>
                  <p className="text-sm text-muted-foreground">
                    Adicione fotos para destacar seu veículo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.title || !formData.price}
              className="bg-gradient-primary hover:bg-primary-dark text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Atualizar Veículo" : "Cadastrar Veículo"}
                </>
              )}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default VehicleForm;