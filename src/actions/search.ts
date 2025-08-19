
'use server';

import { redirect } from 'next/navigation';

export async function searchPlant(formData: FormData) {
  const plantName = formData.get('plantName') as string;
  if (plantName && plantName.trim()) {
    redirect(`/connect-device?plantName=${encodeURIComponent(plantName.trim())}`);
  }
}
