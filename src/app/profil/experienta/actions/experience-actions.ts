// src/app/profil/experienta/actions/experience-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const experienceSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().min(10),
});

export async function addExperience(formData: z.infer<typeof experienceSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = experienceSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.experience.create({
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
      userId: user.id,
    },
  });

  revalidatePath('/profil/experienta');

  return { success: true };
}

export async function updateExperience(id: string, formData: z.infer<typeof experienceSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = experienceSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.experience.update({
    where: { id, userId: user.id },
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
    },
  });

  revalidatePath('/profil/experienta');

  return { success: true };
}

export async function deleteExperience(id: string) {
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

  await prisma.experience.delete({
    where: { id, userId: user.id },
  });

  revalidatePath('/profil/experienta');

  return { success: true };
}