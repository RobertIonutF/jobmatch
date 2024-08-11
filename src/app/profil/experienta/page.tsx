import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceList } from "./components/experience-list";
import { ExperienceForm } from "./components/experience-form";

export default async function ExperiencePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { experiences: { orderBy: { startDate: 'desc' } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Experiență Profesională</h1>
      <ExperienceList experiences={user.experiences} />
      <ExperienceForm />
    </div>
  );
}