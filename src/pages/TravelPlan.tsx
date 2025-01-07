import { Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFlights } from '../services/api';
import { useTravelStore } from '../store';
import { Flight } from '../types';

export default function TravelPlan() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { plan, setFlight } = useTravelStore();
  const city = plan?.city;

  // Define um código IATA padrão caso não esteja disponível
  const defaultIata = "GRU";
  const cityIata = city?.iata || defaultIata;

  // Redireciona caso não tenha cidade selecionada
  useEffect(() => {
    if (!city) {
      navigate('/');
    }
  }, [city, navigate]);

  // Busca os voos com base na cidade ou código IATA padrão
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        const flightsData = await searchFlights(cityIata);
        setFlights(flightsData);
      } catch (err) {
        setError('Erro ao buscar voos. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [cityIata]);

  if (!city) {
    return null; // Evita renderizar caso não tenha cidade
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Erro</h1>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Escolha sua viagem para {city.name || 'sua cidade'}
        </h1>
        <p className="mt-2 text-gray-600">
          Selecione seu voo para {city.name || 'sua cidade'} e comece a sua jornada
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Plane className="h-5 w-5 mr-2" />
              Voos disponíveis
            </h2>
            <div className="space-y-4">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className={`p-4 rounded-lg border ${
                    plan.flight?.id === flight.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  } cursor-pointer hover:border-blue-500`}
                  onClick={() => setFlight(flight)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{flight.airline}</p>
                      <p className="text-sm text-gray-600">
                        {flight.departure || 'Desconhecido'} - {flight.arrival || 'Desconhecido'}
                      </p>
                    </div>
                    <p className="font-semibold text-lg">
                      ${flight.price ? flight.price.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Descrição da viagem
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Voo</h3>
                {plan.flight ? (
                  <p className="text-sm text-gray-600">
                    {plan.flight.airline} - ${plan.flight.price?.toFixed(2) || '0.00'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Nenhum voo selecionado</p>
                )}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Total</h3>
                  <p className="font-semibold text-xl">
                    ${plan.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
