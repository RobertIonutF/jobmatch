// src/app/joburi/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "../components/page-header";
import { JobDetails } from "./components/job-details";
import { ApplyJobForm } from "./components/job-form";
import { ApplicationStatus } from "./components/application-status";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";

async function getJob(id: string) {
  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return job;
}

async function getExistingApplication(jobId: string, userId: string) {
  return prisma.application.findFirst({
    where: {
      jobPostingId: jobId,
      userId: userId,
    },
  });
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const user = await currentUser();
  const job = await getJob(params.id);

  let existingApplication = null;
  let isEmployer = false;
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (dbUser) {
      existingApplication = await getExistingApplication(job.id, dbUser.id);
      isEmployer = dbUser.id === job.user.id;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={job.title} description={job.company} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <JobDetails job={job} />
        </div>
        <div>
          {!user ? (
            <Card>
              <div className="p-4" role="alert">
                <p className="font-bold">Atenție</p>
                <p>Trebuie să fii autentificat pentru a aplica la acest job.</p>
              </div>
            </Card>
          ) : isEmployer ? (
            <Card>
              <div className="p-4" role="alert">
                <p className="font-bold">Informație</p>
                <p>
                  Acesta este jobul tău postat. Nu poți aplica la propriul tău
                  job.
                </p>
              </div>
            </Card>
          ) : existingApplication ? (
            <ApplicationStatus application={existingApplication} />
          ) : (
            <ApplyJobForm jobId={job.id} />
          )}
        </div>
      </div>
    </div>
  );
}
