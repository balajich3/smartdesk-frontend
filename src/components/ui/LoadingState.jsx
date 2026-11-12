function LoadingState({ label = 'Loading...' }) {
  return (
    <div aria-live="polite" className="mx-auto max-w-5xl px-6 py-12 text-sm text-neutral-500" role="status">
      {label}
    </div>
  )
}

export default LoadingState
