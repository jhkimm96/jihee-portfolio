import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/study', label: 'Study' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' }
]

export function Nav() {
  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
