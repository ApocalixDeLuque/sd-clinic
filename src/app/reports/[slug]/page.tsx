import Navbar from '@/app/components/Navbar';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col w-full p-4 gap-4">asd</div>
    </main>
  );
}
