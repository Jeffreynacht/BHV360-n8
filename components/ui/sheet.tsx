"use client"

import type * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils" // als je geen cn() helper hebt, vervang cn(...) door className strings

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export function SheetContent({
  className,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: "left" | "right" | "top" | "bottom" }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content
        {...props}
        className={cn(
          "fixed z-50 bg-white shadow-xl focus:outline-none",
          side === "right" && "right-0 top-0 h-full w-80",
          side === "left" && "left-0 top-0 h-full w-80",
          side === "top" && "top-0 left-0 w-full h-80",
          side === "bottom" && "bottom-0 left-0 w-full h-80",
          className,
        )}
      />
    </Dialog.Portal>
  )
}

export const SheetTitle = (props: React.ComponentProps<typeof Dialog.Title>) => (
  <Dialog.Title {...props} className={cn("text-lg font-semibold", (props as any).className)} />
)

export const SheetDescription = (props: React.ComponentProps<typeof Dialog.Description>) => (
  <Dialog.Description {...props} className={cn("text-sm text-gray-500", (props as any).className)} />
)

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
