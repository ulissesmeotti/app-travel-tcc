import axios from 'axios';
import { Hotel, Tour } from '../types';

const api = axios.create({
  baseURL: '/api',
});

//start api city
const GEONAMES_USERNAME = 'ulisses';

export const searchCities = async (query: string) => {
  try {
    const response = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        q: query,
        maxRows: 12,
        country: 'BR',
        username: GEONAMES_USERNAME,
      },
    });

    const cities = response.data.geonames.map((city: any) => ({
      name: city.name,
      geonameId: city.geonameId,
      countryName: city.countryName,
      state: city.adminName1 || city.adminName2 || city.adminName3 || 'Estado não disponível',
      lat: city.lat,
      lng: city.lng,
      image_url: `https://www.geonames.org/img/country/BR.png`,
    }));

    return cities;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw new Error('Não foi possível buscar as cidades.');
  }
};
//end api city

//start api flights
const API_KEY = '21bfda38cc2bd55d396ef02829c7f8a9';
const BASE_URL = 'http://api.aviationstack.com/v1/flights';

export const searchFlights = async (iataCode: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        dep_iata: iataCode,
        flight_status: 'scheduled',
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching flights:', error.response?.data || error.message);
    throw new Error('Failed to fetch flights');
  }
};
//end api flights

//start api hotels
const hotelsApi = axios.create({
  baseURL: 'https://hotels-com-provider.p.rapidapi.com/v2',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_HOTELS_API_KEY,
    'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
  }
});

export const searchHotels = async (cityId: string): Promise<Hotel[]> => {
  try {
    const { data } = await hotelsApi.get('/hotels/search', {
      params: {
        region_id: cityId,
        locale: 'pt_BR',
        checkin_date: new Date().toISOString().split('T')[0],
        checkout_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adults_number: 1,
        currency: 'BRL',
        sort_order: 'PRICE',
        page_number: 1
      }
    });

    return data.properties.map((property: any) => ({
      id: property.id,
      name: property.name,
      rating: Math.round(property.star_rating || 0),
      price_per_night: property.price.lead.amount,
      image_url: property.property_gallery?.images[0]?.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      location: property.neighborhood_name || property.address.city
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
};

//end api hotels

//start api tours
export const searchTours = async (cityId: number): Promise<Tour[]> => {
  // TODO: Implement with real tours API (e.g., Viator or GetYourGuide)
  return api.get(`/tours?city=${cityId}`);
};
//end api