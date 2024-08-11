// src/app/profil/actions/change-user-role.ts
'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function changeUserRole(newRole: UserRole) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Trebuie să fii autentificat pentru a schimba rolul");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
    });

    revalidatePath('/profil');
    revalidatePath('/profil/schimba-rol');

    return { success: true, role: updatedUser.role };
  } catch (error) {
    console.error("Failed to change user role:", error);
    throw new Error("A apărut o eroare la schimbarea rolului");
  }
}