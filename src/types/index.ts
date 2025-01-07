export interface User {
  id: string;
  email: string;
}

export interface City {
  id: string;
  adminName1: string;
  name: string;
  geonameId: number;
  countryName: string;
  state: string;
  lat: number;
  lng: number;
  image_url: string;
  iataCode: string;
  iata: string;
}


export interface Flight {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  airline: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  price_per_night: number;
  image_url: string;
  location: string;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
}

export interface TravelPlan {
  city: City | null;
  flight: Flight | null;
  hotel: Hotel | null;
  tours: Tour[];
  totalPrice: number;
}