import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('glass rounded-2xl p-6', className)}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      {description && ((
        <p className="text-gray-600 mt-1">{description}</p>
      ))}
    </div>
  )
}
