"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, ExternalLink } from "lucide-react"

interface HelpTooltipProps {
  title: string
  content: string
  link?: string
  linkText?: string
}

export function HelpTooltip({ title, content, link, linkText }: HelpTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{content}</p>
          {link && (
            <Button variant="outline" size="sm" asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                {linkText || "Meer info"}
              </a>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
