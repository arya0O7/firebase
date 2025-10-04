import type { Pharmacy } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Pill, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`;
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <Pill className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">{pharmacy.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5 mt-1 shrink-0" />
          <p>{pharmacy.address}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href={mapsLink} target="_blank" rel="noopener noreferrer">
                Get Directions <ArrowRight className="ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
