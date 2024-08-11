import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '../joburi/components/page-header';
import { JobPostingList } from './components/job-posting-list';
import { CreateJobPostingForm } from './components/create-job-posting-form';

async function getEmployerJobPostings(userId: string) {
  return prisma.jobPosting.findMany({
    where: { userId },
    include: {
      applications: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function CandidatiPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const jobPostings = await getEmployerJobPostings(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Gestionare Candidați"
        description="Gestionează joburile postate și candidații"
      />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <JobPostingList jobPostings={jobPostings} />
        </div>
        <div>
          <CreateJobPostingForm />
        </div>
      </div>
    </div>
  );
}