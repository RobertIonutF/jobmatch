import { ReactNode } from 'react';
import { ProfileSidebar } from './components/profile-sidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProfileSidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}