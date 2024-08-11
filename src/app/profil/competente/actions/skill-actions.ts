// src/app/profil/competente/actions/skill-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { SkillLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.nativeEnum(SkillLevel),
});

export async function addSkill(formData: z.infer<typeof skillSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = skillSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.skill.create({
    data: {
      ...validatedFields,
      userId: user.id,
    },
  });

  revalidatePath('/profil/competente');

  return { success: true };
}

export async function updateSkill(id: string, formData: z.infer<typeof skillSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = skillSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.skill.update({
    where: { id, userId: user.id },
    data: validatedFields,
  });

  revalidatePath('/profil/competente');

  return { success: true };
}

export async function deleteSkill(id: string) {
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

  await prisma.skill.delete({
    where: { id, userId: user.id },
  });
  
  revalidatePath('/profil/competente');

  return { success: true };
}