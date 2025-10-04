
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ScanLine, Upload, CheckCircle, XCircle, LocateFixed, ArrowRight } from 'lucide-react';
import { scanPrescriptionForAvailability } from '@/app/actions';
import type { Pharmacy } from '@/types';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { getDistance } from '@/lib/utils';

interface PrescriptionScannerProps {
    pharmacies: Pharmacy[];
}

interface AvailabilityResult {
    pharmacy: Pharmacy;
    medicinesInStock: string[];
    distance?: number;
}

interface ScanResult {
    medicines: string[];
    availability: AvailabilityResult[];
}

export function PrescriptionScanner({ pharmacies }: PrescriptionScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        try {
            const scanResult = await scanPrescriptionForAvailability({ prescriptionImage: base64String });
            
            const availablePharmacies = scanResult.availability
                .map(item => ({
                    pharmacy: pharmacies.find(p => p.id === item.pharmacyId)!,
                    medicinesInStock: item.medicinesInStock,
                }))
                .filter(item => item.medicinesInStock.length > 0);

            setResult({
                medicines: scanResult.medicines,
                availability: availablePharmacies
            });

        } catch (error) {
            console.error('Failed to scan prescription:', error);
            toast({ variant: 'destructive', title: 'Scan Failed', description: 'Could not process the prescription image.' });
        } finally {
            setIsLoading(false);
        }
    };
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
        toast({ variant: 'destructive', title: "Unsupported", description: "Geolocation is not supported by your browser." });
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            setUserLocation(location);
            toast({ title: "Location Found", description: "Sorting results by nearest pharmacy." });

            if (result) {
                const sortedAvailability = [...result.availability]
                    .map(item => ({
                        ...item,
                        distance: getDistance(location.latitude, location.longitude, item.pharmacy.latitude, item.pharmacy.longitude)
                    }))
                    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
                
                setResult({ ...result, availability: sortedAvailability });
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            toast({ variant: 'destructive', title: "Location Error", description: "Could not get your location. Please ensure you've granted permission." });
        }
    );
  }

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setIsLoading(false);
    setResult(null);
    setUserLocation(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            resetState();
        }
        setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <ScanLine />
          <span className="ml-2">Scan Prescription</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Scan Your Prescription</DialogTitle>
          <DialogDescription>
            Upload an image of your prescription, and we&apos;ll check medicine availability for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="prescription">Upload Image</Label>
              <Input id="prescription" type="file" accept="image/*" onChange={handleFileChange} className="file:rounded-md file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:hover:bg-primary/90" />
            </div>
            {preview && (
              <div className="relative w-full aspect-square border rounded-md overflow-hidden">
                <Image src={preview} alt="Prescription preview" layout="fill" objectFit="contain" />
              </div>
            )}
             <Button onClick={handleScan} disabled={!file || isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : <Upload />}
              <span className="ml-2">Scan and Check Availability</span>
            </Button>
          </div>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h3 className="font-semibold text-lg">Results</h3>
                {result && result.availability.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleGetLocation} disabled={!!userLocation}>
                        <LocateFixed className="mr-2 h-4 w-4" />
                        {userLocation ? "Sorted by Nearest" : "Use My Location"}
                    </Button>
                )}
            </div>

            {isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}
            {result && (
                <div className='space-y-4'>
                     <div>
                        <h4 className="font-semibold mb-2">Medicines Found:</h4>
                        {result.medicines.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {result.medicines.map(med => <Badge key={med} variant="secondary">{med}</Badge>)}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Could not identify any medicines on the prescription.</p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Availability:</h4>
                        {result.availability.length > 0 ? (
                            <div className="space-y-2">
                            {result.availability.map(item => {
                                const pharmacy = item.pharmacy;
                                return (
                                    <Card key={pharmacy.id} className="flex flex-col">
                                        <CardContent className="p-3 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold">{pharmacy?.name}</p>
                                                    {item.distance && (
                                                        <p className="text-sm font-bold text-primary">{item.distance.toFixed(2)} km away</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.medicinesInStock.map(med => (
                                                    <Badge key={med} className="bg-green-100 text-green-800">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        {med}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-2 bg-slate-50 mt-auto">
                                            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
                                                <Link href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`} target="_blank" rel="noopener noreferrer">
                                                    Get Directions <ArrowRight className="ml-2" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                            </div>
                        ) : (
                             <p className="text-sm text-muted-foreground text-center py-4">None of the identified medicines are available in nearby stores.</p>
                        )}
                    </div>
                </div>
            )}
            {!isLoading && !result && (
                 <div className="flex items-center justify-center h-full bg-muted/50 rounded-md">
                    <p className="text-muted-foreground p-8 text-center">Scan results will appear here.</p>
                 </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
