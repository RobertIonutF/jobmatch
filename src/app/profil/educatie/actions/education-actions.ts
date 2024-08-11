// src/app/profil/educatie/actions/education-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export async function addEducation(formData: z.infer<typeof educationSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = educationSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.education.create({
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
      userId: user.id,
    },
  });

  revalidatePath('/profil/educatie');

  return { success: true };
}

export async function updateEducation(id: string, formData: z.infer<typeof educationSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = educationSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.education.update({
    where: { id, userId: user.id },
    data: {
      ...validatedFields,
      startDate: new Date(validatedFields.startDate),
      endDate: validatedFields.endDate ? new Date(validatedFields.endDate) : null,
    },
  });

  revalidatePath('/profil/educatie');

  return { success: true };
}

export async function deleteEducation(id: string) {
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

  await prisma.education.delete({
    where: { id, userId: user.id },
  });

  revalidatePath('/profil/educatie');

  return { success: true };
}