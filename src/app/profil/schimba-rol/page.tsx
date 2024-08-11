// src/app/profil/schimba-rol/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChangeRoleForm } from "./components/change-role-form";

export default async function ChangeRolePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Schimbă Rolul Utilizatorului</h1>
      <ChangeRoleForm currentRole={user.role} />
    </div>
  );
}