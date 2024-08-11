'use client';

import { Application } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ApplicationStatusProps {
  application: Application;
}

export function ApplicationStatus({ application }: ApplicationStatusProps) {
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Aplicația ta este în curs de revizuire.';
      case 'REVIEWED':
        return 'Aplicația ta a fost revizuită.';
      case 'INTERVIEWED':
        return 'Ai fost selectat pentru interviu.';
      case 'OFFERED':
        return 'Ți-a fost făcută o ofertă!';
      case 'ACCEPTED':
        return 'Felicitări! Aplicația ta a fost acceptată.';
      case 'REJECTED':
        return 'Ne pare rău, aplicația ta nu a fost selectată de această dată.';
      default:
        return 'Statusul aplicației tale este necunoscut.';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statusul aplicației tale</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{getStatusMessage(application.status)}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Data aplicării: {new Date(application.createdAt).toLocaleDateString('ro-RO')}
        </p>
      </CardContent>
    </Card>
  );
}