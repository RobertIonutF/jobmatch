// src/app/candidati/components/job-posting-list.tsx
'use client';

import { useState } from 'react';
import { JobPosting, Application } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApplicationList } from './application-list';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteJobPosting } from '../actions/delete-job-posting';

interface JobPostingWithApplications extends JobPosting {
  applications: (Application & {
    user: {
      name: string | null;
      email: string;
    };
  })[];
}

interface JobPostingListProps {
  jobPostings: JobPostingWithApplications[];
}

export function JobPostingList({ jobPostings: initialJobPostings }: JobPostingListProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState(initialJobPostings);
  const { toast } = useToast();

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJobPosting(jobId);
      setJobPostings((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      toast({
        title: 'Job șters',
        description: 'Jobul a fost șters cu succes.',
      });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge jobul. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {jobPostings.map((job) => {
        const activeApplications = job.applications.filter(app => app.status !== 'REJECTED');
        return (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{job.title}</span>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => toggleJobExpansion(job.id)}
                    className="mr-2"
                  >
                    {expandedJobId === job.id ? 'Ascunde' : 'Afișează'} Candidați
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ești sigur că vrei să ștergi acest job?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Această acțiune nu poate fi anulată. Vor fi șterse toate aplicațiile asociate acestui job.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anulează</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>
                          Șterge
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Companie:</strong> {job.company}</p>
              <p><strong>Locație:</strong> {job.location}</p>
              <p><strong>Candidați activi:</strong> {activeApplications.length}</p>
              {expandedJobId === job.id && (
                <ApplicationList applications={activeApplications} jobId={job.id} />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}