import { Suspense } from 'react';
import { generatePlantConditions, GeneratePlantConditionsOutput } from '@/ai/flows/generate-plant-conditions';
import { ConditionsDashboard, ConditionsSkeleton } from '@/components/conditions-dashboard';
import { PlantForm } from '@/components/plant-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

async function PlantConditions({ plantName }: { plantName: string }) {
  try {
    const data = await generatePlantConditions({ plantName });
    return <ConditionsDashboard conditions={data} plantName={plantName} />;
  } catch (error) {
    console.error('Failed to generate plant conditions:', error);
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 border-destructive">
        <CardHeader>
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-destructive h-8 w-8" />
            <CardTitle className="text-destructive">Generation Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            We couldn't generate the growing conditions for "{plantName}". This might be due to an issue with the AI service or an unrecognized plant name. Please try again later or with a different plant.
          </p>
        </CardContent>
      </Card>
    );
  }
}

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const plantName = searchParams?.plantName;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <main className="container mx-auto p-4 py-8 md:p-12">
        <div className="w-full max-w-md mx-auto">
          <PlantForm />
        </div>

        {plantName && (
          <Suspense key={plantName} fallback={<ConditionsSkeleton />}>
            <PlantConditions plantName={plantName} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
