'use client';

import { JobPosting, JobType, ExperienceLevel } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Currency, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  const formatJobType = (jobType: JobType) => {
    const types: Record<JobType, string> = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Contract',
      INTERNSHIP: 'Internship',
      REMOTE: 'Remote',
    };
    return types[jobType] || jobType;
  };

  const formatExperienceLevel = (level: ExperienceLevel) => {
    const levels: Record<ExperienceLevel, string> = {
      ENTRY: 'Entry-level',
      MID: 'Mid-level',
      SENIOR: 'Senior-level',
      EXECUTIVE: 'Executive',
    };
    return levels[level] || level;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <div className="text-sm text-muted-foreground">{job.company}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Briefcase className="h-4 w-4" />
            <span>{formatJobType(job.jobType)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center space-x-2 text-sm">
              <Currency className="h-4 w-4" />
              <span>{job.salary} RON</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <BarChart className="h-4 w-4" />
            <span>{formatExperienceLevel(job.experienceLevel)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Postat {formatDate(job.createdAt.toString())}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Descriere:</h4>
          <p className="text-sm line-clamp-3">{job.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/joburi/${job.id}`} passHref>
          <Button>Vezi detalii</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}