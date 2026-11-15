import Image from 'next/image';
import iconImg from '@/public/icon.png';
import { cn } from '@/lib/utils';

export function FlowPortLogo({
  className,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src={iconImg}
      alt="FlowPort Logo"
      className={cn('h-7 w-7 object-contain', className)}
      priority
    />
  );
}

export function Wordmark({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn('font-semibold tracking-tight', className)}>
      Flow
      {onDark ? (
        <span className="text-[#67E8F9]">Port</span>
      ) : (
        <span className="text-gradient">Port</span>
      )}
    </span>
  );
}
