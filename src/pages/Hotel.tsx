import { Hotel as HotelIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchHotels } from '../services/api';
import { useTravelStore } from '../store';
import { Hotel } from '../types';

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { plan, setHotel } = useTravelStore();

  useEffect(() => {
    if (!plan.city) {
      navigate('/');
      return;
    }

    const fetchHotels = async () => {
      try {
        const results = await searchHotels(String(plan.city!.id));
        setHotels(results);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [plan.city, navigate]);

  const handleHotelSelect = (hotel: Hotel) => {
    setHotel(hotel);
    navigate('/plan');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <HotelIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hotels in {plan.city?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Select your preferred accommodation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => handleHotelSelect(hotel)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                <div className="flex items-center">
                  {Array.from({ length: hotel.rating }).map((_, index) => (
                    <span key={index} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 mb-4">{hotel.location}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {hotel.price_per_night.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}