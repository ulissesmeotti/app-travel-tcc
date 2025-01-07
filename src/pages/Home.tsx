import { MapPin, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../services/api'; // Função para buscar cidades na API do GeoNames
import { useTravelStore } from '../store';
import { City } from '../types';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const setCity = useTravelStore((state) => state.setCity);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchCities(query);
      setCities(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: City) => {
    setCity(city);
    navigate('/plan');
  };

  const closeModal = () => {
    setSelectedCity(null);
  };

  const cityDescriptions: { [key: string]: string } = {
    'Rio de Janeiro': 'O Rio de Janeiro é conhecido pelas suas belas praias, como Copacabana e Ipanema, além do famoso Cristo Redentor que fica no topo do Corcovado. A cidade oferece uma mistura de cultura, história e belezas naturais.',
    'São Paulo': 'São Paulo é a maior cidade do Brasil, conhecida pela sua vida agitada e pela culinária diversificada. A cidade também é um importante centro de negócios e arte, com museus e teatros renomados.',
    'Salvador': 'Salvador é famosa pelo seu patrimônio histórico e cultural, como o Pelourinho e o Elevador Lacerda. A cidade é um importante centro da cultura afro-brasileira e tem festas tradicionais como o Carnaval.',
    'Fortaleza': 'Fortaleza é conhecida por suas praias paradisíacas, como Jericoacoara e Canoa Quebrada. A cidade também é famosa pela sua culinária, com pratos típicos como a peixada cearense.',
    'Florianópolis': 'Florianópolis, ou "Ilha da Magia", é famosa pelas suas belas praias, além de uma vida noturna animada e uma ótima gastronomia. É o destino perfeito para quem busca lazer e natureza.',
    'Curitiba': 'Curitiba é conhecida pelo seu planejamento urbano, com parques e áreas verdes bem cuidadas. A cidade também tem um clima mais ameno e é considerada uma das melhores para se viver no Brasil.',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Planeje sua viagem perfeita no Brasil
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Selecione uma cidade para começar sua busca
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex shadow-sm rounded-md">
          <div className="relative flex-grow">
            <input
              type="text"
              className="block w-full rounded-l-md border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Buscar cidade no Brasil..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="h-5 w-5" />
            <span className="ml-2">Buscar</span>
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cidades encontradas</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city.geonameId}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                onClick={() => handleCitySelect(city)}
              >
                <h4 className="text-xl font-semibold text-gray-900">{city.name}</h4>
                <p className="text-sm text-gray-600">{city.adminName1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de descrição da cidade */}
      {selectedCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedCity}</h2>
            <p className="text-lg text-gray-700 mb-4">{cityDescriptions[selectedCity]}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
