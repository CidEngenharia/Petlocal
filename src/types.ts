export interface User {
  id: number;
  email: string;
  role: 'owner' | 'provider';
  token?: string; // JWT token
}

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
  weight?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  contact?: string;
  vaccines?: Vaccine[];
  documents?: PetDocument[];
}

export interface Vaccine {
  id: number;
  petId: number;
  name: string;
  date: string;
  nextDue?: string;
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
}

export interface PetDocument {
  id: number;
  petId: number;
  type: 'RG' | 'BirthCert';
  status: 'pending' | 'paid' | 'issued';
}
