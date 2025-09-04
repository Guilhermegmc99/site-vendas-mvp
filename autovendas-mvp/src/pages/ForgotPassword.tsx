import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock email sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSuccess(true);
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    });

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
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Esqueceu sua senha?
              </CardTitle>
              <p className="text-muted-foreground">
                Digite seu email para receber instruções de redefinição de senha
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {isSuccess ? (
                <Alert className="border-success/20 bg-success/5">
                  <AlertDescription className="text-success">
                    Email enviado com sucesso! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </AlertDescription>
                </Alert>
              ) : (
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:bg-primary-dark text-primary-foreground font-semibold py-6 shadow-soft hover:shadow-glow transition-all duration-300"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? "Enviando..." : "Enviar email de recuperação"}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Lembrou da senha?{" "}
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

export default ForgotPassword;