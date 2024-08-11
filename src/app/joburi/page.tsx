import { Suspense } from 'react';
import { JobList } from './components/job-list';
import { JobFilters } from './components/job-filters';
import { JobSearch } from './components/job-search';
import { PageHeader } from './components/page-header';
import { prisma } from '@/lib/prisma';

async function getJobs(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  try {
    const jobs = await prisma.jobPosting.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobs;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

export default async function JoburiPage() {
  const initialJobs = await getJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Joburi disponibile"
        description="Descoperă oportunități de carieră potrivite pentru tine"
      />
      <div className="mt-8">
        <JobSearch />
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <JobFilters />
        </div>
        <div className="md:col-span-3">
          <Suspense fallback={<div>Se încarcă joburile...</div>}>
            <JobList initialJobs={initialJobs} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}