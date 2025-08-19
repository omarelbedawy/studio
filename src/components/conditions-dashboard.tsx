
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, Thermometer, Lightbulb, Wind, Leaf, Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';
import type { GeneratePlantConditionsOutput } from '@/ai/flows/generate-plant-conditions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ConditionsDashboard({ conditions, plantName }: { conditions: GeneratePlantConditionsOutput; plantName: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableConditions, setEditableConditions] = useState(conditions);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableConditions(prev => ({ ...prev, [name]: parseFloat(value) || value }));
  };

  const ThresholdCard = ({ title, icon: Icon, value, name, unit, isEditing }: { title: string; icon: React.ElementType, value: number; name: string; unit: string; isEditing: boolean }) => (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="p-2 bg-primary/20 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input type="number" name={name} value={value} onChange={handleInputChange} className="w-24" />
            <span className="text-muted-foreground">{unit}</span>
          </div>
        ) : (
          <p className="text-2xl font-bold">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center capitalize">{plantName} Conditions</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="outline" size="icon"><X className="h-4 w-4" /></Button>
            <Button onClick={() => setIsEditing(false)} size="icon"><Save className="h-4 w-4" /></Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Best Conditions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ThresholdCard title="Soil Moisture" icon={Droplets} value={editableConditions.soilDryThreshold} name="soilDryThreshold" unit="%" isEditing={isEditing} />
            <ThresholdCard title="Gas (MQ2)" icon={Wind} value={editableConditions.mq2Threshold} name="mq2Threshold" unit="ppm" isEditing={isEditing} />
            <ThresholdCard title="Temperature" icon={Thermometer} value={editableConditions.tempThreshold} name="tempThreshold" unit="°C" isEditing={isEditing} />
            <ThresholdCard title="Light Level" icon={Lightbulb} value={editableConditions.lightThreshold} name="lightThreshold" unit="lux" isEditing={isEditing} />
          </div>
        </div>
        <div>
           <h3 className="text-xl font-semibold mb-4">Enrichment</h3>
           <Card className="shadow-md bg-card">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Leaf className="w-6 h-6 text-primary" />
                    <CardTitle>General Advice</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground">{conditions.enrichment}</p>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

export function ConditionsSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-md bg-card">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CradContent>
          </Card>
        ))}
      </div>
       <Skeleton className="h-24 w-full mt-8" />
    </div>
  );
}
