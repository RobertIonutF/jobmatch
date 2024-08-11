// src/app/profil/actions/update-profile.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500),
  location: z.string(),
  phoneNumber: z.string().optional(),
  websiteUrl: z.string().url().optional(),
});

export async function updateProfile(formData: z.infer<typeof profileSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const validatedFields = profileSchema.parse(formData);

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: validatedFields.name,
      profile: {
        upsert: {
          create: {
            bio: validatedFields.bio,
            location: validatedFields.location,
            phoneNumber: validatedFields.phoneNumber,
            websiteUrl: validatedFields.websiteUrl,
          },
          update: {
            bio: validatedFields.bio,
            location: validatedFields.location,
            phoneNumber: validatedFields.phoneNumber,
            websiteUrl: validatedFields.websiteUrl,
          },
        },
      },
    },
  });

  revalidatePath('/profil');

  return { success: true };
}