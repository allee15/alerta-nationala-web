import { useEffect, useState } from 'react';
import { poppins } from '../../styles/typography';
import { AlertBadge } from './AlertBadge';
import { AlertDetail } from './AlertDetail';
import { fetchAlerts, type Alert } from '../../services/alerts';
import styles from './AlertsList.module.css';

const TYPE_LABELS: Record<string, string> = {
  CUTREMUR: 'Cutremur',
  INUNDATIE: 'Inundatie',
  INCENDIU: 'Incendiu',
  METEO_EXTREM: 'Fenomen meteo extrem',
  ALTA: 'Alta',
};

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la incarcarea alertelor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (isLoading) {
    return <p style={poppins.regular(14)}>Se incarca alertele...</p>;
  }

  if (error) {
    return (
      <p style={poppins.regular(14)} className={styles.error}>
        {error}
      </p>
    );
  }

  if (alerts.length === 0) {
    return <p style={poppins.regular(14)}>Nu exista alerte create inca.</p>;
  }

  return (
    <div className={styles.layout}>
      <ul className={styles.list}>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <button
              type="button"
              className={`${styles.item} ${selectedId === alert.id ? styles.itemActive : ''}`}
              onClick={() => setSelectedId(alert.id)}
            >
              <div className={styles.itemHeader}>
                <span style={poppins.semiBold(14)}>{TYPE_LABELS[alert.type] ?? alert.type}</span>
                <AlertBadge severity={alert.severity} />
              </div>
              <p style={poppins.regular(13)} className={styles.itemMessage}>
                {alert.message}
              </p>
              <span style={poppins.regular(12)} className={styles.itemStatus}>
                {alert.status === 'ACTIVE' ? 'Activa' : 'Incheiata'} · {alert.zones.join(', ')}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {selectedId && (
        <AlertDetail alertId={selectedId} onEnded={() => void load()} />
      )}
    </div>
  );
}