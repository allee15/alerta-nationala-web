import { useState } from 'react';
import { poppins } from '../../styles/typography';
import { TextField } from '../TextField/TextField';
import { ZonesSelect } from '../Input/ZonesSelect';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { JUDETE_NAMES } from '../../data/judete';
import { createAlert, type AlertSeverity, type AlertType } from '../../services/alerts';
import styles from './AlertForm.module.css';

const TYPES: { value: AlertType; label: string }[] = [
  { value: 'CUTREMUR', label: 'Cutremur' },
  { value: 'INUNDATIE', label: 'Inundatie' },
  { value: 'INCENDIU', label: 'Incendiu' },
  { value: 'METEO_EXTREM', label: 'Fenomen meteo extrem' },
  { value: 'ALTA', label: 'Alta' },
];

const SEVERITIES: { value: AlertSeverity; label: string }[] = [
  { value: 'INFORMARE', label: 'Informare' },
  { value: 'ATENTIONARE', label: 'Atentionare' },
  { value: 'PERICOL', label: 'Pericol' },
];

export function AlertForm({ onCreated }: { onCreated: () => void }) {
  const [type, setType] = useState<AlertType>('CUTREMUR');
  const [severity, setSeverity] = useState<AlertSeverity>('INFORMARE');
  const [message, setMessage] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const [endsAt, setEndsAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!message.trim() || zones.length === 0 || !endsAt) {
      setError('Completeaza mesajul, zonele si perioada de valabilitate.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAlert({
        type,
        severity,
        message: message.trim(),
        zones,
        endsAt: new Date(endsAt).toISOString(),
      });
      setMessage('');
      setZones([]);
      setEndsAt('');
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea alertei.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.form}>
      <label style={poppins.regular(13)} className={styles.label}>
        Tip alerta
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as AlertType)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label style={poppins.regular(13)} className={styles.label}>
        Severitate
        <select
          className={styles.select}
          value={severity}
          onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
        >
          {SEVERITIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <TextField value={message} onChange={setMessage} placeholder="Mesajul catre populatie" />

      <ZonesSelect selectedZones={zones} onChange={setZones} zonesList={JUDETE_NAMES} />

      <label style={poppins.regular(13)} className={styles.label}>
        Valabila pana la
        <input
          type="datetime-local"
          className={styles.select}
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
        />
      </label>

      {error && (
        <p className={styles.error} style={poppins.regular(13)}>
          {error}
        </p>
      )}

      <PrimaryButton text="Emite alerta" isLoading={isSubmitting} onTap={() => void handleSubmit()} />
    </div>
  );
}