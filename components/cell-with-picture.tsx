/**
 * Props for the CellWithPicture component
 */
export interface CellWithPictureProps {
  /** Optional URL of the picture to display */
  picture?: string
  /** Alt text for the picture for accessibility */
  alt?: string
  /** Content to display next to the picture */
  children: React.ReactNode
}

/**
 * CellWithPicture component displays content with an optional circular picture/avatar on the left.
 *
 * This component is commonly used in table cells to show team logos, driver avatars,
 * or other identifying images alongside text content.
 *
 * @example
 * ```tsx
 * <CellWithPicture picture="/team-logo.png" alt="Team Logo">
 *   Team Name
 * </CellWithPicture>
 * ```
 */
export function CellWithPicture({
  picture,
  alt,
  children,
}: CellWithPictureProps) {
  return (
    <div className="flex items-center space-x-2">
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
