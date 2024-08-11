    'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const jobPostingSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(10),
  salary: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']),
  requirements: z.string().min(1),
});

export async function createJobPosting(formData: z.infer<typeof jobPostingSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Trebuie să fii autentificat pentru a posta un job');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== 'EMPLOYER') {
    throw new Error('Doar angajatorii pot posta joburi');
  }

  const validatedFields = jobPostingSchema.parse(formData);

  try {
    const jobPosting = await prisma.jobPosting.create({
      data: {
        ...validatedFields,
        salary: validatedFields.salary ? parseFloat(validatedFields.salary) : null,
        requirements: validatedFields.requirements.split('\n'),
        userId: user.id,
      },
    });

    return { success: true, jobPosting };
  } catch (error) {
    console.error('Failed to create job posting:', error);
    throw new Error('A apărut o eroare la crearea jobului');
  }
}