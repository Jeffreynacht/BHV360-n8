import type React from "react"

interface EmailLinkProps {
  email: string
  subject?: string
  body?: string
  children?: React.ReactNode
  className?: string
}

export function EmailLink({ email, subject, body, children, className }: EmailLinkProps) {
  const createMailtoUrl = () => {
    const params = new URLSearchParams()
    if (subject) params.append("subject", subject)
    if (body) params.append("body", body)

    const queryString = params.toString()
    return `mailto:${email}${queryString ? `?${queryString}` : ""}`
  }

  return (
    <a href={createMailtoUrl()} className={className}>
      {children || email}
    </a>
  )
}
