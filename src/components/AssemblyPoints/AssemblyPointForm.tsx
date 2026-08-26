import { useEffect, useState } from 'react';
import { poppins } from '../../styles/typography';
import { TextField } from '../TextField/TextField';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { JUDETE_NAMES } from '../../data/judete';
import type { AssemblyPoint, CreateAssemblyPointPayload } from '../../services/assemblyPoints';
import styles from './AssemblyPointForm.module.css';

interface AssemblyPointFormProps {
  editingPoint: AssemblyPoint | null;
  coordinates: { lat: number; lng: number } | null;
  onSubmit: (payload: CreateAssemblyPointPayload) => Promise<void>;
  onCancel: () => void;
}

export function AssemblyPointForm({
  editingPoint,
  coordinates,
  onSubmit,
  onCancel,
}: AssemblyPointFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState(JUDETE_NAMES[0]);
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPoint) {
      setName(editingPoint.name);
      setAddress(editingPoint.address);
      setZone(editingPoint.zone);
      setCapacity(editingPoint.capacity ? String(editingPoint.capacity) : '');
    } else {
      setName('');
      setAddress('');
      setZone(JUDETE_NAMES[0]);
      setCapacity('');
    }
  }, [editingPoint]);

  const handleSubmit = async () => {
    setError(null);

    const lat = editingPoint?.lat ?? coordinates?.lat;
    const lng = editingPoint?.lng ?? coordinates?.lng;

    if (!name.trim() || !address.trim() || lat === undefined || lng === undefined) {
      setError('Completeaza numele, adresa si selecteaza o pozitie pe harta.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim(),
        zone,
        lat,
        lng,
        capacity: capacity ? Number(capacity) : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2 style={poppins.semiBold(16)}>
        {editingPoint ? 'Editeaza punctul de adunare' : 'Punct de adunare nou'}
      </h2>

      <p style={poppins.regular(12)} className={styles.hint}>
        {editingPoint
          ? `Pozitie: ${editingPoint.lat.toFixed(4)}, ${editingPoint.lng.toFixed(4)}`
          : coordinates
            ? `Pozitie selectata: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
            : 'Apasa pe harta pentru a alege pozitia.'}
      </p>

      <TextField value={name} onChange={setName} placeholder="Nume (ex: Scoala Nr. 5)" />
      <TextField value={address} onChange={setAddress} placeholder="Adresa" />

      <label style={poppins.regular(13)} className={styles.label}>
        Judet
        <select className={styles.select} value={zone} onChange={(e) => setZone(e.target.value)}>
          {JUDETE_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <TextField value={capacity} onChange={setCapacity} placeholder="Capacitate (optional)" />

      {error && (
        <p className={styles.error} style={poppins.regular(13)}>
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <PrimaryButton
          text={editingPoint ? 'Salveaza' : 'Creeaza'}
          isLoading={isSubmitting}
          onTap={() => void handleSubmit()}
        />
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Anuleaza
        </button>
      </div>
    </div>
  );
}