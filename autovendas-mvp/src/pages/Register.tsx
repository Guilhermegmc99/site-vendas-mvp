import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Conta criada com sucesso!",
      description: "Bem-vindo ao AutoVendas. Você já pode fazer login.",
    });
    
    navigate("/login");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao login
          </Link>

          <Card className="border-0 shadow-strong bg-gradient-card">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 bg-gradient-primary rounded-2xl w-fit">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Criar Conta
              </CardTitle>
              <p className="text-muted-foreground">
                Cadastre-se para acessar a plataforma
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-border/50 focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border-border/50 focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-primary-dark text-primary-foreground font-semibold py-6 shadow-soft hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;