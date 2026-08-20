import { poppins } from '../../styles/typography';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import styles from './HomePage.module.css';

interface HomePageProps {
  onLogout: () => Promise<void>;
}

export function HomePage({ onLogout }: HomePageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 style={poppins.bold(32)}>Home</h1>
        <p style={poppins.regular(16)}>Autentificarea a fost realizată cu succes.</p>
        <div className={styles.actions}>
          <PrimaryButton text="Logout" onTap={() => void onLogout()} />
        </div>
      </section>
    </main>
  );
}
