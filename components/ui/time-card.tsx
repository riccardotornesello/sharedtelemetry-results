import { formatMilliseconds } from "@/lib/format"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface TimeCardProps {
  className?: string
  time?: number | null // time in milliseconds
}

const timeCardVariants = cva(
  "h-full rounded p-2 text-center font-mono text-gray-300",
  {
    variants: {
      variant: {
        transparent: "",
        overallBest: "bg-purple-600 text-purple-200",
        personalBest: "bg-green-600 text-green-200",
      },
      size: {
        xs: "text-xs min-w-[80px]",
        sm: "text-sm min-w-[90px]",
        md: "text-base min-w-[100px]",
        lg: "text-lg min-w-[120px]",
      },
    },
    defaultVariants: {
      variant: "transparent",
      size: "md",
    },
  }
)

export function TimeCard({
  time,
  className,
  variant,
  size,
}: TimeCardProps & VariantProps<typeof timeCardVariants>) {
  return (
    <div className={cn(timeCardVariants({ variant, size }), className)}>
      {time ? formatMilliseconds(time) : "-"}
    </div>
  )
}
