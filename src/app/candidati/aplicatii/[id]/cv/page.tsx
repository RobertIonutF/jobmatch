import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EuropassCV } from '@/app/profil/cv/components/europass-cv';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
          experiences: { orderBy: { startDate: 'desc' } },
          education: { orderBy: { startDate: 'desc' } },
          skills: { orderBy: { name: 'asc' } },
          projects: { orderBy: { startDate: 'desc' } },
        },
      },
      jobPosting: true,
    },
  });

  if (!application) {
    notFound();
  }

  return application;
}

export default async function CandidateCVPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    notFound();
  }

  const application = await getApplication(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">CV Candidat - {application.user.name}</h1>
      <div className="mb-4">
        <Link href={`/candidati/aplicatii/${params.id}`}>
          <Button variant="outline">Înapoi la detaliile aplicației</Button>
        </Link>
      </div>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <EuropassCV user={application.user} />
      </div>
    </div>
  );
}