import { CircleHelp } from 'lucide-react'

function EmptyState({ title, description, icon: Icon = CircleHelp }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
        <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
      </span>
      <p className="mt-3 text-sm font-medium text-neutral-800">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-neutral-500">{description}</p>
    </div>
  )
}

export default EmptyState
