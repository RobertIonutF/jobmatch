import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

async function getApplication(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
          experiences: true,
          education: true,
          skills: true,
          projects: true,
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

export default async function ViewApplicationPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    notFound();
  }

  const application = await getApplication(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Detalii aplicație</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informații job</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Titlu job</TableCell>
                  <TableCell>{application.jobPosting.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Companie</TableCell>
                  <TableCell>{application.jobPosting.company}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Locație</TableCell>
                  <TableCell>{application.jobPosting.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tip job</TableCell>
                  <TableCell>{application.jobPosting.jobType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nivel experiență</TableCell>
                  <TableCell>{application.jobPosting.experienceLevel}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informații aplicant</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nume</TableCell>
                  <TableCell>{application.user.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{application.user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Telefon</TableCell>
                  <TableCell>{application.user.profile?.phoneNumber || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Locație</TableCell>
                  <TableCell>{application.user.profile?.location || 'N/A'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scrisoare de intenție</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{application.coverLetter}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalii aplicație</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>{application.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Data aplicării</TableCell>
                  <TableCell>{formatDate(application.createdAt.toString())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Link href={`/candidati`}>
          <Button variant="outline">Înapoi la lista de aplicații</Button>
        </Link>
        <Link href={`/candidati/aplicatii/${application.id}/cv`}>
          <Button>Vizualizează CV-ul candidatului</Button>
        </Link>
      </div>
    </div>
  );
}