'use client';

import { Application } from '@prisma/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { updateApplicationStatus } from '../actions/update-application-status';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface ApplicationWithUser extends Application {
  user: {
    name: string | null;
    email: string;
  };
}

interface ApplicationListProps {
  applications: ApplicationWithUser[];
  jobId: string;
}

export function ApplicationList({ applications, jobId }: ApplicationListProps) {
  const [localApplications, setLocalApplications] = useState(applications.filter(app => app.status !== 'REJECTED'));
  const { toast } = useToast();

  const handleStatusUpdate = async (applicationId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      if (newStatus === 'REJECTED') {
        setLocalApplications((prevApps) =>
          prevApps.filter((app) => app.id !== applicationId)
        );
      } else {
        setLocalApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
      toast({
        title: 'Status actualizat',
        description: `Candidatul a fost ${newStatus === 'ACCEPTED' ? 'acceptat' : 'respins'}.`,
      });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza statusul aplicației.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {localApplications.map((application) => (
        <Card key={application.id}>
          <CardContent className="pt-4">
            <p><strong>Nume:</strong> {application.user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {application.user.email}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <div className="mt-2 space-x-2">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                disabled={application.status === 'ACCEPTED'}
              >
                Acceptă
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
              >
                Respinge
              </Button>
              <Link href={`/candidati/aplicatii/${application.id}`}>
                <Button size="sm" variant="outline">
                  Vezi detalii
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}