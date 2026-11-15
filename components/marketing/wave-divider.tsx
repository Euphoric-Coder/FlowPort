import { cn } from '@/lib/utils';

const paths = {
  a: 'M0,36 C180,64 360,4 560,26 C760,48 900,10 1080,28 C1230,44 1350,22 1440,40 L1440,64 L0,64 Z',
  b: 'M0,26 C160,54 340,64 540,40 C740,16 900,58 1080,44 C1240,32 1360,10 1440,30 L1440,64 L0,64 Z',
};

interface WaveDividerProps {
  /** Background of the section above (applied to the wrapper). */
  from: string;
  /** Fill of the wave, matching the section below. */
  to: string;
  variant?: keyof typeof paths;
  className?: string;
}

export function WaveDivider({ from, to, variant = 'a', className }: WaveDividerProps) {
  return (
    <div className={cn('leading-[0]', from, className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="block h-10 w-full sm:h-14"
      >
        <path d={paths[variant]} className={to} style={{ marginBottom: '-1px' }} />
      </svg>
    </div>
  );
}
