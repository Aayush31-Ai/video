import { Link, useLocation } from 'react-router-dom';
import { Home, Video } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Home size={20} />
          </div>
          <span className={styles.logoText}>WalkThru</span>
          <span className={styles.logoBadge}>AI</span>
        </Link>

        <div className={styles.links}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className={`${styles.navLink} ${location.pathname === '/generate' ? styles.active : ''}`}
          >
            Generator
          </Link>
        </div>

        <Link to="/generate" className={styles.ctaButton}>
          <Video size={16} />
          <span>Generate</span>
        </Link>
      </div>
    </nav>
  );
}
