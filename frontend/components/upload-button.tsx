'use client'

interface UploadButtonProps {
  onClick: () => void
  disabled: boolean
}

export default function UploadButton({ onClick, disabled }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        px-6
        py-3
        font-medium
        rounded-lg
        transition-colors
        ${
          disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
        }
      `}
    >
      Continue
    </button>
  )
}
