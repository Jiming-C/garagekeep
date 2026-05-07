import { NavLink, Link } from 'react-router-dom';
import s from './Nav.module.css';

export default function Nav() {
  return (
    <header className={s.nav}>
      <Link to="/" className={s.wordmark}>GarageKeep</Link>
      <nav className={s.links} aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
          Garage
        </NavLink>
        <NavLink to="/cars/new" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
          Add car
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
