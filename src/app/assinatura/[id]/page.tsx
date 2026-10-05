import { notFound, redirect } from 'next/navigation';
import { getVehicle } from '@/data/vehicles';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getVehicle(id)) notFound();
  redirect('/assinatura');
}
