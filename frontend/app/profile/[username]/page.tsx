import { ApiError, getProfile, mapApiProfileToProfile } from '@/lib/api';
import PublicProfile from '@/components/PublicProfile';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  try {
    const data = await getProfile(username);
    const profile = mapApiProfileToProfile(data);
    return <PublicProfile profile={profile} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
