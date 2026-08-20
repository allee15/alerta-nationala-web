import { useRef, useState } from 'react';
import { poppins } from '../../styles/typography';
import { ZonesDropdownPanel } from './ZonesDropdownPanel';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './ZonesSelect.module.css';

interface IconProps {
  size: number;
  className?: string;
}

function MapPin({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronDown({ size, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface ZonesSelectProps {
  selectedZones: string[];
  onChange: (zones: string[]) => void;
  zonesList: string[];
  errorMessage?: string;
}

export function ZonesSelect({ selectedZones, onChange, zonesList, errorMessage }: ZonesSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      onChange(selectedZones.filter((z) => z !== zone));
    } else {
      onChange([...selectedZones, zone]);
    }
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div
        className={`${styles.fieldContainer} ${errorMessage ? styles.errorBorder : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MapPin size={22} className={styles.icon} />

        {selectedZones.length === 0 ? (
          <span style={poppins.regular(14)} className={styles.placeholder}>
            Selectează zonele
          </span>
        ) : (
          <div className={styles.selectedText}>
            <span style={poppins.regular(10)} className={styles.smallLabel}>
              Selectează zonele
            </span>
            <span style={poppins.regular(14)} className={styles.chips}>
              {selectedZones.join(', ')}
            </span>
          </div>
        )}

        <ChevronDown size={16} className={styles.chevron} />
      </div>

      {errorMessage && (
        <span className={styles.error} style={poppins.regular(12)}>
          {errorMessage}
        </span>
      )}

      {isOpen && (
        <ZonesDropdownPanel
          zonesList={zonesList}
          selectedZones={selectedZones}
          onToggleZone={toggleZone}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}