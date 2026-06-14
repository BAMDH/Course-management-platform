import type { ReactNode } from "react"

type Props = {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: string
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-zinc-900">{value}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          {icon}
        </div>
      </div>

      {description && (
        <p className="mt-4 text-sm text-zinc-500">{description}</p>
      )}

      {trend && <p className="mt-2 text-sm font-semibold text-green-600">{trend}</p>}
    </div>
  )
}