import { FormEvent, useState } from 'react';
import { MailIcon, LockIcon } from '../../components/Icons';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { TextField } from '../../components/TextField/TextField';
import { poppins } from '../../styles/typography';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'Adresa de email este obligatorie.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Introdu o adresă de email validă.';
  }

  if (!password) {
    errors.password = 'Parola este obligatorie.';
  } else if (password.length < 6) {
    errors.password = 'Parola trebuie să aibă cel puțin 6 caractere.';
  }

  return errors;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // TODO: call the authentication API here.
    onLoginSuccess();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors((current) => ({ ...current, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      setErrors((current) => ({ ...current, password: undefined }));
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 style={poppins.bold(30)} className={styles.title}>
          Admin Login
        </h1>

        <div className={styles.fields}>
          <TextField
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresa de email"
            type="email"
            leftIcon={<MailIcon size={20} />}
            errorMessage={errors.email}
          />

          <TextField
            value={password}
            onChange={handlePasswordChange}
            placeholder="Parola"
            secureField
            leftIcon={<LockIcon size={20} />}
            errorMessage={errors.password}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <PrimaryButton text="Login" onTap={() => undefined} />
        </div>
      </form>
    </main>
  );
}
