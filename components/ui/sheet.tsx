"use client"

import * as React from "react"
// Gebruik de namespace import: werkt in alle recente Vaul versies
import * as Drawer from "vaul"

// Alias "Sheet" API naar Vaul's Drawer API
// Je kunt deze namen overal in je app gebruiken en nooit meer direct uit "vaul" importeren.
export const Sheet = (props: React.ComponentProps<typeof Drawer.Root>) => <Drawer.Root {...props} />

export const SheetTrigger = Drawer.Trigger
export const SheetPortal = Drawer.Portal ?? React.Fragment
export const SheetOverlay = Drawer.Overlay ?? (({ children }: any) => <>{children}</>)
export const SheetContent = Drawer.Content
export const SheetTitle = Drawer.Title ?? (({ children }: any) => <>{children}</>)
export const SheetDescription = Drawer.Description ?? (({ children }: any) => <>{children}</>)

// Belangrijk: sommige Vaul versies hebben geen named export "DrawerClose"
// maar wel een subcomponent `Drawer.Close`. Deze wrapper zorgt dat je altijd `SheetClose` hebt.
export const SheetClose =
  // @ts-expect-error - not all versions have .Close typed; at runtime it's present in modern Vaul
  Drawer.Close ?? (({ asChild, ...props }: any) => <button {...props} />)

// Extra components voor compatibiliteit met shadcn/ui patterns
export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className || ""}`} {...props} />
)
SheetHeader.displayName = "SheetHeader"

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`} {...props} />
)
SheetFooter.displayName = "SheetFooter"
