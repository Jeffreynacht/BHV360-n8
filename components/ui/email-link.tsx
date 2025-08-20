import type React from "react"

interface EmailLinkProps {
  email: string
  subject?: string
  body?: string
  children?: React.ReactNode
  className?: string
}

export function EmailLink({
  email,
  subject = "",
  body = "",
  children,
  className = "text-blue-600 hover:underline",
}: EmailLinkProps) {
  const mailtoUrl = `mailto:${email}${subject || body ? "?" : ""}${
    subject ? `subject=${encodeURIComponent(subject)}` : ""
  }${subject && body ? "&" : ""}${body ? `body=${body}` : ""}`

  return (
    <a href={mailtoUrl} className={className} target="_blank" rel="noopener noreferrer">
      {children || email}
    </a>
  )
}
