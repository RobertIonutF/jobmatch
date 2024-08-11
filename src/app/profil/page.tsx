import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Informații Generale</h1>
      <ProfileForm user={user} />
    </div>
  );
}