import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import StatsPage from './pages/StatsPage';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { Navbar } from './components/Navbar';

const navLinks = [
  { to: '/', label: 'Users' },
  { to: '/stats', label: 'Stats' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 font-sans text-white">
        <Navbar title="Dashboard" links={navLinks} />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
