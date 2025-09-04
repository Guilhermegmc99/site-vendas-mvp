import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>

          <Card className="border-0 shadow-strong bg-gradient-card">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 bg-gradient-primary rounded-2xl w-fit">
                <Car className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Entrar na Plataforma
              </CardTitle>
              <p className="text-muted-foreground">
                Acesse sua conta para gerenciar veículos
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
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-primary-dark text-primary-foreground font-semibold py-6 shadow-soft hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link 
                      to="/register" 
                      className="text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;