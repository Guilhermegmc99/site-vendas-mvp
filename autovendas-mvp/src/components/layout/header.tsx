import { Button } from "@/components/ui/button";
import { Car, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ isAuthenticated = false, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow group-hover:shadow-strong transition-all duration-300">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AutoVendas</h1>
            <p className="text-xs text-muted-foreground">Seu carro ideal</p>
          </div>
        </Link>


        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                asChild
                className="hover:bg-primary/5"
              >
                <Link to="/dashboard">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onLogout}
                className="border-primary/30 hover:bg-primary/5"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button 
              asChild
              className="bg-gradient-primary hover:bg-primary-dark transition-all duration-300 shadow-soft hover:shadow-glow"
              size="sm"
            >
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};