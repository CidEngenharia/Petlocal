export interface User {
  id: number;
  email: string;
  role: 'owner' | 'provider' | 'global_admin';
  photoUrl?: string;
  token?: string; // JWT token
}

export interface AdminData {
  stats: {
    users: number;
    pets: number;
    services: number;
    accessories: number;
    documents: number;
  };
  data: {
    pets: any[];
    services: any[];
    accessories: any[];
    users: any[];
  };
}

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
  ownerPhotoUrl?: string;
  weight?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  contact?: string;
  intent: 'none' | 'adoption' | 'sale' | 'breeding' | 'registrado' | 'lost' | 'found' | 'deceased';
  intentDescription?: string;
  vaccines?: Vaccine[];
  documents?: PetDocument[];
  owner?: {
    photoUrl?: string;
    email?: string;
  };
}

export interface Vaccine {
  id: number;
  petId: number;
  name: string;
  date: string;
  nextDue?: string;
}

export interface ServiceReview {
  id: number;
  serviceId: number;
  userId: number;
  rating: number;
  createdAt: string;
  user?: { email: string; photoUrl?: string };
}

export interface ServiceComment {
  id: number;
  serviceId: number;
  userId: number;
  text: string;
  createdAt: string;
  user?: { email: string; photoUrl?: string };
}

export interface Service {
  id: number;
  providerId: number;
  type: 'trainer' | 'hotel' | 'vet' | 'petsitter';
  name: string;
  description?: string;
  price: number;
  location?: string;
  whatsapp?: string;
  instagram?: string;
  photoUrl?: string;
  avgRating?: number;
  reviewCount?: number;
  reviews?: ServiceReview[];
  comments?: ServiceComment[];
}

export interface PetDocument {
  id: number;
  petId: number;
  type: 'RG' | 'BirthCert';
  status: 'pending' | 'paid' | 'issued';
}

export interface Accessory {
  id: number;
  ownerId: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  photoUrl?: string;
}
