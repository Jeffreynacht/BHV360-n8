"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Invoices", href: "/invoices" },
    { label: "Customers", href: "/customers" },
  ]

  // Zorg ervoor dat de navigatie naar het dashboard verwijst

  // Voeg een dashboard link toe aan de navigatie als deze nog niet bestaat
  // Zoek naar de navigatie items array en controleer of er een dashboard item is
  // Als er geen dashboard item is, voeg het toe aan het begin van de array
  const dashboardItem = { label: "Dashboard", href: "/dashboard" }
  const hasDashboard = navigationItems.some((item) => item.label === dashboardItem.label)

  if (!hasDashboard) {
    navigationItems.unshift(dashboardItem)
  }

  return (
    <nav>
      <ul>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
