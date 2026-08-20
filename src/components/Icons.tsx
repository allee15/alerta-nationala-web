import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function BaseIcon({ size = 24, children, ...props }: IconProps) {
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
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return <BaseIcon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></BaseIcon>;
}

export function LockIcon(props: IconProps) {
  return <BaseIcon {...props}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></BaseIcon>;
}

export function EyeIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></BaseIcon>;
}

export function EyeOffIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="m3 3 18 18" /><path d="M10.6 6.3A10.6 10.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17.3 17.3 0 0 1-3.1 3.8" /><path d="M6.7 6.7C3.8 8.7 2.5 12 2.5 12S6 18 12 18a10.7 10.7 0 0 0 4.2-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></BaseIcon>;
}


export function CheckIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="m5 12 4 4L19 6" /></BaseIcon>;
}

export function XIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></BaseIcon>;
}

export function MapPinIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></BaseIcon>;
}

export function ChevronDownIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="m6 9 6 6 6-6" /></BaseIcon>;
}

export function SunIcon(props: IconProps) {
  return <BaseIcon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></BaseIcon>;
}

export function MoonIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" /></BaseIcon>;
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m10.29 3.86-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </BaseIcon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m3 10.5 9-7 9 7" />
      <path d="M5 9.8V20h14V9.8" />
    </BaseIcon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </BaseIcon>
  );
}
