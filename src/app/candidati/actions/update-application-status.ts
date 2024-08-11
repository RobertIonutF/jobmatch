'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function updateApplicationStatus(applicationId: string, newStatus: 'ACCEPTED' | 'REJECTED') {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Trebuie să fii autentificat pentru a actualiza statusul aplicației');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== 'EMPLOYER') {
    throw new Error('Doar angajatorii pot actualiza statusul aplicațiilor');
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    // If the application is rejected, we don't need to return it
    if (newStatus === 'REJECTED') {
      return { success: true, message: 'Aplicația a fost respinsă și eliminată din listă.' };
    }

    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error('Failed to update application status:', error);
    throw new Error('A apărut o eroare la actualizarea statusului aplicației');
  }
}