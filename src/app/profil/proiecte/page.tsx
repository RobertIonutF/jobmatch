import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectList } from "./components/project-list";
import { ProjectForm } from "./components/project-form";

export default async function ProjectsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { projects: { orderBy: { startDate: 'desc' } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proiecte</h1>
      <ProjectList projects={user.projects} />
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}