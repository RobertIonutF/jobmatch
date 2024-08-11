'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { JobCard } from './job-card';
import { Button } from '@/components/ui/button';
import { JobPosting } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

export function JobList() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
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
    setJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs(1);
  }, [searchParams, fetchJobs]);

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