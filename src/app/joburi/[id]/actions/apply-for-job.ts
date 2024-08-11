// src/app/joburi/[id]/actions/apply-for-job.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function applyForJob(jobId: string, coverLetter: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Trebuie să fii autentificat pentru a aplica la un job");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the user is the employer who posted this job
  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id: jobId },
  });

  if (!jobPosting) {
    throw new Error("Jobul nu a fost găsit");
  }

  if (jobPosting.userId === user.id) {
    throw new Error("Nu poți aplica la propriul tău job");
  }

  // Check if the user has already applied
  const existingApplication = await prisma.application.findFirst({
    where: {
      jobPostingId: jobId,
      userId: user.id,
    },
  });

  if (existingApplication) {
    throw new Error("Ai aplicat deja la acest job");
  }

  try {
    const application = await prisma.application.create({
      data: {
        jobPostingId: jobId,
        userId: user.id,
        status: "PENDING",
        coverLetter,
      },
    });

    return { success: true, application };
  } catch (error) {
    console.error("Failed to apply for job:", error);
    throw new Error("A apărut o eroare la aplicarea pentru job");
  }
}