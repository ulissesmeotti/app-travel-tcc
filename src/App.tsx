import { Plane } from 'lucide-react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Hotel from './pages/Hotel';
import Login from './pages/Login';
import Register from './pages/Register';
import TravelPlan from './pages/TravelPlan';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Plane className="h-8 w-8 text-blue-600" />
                <Link to="/" className="ml-2 text-xl font-semibold text-gray-900">
                  Travel Planner
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<TravelPlan />} />
            <Route path="/hotels" element={<Hotel />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
