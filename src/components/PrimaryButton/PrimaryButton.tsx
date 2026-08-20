import { poppins } from '../../styles/typography';
import { Loader } from '../Loader/Loader';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  text: string;
  icon?: React.ReactNode;
  displayIconInRight?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onTap: () => void;
}

export function PrimaryButton({
  text,
  icon,
  displayIconInRight = false,
  isDisabled = false,
  isLoading = false,
  onTap,
}: PrimaryButtonProps) {
  const handleClick = () => {
    if (!isLoading) {
      onTap();
    }
  };

  return (
    <button
      className={`${styles.button} ${isDisabled ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? (
        <Loader size={24} />
      ) : (
        <div className={styles.content}>
          {icon && !displayIconInRight && <span className={styles.icon}>{icon}</span>}
          <span style={poppins.regular(16)} className={styles.text}>
            {text}
          </span>
          {icon && displayIconInRight && <span className={styles.icon}>{icon}</span>}
        </div>
      )}
    </button>
  );
}