import HeroSection from '@/components/home/HeroSection';
import FeatureCarousel from '@/components/home/FeatureCarousel';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import CallToAction from '@/components/home/CallToAction';
import AppLayout from '@/components/AppLayout';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if(!session?.user) redirect('/sign-in');

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  }

  return (
    <AppLayout user={user}>
      <HeroSection />
      <FeatureCarousel />
      <StatsSection />
      <TestimonialsCarousel />
      <CallToAction />
    </AppLayout>
  );
}
