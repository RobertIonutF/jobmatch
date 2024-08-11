'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, 'Titlul jobului este obligatoriu'),
  description: z.string().min(1, 'Descrierea jobului este obligatorie'),
  company: z.string().min(1, 'Numele companiei este obligatoriu'),
  location: z.string().min(1, 'Locația jobului este obligatorie'),
  salary: z.number().optional(),
  requirements: z.array(z.string()),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']),
});

export async function createJob(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Trebuie să fii autentificat pentru a crea un job');
  }

  const validatedFields = jobSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    company: formData.get('company'),
    location: formData.get('location'),
    salary: formData.get('salary') ? Number(formData.get('salary')) : undefined,
    requirements: formData.getAll('requirements'),
    jobType: formData.get('jobType'),
    experienceLevel: formData.get('experienceLevel'),
  });

  try {
    const job = await prisma.jobPosting.create({
      data: {
        ...validatedFields,
        userId,
      },
    });

    return { success: true, job };
  } catch (error) {
    console.error('Failed to create job:', error);
    return { success: false, error: 'Failed to create job' };
  }
}