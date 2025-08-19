
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, Sprout, Sun, Thermometer, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

interface Condition {
  title: string;
  icon: LucideIcon;
  content: string;
}

const parseConditions = (text: string): Condition[] => {
  const conditionSections = [
    { title: 'Sunlight', icon: Sun, keywords: ['sunlight', 'sun'] },
    { title: 'Watering', icon: Droplets, keywords: ['watering', 'water'] },
    { title: 'Soil', icon: Sprout, keywords: ['soil'] },
    { title: 'Temperature', icon: Thermometer, keywords: ['temperature'] },
    { title: 'Humidity', icon: Waves, keywords: ['humidity'] },
  ];

  const parsed = new Map<string, { content: string; icon: LucideIcon }>();
  
  // Try splitting by newline first, which is a common format from LLMs
  const lines = text.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
      const trimmedLine = line.trim();
      const firstWord = (trimmedLine.split(/[:\s]/)[0] || '').toLowerCase();
      const matchedCondition = conditionSections.find(c => c.keywords.includes(firstWord));

      if (matchedCondition && !parsed.has(matchedCondition.title)) {
          const content = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
          if (content) {
              parsed.set(matchedCondition.title, { content, icon: matchedCondition.icon });
          }
      }
  }

  // If parsing found something, convert map to array
  if (parsed.size > 0) {
      return Array.from(parsed.entries()).map(([title, { content, icon }]) => ({ title, content, icon }));
  }

  // Fallback for unstructured text: return the whole text in one card
  return [{ title: 'General Conditions', icon: Sprout, content: text }];
};

export function ConditionsDashboard({ conditions, plantName }: { conditions: string; plantName: string }) {
  const parsedConditions = useMemo(() => parseConditions(conditions), [conditions]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-8 capitalize">{plantName} Conditions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parsedConditions.map(({ title, icon: Icon, content }) => (
          <Card key={title} className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="p-2 bg-accent/20 rounded-full">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ConditionsSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-md bg-card">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
