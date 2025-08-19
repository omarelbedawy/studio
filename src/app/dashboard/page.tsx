
import { Suspense } from 'react';
import { generatePlantConditions } from '@/ai/flows/generate-plant-conditions';
import { ConditionsDashboard, ConditionsSkeleton } from '@/components/conditions-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Wifi, Thermometer, Droplets, Lightbulb, Wind, Leaf, Bug } from 'lucide-react';

async function PlantCareInfo({ plantName }: { plantName: string }) {
  try {
    const data = await generatePlantConditions({ plantName });
    return <ConditionsDashboard conditions={data} plantName={plantName} />;
  } catch (error) {
    console.error('Failed to generate plant conditions:', error);
    return (
      <Card className="w-full mt-8 border-destructive">
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

function ConnectionStatus() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wifi className="text-primary"/>
                    Device Status
                </CardTitle>
                <CardDescription>ESP32-CAM connection status.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-semibold text-green-600">Connected</span>
                </div>
            </CardContent>
        </Card>
    )
}

function DiseaseStatus() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bug className="text-primary"/>
                    Disease Diagnosis
                </CardTitle>
                 <CardDescription>AI-powered plant health analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="font-semibold text-muted-foreground">Dummy Status: <span className="font-bold text-green-600">Healthy</span></p>
                <p className="text-sm text-muted-foreground">No disease detected based on the latest image analysis. Keep up the great work!</p>
                 <p className="text-xs text-center pt-4 text-muted-foreground">[Awaiting image from ESP32]</p>
            </CardContent>
        </Card>
    )
}

function RealTimeMonitoring() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>Live data from your ESP32-CAM sensors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Thermometer className="text-primary"/>
                    <p>Temperature: <span className="font-bold">24°C</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <Droplets className="text-primary"/>
                    <p>Moisture: <span className="font-bold">65%</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <Lightbulb className="text-primary"/>
                    <p>Light: <span className="font-bold">800 lux</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="text-primary"/>
                    <p>Gas: <span className="font-bold">50 ppm</span></p>
                </div>
                 <p className="text-xs col-span-2 text-center pt-4 text-muted-foreground">[Using dummy data]</p>
            </CardContent>
        </Card>
    )
}


export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const plantName = searchParams?.plantName;

  return (
    <div className="min-h-screen bg-muted/40 text-foreground font-body">
         <header className="bg-background shadow-sm">
            <div className="container mx-auto p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Leaf className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-headline font-bold text-foreground">Green-AI Dashboard</h1>
                </div>
            </div>
        </header>
      <main className="container mx-auto p-4 py-8 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ConnectionStatus />
            <RealTimeMonitoring />
            <DiseaseStatus />
        </div>

        {plantName ? (
          <Suspense key={plantName} fallback={<ConditionsSkeleton />}>
            <PlantCareInfo plantName={plantName} />
          </Suspense>
        ) : (
            <Card className="w-full max-w-4xl mx-auto mt-8 text-center">
                <CardHeader>
                    <CardTitle>No Plant Selected</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please go back and search for a plant to see its dashboard.</p>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
