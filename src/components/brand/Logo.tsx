export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="SoilSathi AI logo">
      <rect width="48" height="48" rx="13" fill="#1f3520" />
      <path d="M8 32c5-2.4 9.5-2.4 14 0 4.5 2.4 9 2.4 14 0 2-.9 4-1.4 4-1.4v6.4c0 2.3-1.9 4.2-4.2 4.2H12.2C9.9 41 8 39.1 8 36.8V32Z" fill="#48673a" />
      <path d="M8 27.4c5-2.4 9.5-2.4 14 0 4.5 2.4 9 2.4 14 0 2-.9 4-1.4 4-1.4v3.4c-1.6.4-3.2 1-4.6 1.7-4.7 2.4-9.8 2.4-14.5 0-4.4-2.3-8.9-2.4-12.9-.6V27.4Z" fill="#7f9f6d" opacity="0.75" />
      <path d="M24.2 9.2c4.8 2.3 7.6 6.4 7.9 12.1-4.9 1.2-8.9-.4-11.4-4.6 1.4-1.1 2.5-2.6 3.5-7.5Z" fill="#a3e635" />
      <path d="M23.6 10.4c-1.9 4.3-4.9 7-9.2 8.3-1.3-3.6-.5-6.5 2.4-8.9 2.1.9 4.4 1.1 6.8.6Z" fill="#e4ecdf" opacity="0.95" />
      <path d="M22.4 24.6c.5-4 1.9-7 4.4-9.3" stroke="#1f3520" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}
