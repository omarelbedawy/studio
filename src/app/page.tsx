import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body flex items-center justify-center">
      <main className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg bg-card border-none">
          <CardHeader className="text-center p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-headline font-bold text-foreground">Green-AI</h1>
            </div>
            <CardDescription className="text-lg text-muted-foreground">
              Welcome! Your AI-powered plant care assistant.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col gap-4">
            <Link href="/login" passHref legacyBehavior>
              <Button asChild className="w-full py-6 text-lg"><a>Login</a></Button>
            </Link>
            <Link href="/signup" passHref legacyBehavior>
              <Button asChild variant="outline" className="w-full py-6 text-lg"><a>Sign Up</a></Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
