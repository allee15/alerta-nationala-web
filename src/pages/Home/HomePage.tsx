import { poppins } from '../../styles/typography';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 style={poppins.bold(32)}>Home</h1>
        <p style={poppins.regular(16)}>Autentificarea a fost realizată cu succes.</p>
      </section>
    </main>
  );
}
