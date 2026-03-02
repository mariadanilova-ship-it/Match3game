import bugMinor from '../../../assets/769094f1d994fc3889aa1c79569e1db404622039.png'; // green
import bugBackend from '../../../assets/ac688efc433c3503f1d32e44a72ae31d54b1ab7b.png'; // blue
import bugCritical from '../../../assets/7d51b8bd82d62c5c44bbf8ddbfd2e99f709d4e2b.png'; // red
import bugUX from '../../../assets/189ca6cab4963f41ef6893fe0791bd18e9360a4f.png'; // yellow
import bugSecurity from '../../../assets/346a3569de4843e88b8e4fcebfb3f001f16c75c6.png'; // purple

const BUG_IMAGES = [bugMinor, bugBackend, bugCritical, bugUX, bugSecurity];

export function BugIcon({ type, size = 32 }: { type: number; size?: number }) {
  const src = BUG_IMAGES[type];
  if (!src) return null;
  return (
    <img
      src={src}
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block', imageRendering: 'auto' }}
      alt=""
      draggable={false}
    />
  );
}
