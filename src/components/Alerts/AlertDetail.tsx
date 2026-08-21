import { useEffect, useState } from 'react';
import { poppins } from '../../styles/typography';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { endAlert, fetchAlertStats, type AlertStats } from '../../services/alerts';
import styles from './AlertDetail.module.css';

export function AlertDetail({ alertId, onEnded }: { alertId: string; onEnded: () => void }) {
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAlertStats(alertId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la incarcarea detaliilor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertId]);

  const handleEnd = async () => {
    setIsEnding(true);
    try {
      await endAlert(alertId);
      onEnded();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la incheierea alertei.');
    } finally {
      setIsEnding(false);
    }
  };

  if (isLoading) {
    return <p style={poppins.regular(14)}>Se incarca...</p>;
  }

  if (error) {
    return (
      <p style={poppins.regular(14)} className={styles.error}>
        {error}
      </p>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <h2 style={poppins.semiBold(18)}>Confirmari</h2>
      <p style={poppins.regular(14)}>
        {stats.totalCheckins} din {stats.eligibleUsers} cetateni au confirmat (
        {Math.round(stats.rate * 100)}%)
      </p>

      <div className={styles.action}>
        <PrimaryButton text="Incheie alerta" isLoading={isEnding} onTap={() => void handleEnd()} />
      </div>

      <ul className={styles.checkinsList}>
        {stats.checkins.map((c) => (
          <li key={c.userId} style={poppins.regular(13)}>
            {c.email ?? c.userId} — {new Date(c.clientTimestamp).toLocaleString('ro-RO')}
          </li>
        ))}
        {stats.checkins.length === 0 && (
          <li style={poppins.regular(13)}>Niciun check-in inca.</li>
        )}
      </ul>
    </div>
  );
}