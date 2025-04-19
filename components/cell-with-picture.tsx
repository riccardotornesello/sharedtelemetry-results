export interface CellWithPictureProps {
  picture?: string;
  alt?: string;
  children: React.ReactNode;
}

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
  );
}
