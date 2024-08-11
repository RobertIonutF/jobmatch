import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EuropassCV } from "./components/europass-cv";
import { DownloadPDFButton } from "./components/download-pdf-button";

export default async function CVPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      profile: true,
      experiences: { orderBy: { startDate: 'desc' } },
      education: { orderBy: { startDate: 'desc' } },
      skills: { orderBy: { name: 'asc' } },
      projects: { orderBy: { startDate: 'desc' } },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Curriculum Vitae</h1>
      <div className="mb-4">
        <DownloadPDFButton />
      </div>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <EuropassCV user={user} />
      </div>
    </div>
  );
}