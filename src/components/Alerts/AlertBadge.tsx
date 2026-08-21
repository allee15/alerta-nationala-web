import type { AlertSeverity } from '../../services/alerts';
import styles from './AlertBadge.module.css';

const LABELS: Record<AlertSeverity, string> = {
  INFORMARE: 'Informare',
  ATENTIONARE: 'Atentionare',
  PERICOL: 'Pericol',
};

const CLASS_BY_SEVERITY: Record<AlertSeverity, string> = {
  INFORMARE: styles.informare,
  ATENTIONARE: styles.atentionare,
  PERICOL: styles.pericol,
};

export function AlertBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`${styles.badge} ${CLASS_BY_SEVERITY[severity]}`}>
      {LABELS[severity]}
    </span>
  );
}