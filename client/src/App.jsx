import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Garage from './pages/Garage.jsx';
import CarDetail from './pages/CarDetail.jsx';
import AddCar from './pages/AddCar.jsx';
import EditCar from './pages/EditCar.jsx';
import LogService from './pages/LogService.jsx';
import About from './pages/About.jsx';

export default function App() {
  const location = useLocation();
  return (
    <>
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Garage />} />
          <Route path="/cars/new" element={<AddCar />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/cars/:id/edit" element={<EditCar />} />
          <Route path="/cars/:id/services/new" element={<LogService />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function NotFound() {
  return (
    <main className="page">
      <p className="eyebrow">404</p>
      <h1 className="display-l">Nothing here.</h1>
    </main>
  );
}
