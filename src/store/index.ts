import { create } from 'zustand';
import { TravelPlan } from '../types';

interface TravelStore {
  plan: TravelPlan;
  setCity: (city: TravelPlan['city']) => void;
  setFlight: (flight: TravelPlan['flight']) => void;
  setHotel: (hotel: TravelPlan['hotel']) => void;
  addTour: (tour: Tour) => void;
  removeTour: (tourId: string) => void;
  calculateTotal: () => void;
}

export const useTravelStore = create<TravelStore>((set, get) => ({
  plan: {
    city: null,
    flight: null,
    hotel: null,
    tours: [],
    totalPrice: 0,
  },
  setCity: (city) => set((state) => ({ plan: { ...state.plan, city } })),
  setFlight: (flight) => set((state) => ({ plan: { ...state.plan, flight } })),
  setHotel: (hotel) => set((state) => ({ plan: { ...state.plan, hotel } })),
  addTour: (tour) =>
    set((state) => ({
      plan: { ...state.plan, tours: [...state.plan.tours, tour] },
    })),
  removeTour: (tourId) =>
    set((state) => ({
      plan: {
        ...state.plan,
        tours: state.plan.tours.filter((t) => t.id !== tourId),
      },
    })),
  calculateTotal: () =>
    set((state) => ({
      plan: {
        ...state.plan,
        totalPrice:
          (state.plan.flight?.price || 0) +
          (state.plan.hotel?.price_per_night || 0) * 7 +
          state.plan.tours.reduce((acc, tour) => acc + tour.price, 0),
      },
    })),
}));