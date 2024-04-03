"use client";
import { useClient } from "@/api/context";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const query = useSearchParams();

  const { client } = useClient(query.has("secret") ? "public" : "user");

  const { data } = client.reports.useSwr((f) =>
    f.one(params.slug, query.get("secret") ?? undefined),
  )();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col w-full p-4 gap-4">asd</div>
    </main>
  );
}
