"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, children, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(pressed ?? false)

    React.useEffect(() => {
      if (typeof pressed === "boolean") {
        setIsPressed(pressed)
      }
    }, [pressed])

    const handleClick = () => {
      const newPressed = !isPressed
      if (pressed === undefined) {
        setIsPressed(newPressed)
      }
      onPressedChange?.(newPressed)
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle }
