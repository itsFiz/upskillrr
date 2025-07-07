import { cn } from '@/lib/utils'

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-h-screen w-full p-4 sm:p-6 lg:p-8", className)}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
} 