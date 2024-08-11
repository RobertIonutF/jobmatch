import { JobPosting } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Currency, Clock, BarChart, User } from 'lucide-react';

interface JobDetailsProps {
  job: JobPosting & {
    user: {
      name: string | null;
      email: string;
    };
  };
}

export function JobDetails({ job }: JobDetailsProps) {
  const formatJobType = (jobType: string) => {
    return jobType.charAt(0) + jobType.slice(1).toLowerCase().replace('_', ' ');
  };

  const formatExperienceLevel = (level: string) => {
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalii job</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <span>{formatJobType(job.jobType)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center space-x-2">
            <Currency className="h-5 w-5" />
            <span>{job.salary} RON</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <BarChart className="h-5 w-5" />
          <span>{formatExperienceLevel(job.experienceLevel)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Postat la {new Date(job.createdAt).toLocaleDateString('ro-RO')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Postat de {job.user.name || job.user.email}</span>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Descriere job:</h3>
          <p>{job.description}</p>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Cerințe:</h3>
          <ul className="list-disc list-inside">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}