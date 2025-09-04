export interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  location: string;
  description: string;
  images: string[];
  features: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    title: "Honda Civic 2.0 EXL CVT",
    price: 95000,
    year: 2022,
    mileage: 25000,
    fuel: "Flex",
    transmission: "CVT",
    color: "Branco Pérola",
    location: "São Paulo, SP",
    description: "Honda Civic em excelente estado de conservação. Único dono, sempre revisado na concessionária. Veículo impecável, sem detalhes.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    features: [
      "Central multimídia",
      "Câmera de ré",
      "Sensores de estacionamento",
      "Ar condicionado digital",
      "Bancos em couro",
      "Rodas de liga leve"
    ],
    status: "active",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Toyota Corolla XEi 2.0 Automático",
    price: 89000,
    year: 2021,
    mileage: 35000,
    fuel: "Flex",
    transmission: "Automática",
    color: "Prata",
    location: "Rio de Janeiro, RJ",
    description: "Toyota Corolla XEi em perfeito estado. Revisões em dia, pneus novos, documento ok. Pronto para financiamento.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    features: [
      "Central multimídia Toyota",
      "Piloto automático",
      "Faróis de LED",
      "Ar condicionado automático",
      "Bancos elétricos",
      "Sistema de segurança Toyota Safety Sense"
    ],
    status: "active",
    createdAt: "2024-01-14T15:30:00Z"
  },
  {
    id: "3",
    title: "Volkswagen Jetta TSI 1.4 Turbo",
    price: 72000,
    year: 2020,
    mileage: 45000,
    fuel: "Gasolina",
    transmission: "Automática",
    color: "Azul Noturno",
    location: "Belo Horizonte, MG",
    description: "Jetta TSI com motor turbo, economia de combustível e performance. Veículo bem cuidado, interior impecável.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    features: [
      "Motor 1.4 TSI Turbo",
      "Central multimídia VW",
      "Teto solar",
      "Controle de tração",
      "Freios ABS",
      "6 airbags"
    ],
    status: "active",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    title: "Hyundai HB20S 1.6 Comfort Plus",
    price: 58000,
    year: 2021,
    mileage: 28000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Vermelho",
    location: "Porto Alegre, RS",
    description: "HB20S sedã em excelente estado. Econômico, confiável e espaçoso. Ideal para família.",
    images: [
      "/placeholder.svg"
    ],
    features: [
      "Direção elétrica",
      "Ar condicionado",
      "Vidros elétricos",
      "Travas elétricas",
      "Som com Bluetooth",
      "Computador de bordo"
    ],
    status: "active",
    createdAt: "2024-01-12T14:20:00Z"
  },
  {
    id: "5",
    title: "Ford Ka SE 1.0 3 Cilindros",
    price: 42000,
    year: 2019,
    mileage: 38000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco",
    location: "Salvador, BA",
    description: "Ford Ka SE em ótimo estado de conservação. Econômico e ágil para o dia a dia urbano.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    features: [
      "Motor 1.0 Dragon",
      "Central multimídia SYNC",
      "Ar condicionado",
      "Direção elétrica",
      "Faróis de neblina",
      "Controle de estabilidade"
    ],
    status: "active",
    createdAt: "2024-01-11T11:45:00Z"
  },
  {
    id: "6",
    title: "Chevrolet Onix Plus LTZ 1.0 Turbo",
    price: 68000,
    year: 2022,
    mileage: 18000,
    fuel: "Flex",
    transmission: "Automática",
    color: "Cinza",
    location: "Brasília, DF",
    description: "Onix Plus LTZ top de linha, motor turbo, baixa quilometragem. Carro novo, garantia de fábrica.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    features: [
      "Motor 1.0 Turbo",
      "MyLink com Android Auto",
      "Ar condicionado automático",
      "Câmera de ré",
      "Sensores de estacionamento",
      "Partida sem chave"
    ],
    status: "active",
    createdAt: "2024-01-10T16:00:00Z"
  }
];

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

export const searchVehicles = (query: string): Vehicle[] => {
  const lowerQuery = query.toLowerCase();
  return mockVehicles.filter(vehicle => 
    vehicle.title.toLowerCase().includes(lowerQuery) ||
    vehicle.description.toLowerCase().includes(lowerQuery) ||
    vehicle.location.toLowerCase().includes(lowerQuery)
  );
};