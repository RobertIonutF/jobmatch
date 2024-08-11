'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Briefcase, GraduationCap, Award, FileText, Folder, UserCog } from 'lucide-react';

const navItems = [
  { href: '/profil', label: 'Informații Generale', icon: User },
  { href: '/profil/experienta', label: 'Experiență', icon: Briefcase },
  { href: '/profil/educatie', label: 'Educație', icon: GraduationCap },
  { href: '/profil/competente', label: 'Competențe', icon: Award },
  { href: '/profil/proiecte', label: 'Proiecte', icon: Folder },
  { href: '/profil/cv', label: 'Vizualizare CV', icon: FileText },
  { href: '/profil/schimba-rol', label: 'Schimbă Rolul', icon: UserCog },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}