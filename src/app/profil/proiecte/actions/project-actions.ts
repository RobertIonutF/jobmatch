// src/app/profil/proiecte/actions/project-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const projectSchema = z.object({
  title: z.string().min(1, "Titlul proiectului este obligatoriu"),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
  url: z.string().url("Introduceți o adresă URL validă").optional().or(z.literal('')),
  startDate: z.string().min(1, "Data de început este obligatorie"),
  endDate: z.string().optional(),
});

export async function addProject(formData: z.infer<typeof projectSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = projectSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.project.create({
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
      userId: user.id,
    },
  });

  revalidatePath('/profil/proiecte');

  return { success: true };
}

export async function updateProject(id: string, formData: z.infer<typeof projectSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = projectSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.project.update({
    where: { id, userId: user.id },
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
    },
  });

  revalidatePath('/profil/proiecte');

  return { success: true };
}

export async function deleteProject(id: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.project.delete({
    where: { id, userId: user.id },
  });

  revalidatePath('/profil/proiecte');

  return { success: true };
}