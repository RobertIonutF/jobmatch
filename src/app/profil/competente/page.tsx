import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillsList } from "./components/skills-list";
import { SkillForm } from "./components/skill-form";

export default async function SkillsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { skills: { orderBy: { name: 'asc' } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Competențe</h1>
      <SkillsList skills={user.skills} />
      <div className="mt-6">
        <SkillForm />
      </div>
    </div>
  );
}