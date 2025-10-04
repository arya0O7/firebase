
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ScanLine, Lightbulb, Loader2, ArrowRight, Sparkles, Info, LocateFixed, Wand2 } from 'lucide-react';
import { PrescriptionScanner } from './prescription-scanner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Pharmacy, Medicine } from '@/types';
import { Badge } from '../ui/badge';
import {
  getMedicineInformation,
  getAlternativeSuggestions,
} from '@/app/actions';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDistance } from '@/lib/utils';

interface MedicineSearchProps {
  pharmacies: Pharmacy[];
}

interface SearchResult {
  medicine: string;
  availability: {
    pharmacy: Pharmacy;
    details?: Medicine;
    distance?: number;
  }[];
}

interface AlternativesState {
    [pharmacyId: string]: {
        loading: boolean;
        suggestions: string[] | null;
        error?: string;
    }
}

export function MedicineSearch({ pharmacies }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<string | null>(null);
  const [showMedicineInfo, setShowMedicineInfo] = useState(false);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [alternativesByPharmacy, setAlternativesByPharmacy] = useState<AlternativesState>({});
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();

  const getLocation = (): Promise<{latitude: number, longitude: number} | null> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            toast({ variant: 'destructive', title: "Unsupported", description: "Geolocation is not supported by your browser." });
            resolve(null);
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
                resolve(location);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({ variant: 'destructive', title: "Location Error", description: "Could not get your location. Please ensure you've granted permission." });
                resolve(null);
            }
        );
    });
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchResult(null);
    setMedicineInfo(null);
    setShowMedicineInfo(false);
    setAlternatives([]);
    setAlternativesByPharmacy({});

    const location = userLocation || await getLocation();

    let availability = pharmacies
      .map(p => {
        const details = p.medicines?.find(m => m.name.toLowerCase() === searchTerm.toLowerCase())
        return {
            pharmacy: p,
            details: details,
            distance: location ? getDistance(location.latitude, location.longitude, p.latitude, p.longitude) : undefined
        }
      });
    
    if (location && availability.length > 0) {
        availability.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    const foundInAnyPharmacy = availability.some(item => item.details && item.details.stock > 0);

    const result = {
      medicine: searchTerm,
      availability,
    };
    setSearchResult(result);

    try {
      const infoPromise = getMedicineInformation({ medicineName: searchTerm });
      const infoResult = await infoPromise;
      if(infoResult) {
        setMedicineInfo(infoResult.summary);
      }
    } catch (error) {
      console.error("Failed to get medicine info:", error);
    }
    
    if (!foundInAnyPharmacy) {
        try {
            const alternativesPromise = getAlternativeSuggestions({ medicineName: searchTerm });
            const alternativesResult = await alternativesPromise;
            if(alternativesResult) {
                setAlternatives(alternativesResult.alternatives);
            }
        } catch (error) {
            console.error("Failed to get alternatives:", error);
        }
    }

    setIsLoading(false);
  };

  const findAlternativesInStore = async (pharmacyId: string, medicineName: string) => {
    setAlternativesByPharmacy(prev => ({
        ...prev,
        [pharmacyId]: { loading: true, suggestions: null }
    }));
    try {
        const result = await getAlternativeSuggestions({ medicineName });
        const pharmacy = pharmacies.find(p => p.id === pharmacyId);
        // Filter alternatives to only those in stock at this specific pharmacy
        const availableAlternatives = result.alternatives.filter(alt => 
            pharmacy?.medicines?.some(m => m.name.toLowerCase() === alt.toLowerCase() && m.stock > 0)
        );

        setAlternativesByPharmacy(prev => ({
            ...prev,
            [pharmacyId]: { loading: false, suggestions: availableAlternatives }
        }));
    } catch (error) {
        console.error("Failed to get alternatives for store:", error);
        setAlternativesByPharmacy(prev => ({
            ...prev,
            [pharmacyId]: { loading: false, suggestions: null, error: "Failed to fetch suggestions." }
        }));
    }
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto p-4 sm:p-6 shadow-lg">
        <CardContent className="p-0">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for Paracetamol, Ibuprofen..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="ml-2">Search</span>
              </Button>
              <PrescriptionScanner pharmacies={pharmacies} />
            </div>
          </form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center mt-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {hasSearched && !isLoading && searchResult && (
        <div className="max-w-4xl mx-auto mt-8 space-y-6">
            <h2 className="text-2xl font-headline font-bold">Search Results for &quot;{searchResult?.medicine}&quot;</h2>
            
            {medicineInfo && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowMedicineInfo(!showMedicineInfo)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {showMedicineInfo ? 'Hide Info' : `Get Info about ${searchResult.medicine}`}
                </Button>

                {showMedicineInfo && (
                  <Card className="bg-primary/5 mt-4">
                      <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-primary mt-1" />
                              <div>
                                  <h3 className="font-bold text-primary">About this medicine</h3>
                                  <p className="text-sm text-foreground/80">{medicineInfo}</p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                )}
              </div>
            )}

            {searchResult?.availability && searchResult.availability.length > 0 ? (
                <div>
                    <h3 className="font-bold mb-2">Availability {userLocation ? "(Sorted by nearest)" : ""}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResult.availability.map(({pharmacy, details, distance}) => {
                            const pharmacyAlternatives = alternativesByPharmacy[pharmacy.id];
                            const isOutOfStock = !details || details.stock === 0;
                            return (
                            <Card key={pharmacy.id} className="flex flex-col">
                                <CardContent className="p-4 flex-grow">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className='flex-1'>
                                            <p className="font-bold">{pharmacy.name}</p>
                                            <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                                            {distance !== undefined && <p className="text-sm font-bold text-primary mt-1">{distance.toFixed(2)} km away</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {details && details.stock > 0 ? (
                                                <>
                                                    <p className="font-bold text-lg text-primary">₹{details.price.toFixed(2)}</p>
                                                    <Badge variant="default" className="bg-green-500 text-white">
                                                        {details.stock} in stock
                                                    </Badge>
                                                </>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Out of stock
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {isOutOfStock && (
                                        <div className="mt-3 pt-3 border-t">
                                            {pharmacyAlternatives?.loading ? (
                                                <div className='flex items-center justify-center'>
                                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                                </div>
                                            ) : pharmacyAlternatives?.suggestions ? (
                                                <div>
                                                    <h4 className='text-sm font-semibold mb-1'>Alternatives in this store:</h4>
                                                    {pharmacyAlternatives.suggestions.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {pharmacyAlternatives.suggestions.map(alt => (
                                                                <Badge key={alt} variant="secondary">{alt}</Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className='text-sm text-muted-foreground'>No alternatives available in this store.</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-full"
                                                    onClick={() => findAlternativesInStore(pharmacy.id, searchTerm)}>
                                                    <Wand2 className="mr-2 h-4 w-4"/> Find Alternatives in this store
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="p-2 bg-slate-50">
                                    <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
                                        <Link href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`} target="_blank" rel="noopener noreferrer">
                                            Get Directions <ArrowRight className="ml-2" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )})}
                    </div>
                </div>
            ) : (
                <p>Not found in any nearby pharmacies.</p>
            )}

            {alternatives.length > 0 && (
                <Card className="bg-accent/10 border-accent">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-accent-foreground mt-1" />
                            <div>
                                <h3 className="font-bold text-accent-foreground">Alternative Suggestions</h3>
                                <p className="text-sm text-foreground/80 mb-2">Since this medicine is not available nearby, here are some common over-the-counter alternatives you might find:</p>
                                <div className="flex flex-wrap gap-2">
                                    {alternatives.map(alt => <Badge key={alt} variant="outline">{alt}</Badge>)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
          </div>
      )}
    </>
  );
}
