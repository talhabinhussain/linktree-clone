import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">This page doesn&apos;t exist</h1>
      <p className="text-muted-foreground">
        The profile you&apos;re looking for could not be found.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Create your own profile
      </Link>
    </div>
  );
}
