import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EducationList } from "./components/education-list";
import { EducationForm } from "./components/education-form";

export default async function EducationPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { education: { orderBy: { startDate: 'desc' } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Educație</h1>
      <EducationList educations={user.education} />
      <EducationForm />
    </div>
  );
}