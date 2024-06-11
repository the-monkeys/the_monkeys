import { twMerge } from 'tailwind-merge';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge(className, 'min-h-screen max-w-7xl mx-auto px-5')}>
      {children}
    </div>
  );
}
