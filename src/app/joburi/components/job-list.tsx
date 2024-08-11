// src/app/joburi/components/job-list.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobCard } from './job-card';
import { Button } from '@/components/ui/button';
import { JobPosting } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

interface JobListProps {
  initialJobs: JobPosting[];
}

export function JobList({ initialJobs }: JobListProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const fetchJobs = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());

    try {
      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const newJobs = await response.json();
      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prevJobs) => (pageNum === 1 ? newJobs : [...prevJobs, ...newJobs]));
        setPage(pageNum);
      }
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca joburile. Vă rugăm să încercați din nou.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (initialJobs.length === 0) {
      fetchJobs(1);
    }
  }, [fetchJobs, initialJobs]);

  useEffect(() => {
    setJobs(initialJobs);
    setPage(1);
    setHasMore(true);
  }, [searchParams, initialJobs]);

  const loadMoreJobs = () => {
    fetchJobs(page + 1);
  };

  if (jobs.length === 0 && !isLoading) {
    return <p>Nu s-au găsit joburi care să corespundă criteriilor de căutare.</p>;
  }

  return (
    <div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {isLoading && <p>Se încarcă...</p>}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <Button onClick={loadMoreJobs}>Încarcă mai multe joburi</Button>
        </div>
      )}
    </div>
  );
}