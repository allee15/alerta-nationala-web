import { poppins } from '../../styles/typography';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import {
  AlertTriangleIcon,
  HomeIcon,
  LogoutIcon,
  MapPinIcon,
} from '../../components/Icons';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import styles from './HomePage.module.css';

interface HomePageProps {
  onLogout: () => Promise<void>;
  currentPath: '/home' | '/zones' | '/alerts/new';
  onNavigate: (path: '/home' | '/zones' | '/alerts/new') => void;
}

type HomeSection = 'alerts' | 'zones' | 'new-alert';

export function HomePage({ onLogout, currentPath, onNavigate }: HomePageProps) {
  const activeSection: HomeSection =
    currentPath === '/zones' ? 'zones' : currentPath === '/alerts/new' ? 'new-alert' : 'alerts';

  const contentBySection: Record<HomeSection, { title: string; subtitle: string }> = {
    alerts: {
      title: 'Alerte active',
      subtitle: 'Aici va aparea lista alertelor active si istoricul trimiterilor recente.',
    },
    zones: {
      title: 'Puncte de adunare',
      subtitle: 'Aici poti vizualiza si administra punctele de adunare din zonele monitorizate.',
    },
    'new-alert': {
      title: 'Alerta noua',
      subtitle: 'Aici va fi formularul pentru crearea si trimiterea unei alerte noi.',
    },
  };

  const currentContent = contentBySection[activeSection];

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.sidebar}>
          <header className={styles.brand} style={poppins.semiBold(16)}>
            <AlertTriangleIcon size={20} />
            <span>Alerta Nationala</span>
          </header>

          <nav className={styles.navigation} aria-label="Navigare principala">
            <button
              className={`${styles.navItem} ${activeSection === 'alerts' ? styles.navItemActive : ''}`}
              type="button"
              onClick={() => onNavigate('/home')}
            >
              <HomeIcon size={18} />
              <span style={poppins.regular(14)}>Acasa</span>
            </button>
            <button
              className={`${styles.navItem} ${activeSection === 'zones' ? styles.navItemActive : ''}`}
              type="button"
              onClick={() => onNavigate('/zones')}
            >
              <MapPinIcon size={18} />
              <span style={poppins.regular(14)}>Puncte de adunare</span>
            </button>
          </nav>

          <div className={styles.newAlertAction}>
            <PrimaryButton text="Alerta noua" onTap={() => onNavigate('/alerts/new')} />
          </div>

          <div className={styles.sidebarBottom}>
            <button className={styles.logoutButton} type="button" onClick={() => void onLogout()}>
              <LogoutIcon size={17} />
              <span style={poppins.regular(13)}>Logout</span>
            </button>

            <div className={styles.themeRow}>
              <span style={poppins.regular(13)} className={styles.themeLabel}>
                Tema
              </span>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <h1 style={poppins.semiBold(24)} className={styles.title}>
            {currentContent.title}
          </h1>
          <p style={poppins.regular(14)} className={styles.subtitle}>
            {currentContent.subtitle}
          </p>
        </section>
      </section>
    </main>
  );
}
