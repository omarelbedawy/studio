
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wifi } from "lucide-react";
import Link from "next/link";

export default function ConnectDevicePage({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | undefined };
  }) {
  const plantName = searchParams?.plantName || "your plant";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                <Wifi className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-headline font-bold text-foreground">Connect ESP32-CAM</h1>
            </div>
          <CardTitle>Wi-Fi Configuration</CardTitle>
          <CardDescription>Follow these steps to connect your device via Access Point (AP) mode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground space-y-2">
                <p>1. Power on your ESP32-CAM.</p>
                <p>2. On your phone or computer, connect to the Wi-Fi network named <strong>"Green-AI-Device"</strong>.</p>
                <p>3. Once connected, a captive portal should open. If not, open a browser and go to <strong>192.168.4.1</strong>.</p>
                <p>4. Enter your home Wi-Fi credentials on the portal to connect the device to your network.</p>
            </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssid">Wi-Fi Network (SSID)</Label>
              <Input id="ssid" placeholder="Your Wi-Fi Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Link href={`/plant-search?plantName=${encodeURIComponent(plantName)}`} passHref>
                <Button asChild className="w-full">
                    <p>Proceed to Dashboard</p>
                </Button>
            </Link>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/plant-search" className="underline">
              Skip and go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
