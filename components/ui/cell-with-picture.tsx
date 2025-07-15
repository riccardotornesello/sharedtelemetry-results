import { cn } from "@/lib/utils"

export interface CellWithPictureProps {
  picture?: string
  alt?: string
  className?: string
  children: React.ReactNode
}

export function CellWithPicture({
  picture,
  alt,
  children,
  className,
}: CellWithPictureProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {picture && (
        <img
          src={picture}
          alt={alt}
          className="mr-4 h-6 w-6 rounded-full object-cover"
        />
      )}

      {children}
    </div>
  )
}
