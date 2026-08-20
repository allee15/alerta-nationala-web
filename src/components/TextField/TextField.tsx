import { useState } from 'react';
import { poppins } from '../../styles/typography';
import styles from './TextField.module.css';

const Eye = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-4.147 5.186" />
    <path d="M6.61 6.61a10.75 10.75 0 0 0-4.548 5.041 1 1 0 0 0 0 .696 10.75 10.75 0 0 0 15.113 5.186" />
    <path d="M2 2l20 20" />
    <path d="M10.584 10.587a2 2 0 0 0 2.828 2.828" />
  </svg>
);

const X = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  secureField?: boolean;
  type?: 'text' | 'email' | 'number';
  leftIcon?: React.ReactNode;
  clearable?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

export function TextField({
  value,
  onChange,
  placeholder,
  secureField = false,
  type = 'text',
  leftIcon,
  clearable = false,
  errorMessage,
  isDisabled = false,
}: TextFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFloating = value.length > 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.fieldContainer}
          ${isEditing ? styles.editing : ''}
          ${errorMessage ? styles.errorBorder : ''}
          ${isDisabled ? styles.disabled : ''}`}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}

        <div className={styles.inputArea}>
          <span
            className={`${styles.placeholder} ${isFloating ? styles.floating : ''}`}
            style={poppins.regular(isFloating ? 10 : 14)}
          >
            {placeholder}
          </span>
          <input
            type={secureField && !isVisible ? 'password' : type}
            value={value}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className={styles.input}
            style={poppins.regular(14)}
          />
        </div>

        {secureField && (
          <button
            type="button"
            className={styles.trailingIcon}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {!secureField && clearable && value.length > 0 && (
          <button
            type="button"
            className={styles.trailingIcon}
            onClick={() => onChange('')}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {errorMessage && (
        <span className={styles.error} style={poppins.regular(12)}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}