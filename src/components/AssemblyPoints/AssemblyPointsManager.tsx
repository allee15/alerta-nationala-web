import { useEffect, useState } from 'react';
import { poppins } from '../../styles/typography';
import { AssemblyPointsMap } from './AssemblyPointsMap';
import { AssemblyPointForm } from './AssemblyPointForm';
import {
  createAssemblyPoint,
  fetchAssemblyPoints,
  setAssemblyPointActive,
  updateAssemblyPoint,
  type AssemblyPoint,
  type CreateAssemblyPointPayload,
} from '../../services/assemblyPoints';
import styles from './AssemblyPointsManager.module.css';

export function AssemblyPointsManager() {
  const [points, setPoints] = useState<AssemblyPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPoint, setEditingPoint] = useState<AssemblyPoint | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAssemblyPoints();
      setPoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la incarcarea punctelor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (editingPoint) {
      return; 
    }
    setIsCreating(true);
    setPendingCoordinates({ lat, lng });
  };

  const handleSubmit = async (payload: CreateAssemblyPointPayload) => {
    if (editingPoint) {
      await updateAssemblyPoint(editingPoint.id, payload);
    } else {
      await createAssemblyPoint(payload);
    }
    setEditingPoint(null);
    setIsCreating(false);
    setPendingCoordinates(null);
    await load();
  };

  const handleToggleActive = async (point: AssemblyPoint) => {
    await setAssemblyPointActive(point.id, !point.isActive);
    await load();
  };

  const handleCancel = () => {
    setEditingPoint(null);
    setIsCreating(false);
    setPendingCoordinates(null);
  };

  if (isLoading) {
    return <p style={poppins.regular(14)}>Se incarca punctele de adunare...</p>;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.mapColumn}>
        {error && (
          <p style={poppins.regular(13)} className={styles.error}>
            {error}
          </p>
        )}
        <p style={poppins.regular(13)} className={styles.hint}>
          Apasa pe harta pentru a adauga un punct nou.
        </p>

        <AssemblyPointsMap
          points={points}
          onSelect={(point) => {
            setEditingPoint(point);
            setIsCreating(false);
            setPendingCoordinates(null);
          }}
          onMapClick={handleMapClick}
          pendingMarker={pendingCoordinates}
        />

        <ul className={styles.list}>
          {points.map((point) => (
            <li key={point.id} className={styles.listItem}>
              <div>
                <span style={poppins.semiBold(13)}>{point.name}</span>
                <span style={poppins.regular(12)} className={styles.listSub}>
                  {' '}
                  · {point.zone} · {point.isActive ? 'Activ' : 'Dezactivat'}
                </span>
              </div>
              <div className={styles.listActions}>
                <button type="button" onClick={() => setEditingPoint(point)}>
                  Editeaza
                </button>
                <button type="button" onClick={() => void handleToggleActive(point)}>
                  {point.isActive ? 'Dezactiveaza' : 'Activeaza'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {(isCreating || editingPoint) && (
        <AssemblyPointForm
          editingPoint={editingPoint}
          coordinates={pendingCoordinates}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}