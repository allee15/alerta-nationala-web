import styles from './Loader.module.css';

interface LoaderProps {
  size?: number;
}

export function Loader({ size = 24 }: LoaderProps) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
    />
  );
}