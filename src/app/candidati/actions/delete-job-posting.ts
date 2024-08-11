// src/app/candidati/actions/delete-job-posting.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function deleteJobPosting(jobId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Trebuie să fii autentificat pentru a șterge un job');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== 'EMPLOYER') {
    throw new Error('Doar angajatorii pot șterge joburi');
  }

  try {
    // First, delete all applications associated with this job posting
    await prisma.application.deleteMany({
      where: { jobPostingId: jobId },
    });

    // Then, delete the job posting
    await prisma.jobPosting.delete({
      where: { id: jobId, userId: user.id },
    });

    return { success: true, message: 'Jobul a fost șters cu succes' };
  } catch (error) {
    console.error('Failed to delete job posting:', error);
    throw new Error('A apărut o eroare la ștergerea jobului');
  }
}