import { Car, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AutoVendas</h3>
                <p className="text-sm text-primary-foreground/80">Seu carro ideal</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Há mais de 10 anos conectando pessoas aos seus carros dos sonhos. 
              Qualidade, confiança e transparência em cada negócio.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">
                  Av. T-4, 1000 - Setor Bueno, Goiânia - GO
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">
                  (62) 99999-9999
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">
                  contato@autovendas.com
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Horário de Funcionamento</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary-foreground/60" />
                <div className="text-sm text-primary-foreground/80">
                  <div>Segunda à Sexta</div>
                  <div>08:00 às 18:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary-foreground/60" />
                <div className="text-sm text-primary-foreground/80">
                  <div>Sábados</div>
                  <div>08:00 às 14:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 AutoVendas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};