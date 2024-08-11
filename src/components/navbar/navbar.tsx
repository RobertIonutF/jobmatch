'use client'

import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type NavItem = {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/', label: 'Acasă' },
  { href: '/joburi', label: 'Joburi' },
  { href: '/candidati', label: 'Candidați' },
  { href: '/despre', label: 'Despre' },
]

const NavItems = () => (
  <>
    {navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {item.label}
      </Link>
    ))}
  </>
)

export function Navbar() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">JobMatch</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavItems />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality here if needed */}
          </div>
          <nav className="flex items-center">
            <ModeToggle />
            {isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="ml-2"
                  onClick={() => router.push('/profil')}
                >
                  Profil
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton>
                  <Button variant="ghost" className="ml-2">
                    Autentificare
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="ml-2">Înregistrare</Button>
                </SignUpButton>
              </>
            )}
          </nav>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>JobMatch</SheetTitle>
                <SheetDescription>Navigați prin aplicație</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}