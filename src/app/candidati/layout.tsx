import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";

export default async function CandidatiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
          Trebuie să fii autentificat pentru a accesa această pagină.
        </p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  const isEmployee = dbUser?.role === UserRole.EMPLOYER;

  if (!isEmployee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
            Trebuie să fii angajator pentru a accesa această pagină.
        </p>
      </div>     
    );
  }

  return <>{children}</>;
}
