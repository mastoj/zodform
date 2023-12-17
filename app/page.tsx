import Image from "next/image";
import { ProfileForm } from "./_components/ProfileForm";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense>
        <ProfileForm />
      </Suspense>
    </main>
  );
}
