import { poppins } from '../../styles/typography';
import styles from './ZonesDropdownPanel.module.css';

interface ZonesDropdownPanelProps {
  zonesList: string[];
  selectedZones: string[];
  onToggleZone: (zone: string) => void;
  onClose: () => void;
}

export function ZonesDropdownPanel({ zonesList, selectedZones, onToggleZone, onClose }: ZonesDropdownPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.list}>
        {zonesList.map((zone) => {
          const isSelected = selectedZones.includes(zone);
          return (
            <div
              key={zone}
              className={styles.row}
              onClick={() => onToggleZone(zone)}
            >
              <span style={poppins.regular(15)} className={styles.zoneText}>
                {zone}
              </span>
              <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>
                {isSelected && <span style={{ color: 'white', fontSize: 14, lineHeight: 1 }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      <button className={styles.doneButton} style={poppins.semiBold(14)} onClick={onClose}>
        Gata
      </button>
    </div>
  );
}