
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Store, Loader2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { addPharmacy, deletePharmacy } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Pharmacy } from '@/types';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PharmacyInventoryTable } from './pharmacy-inventory-table';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface PharmacyManagementProps {
    initialPharmacies: Pharmacy[];
}

export function PharmacyManagement({ initialPharmacies }: PharmacyManagementProps) {
    const [pharmacies, setPharmacies] = React.useState(initialPharmacies);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        const q = query(collection(db, 'pharmacies'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const pharmaciesData: Pharmacy[] = [];
            querySnapshot.forEach((doc) => {
                pharmaciesData.push({ id: doc.id, ...doc.data() } as Pharmacy);
            });
            // Sort by name for consistent ordering
            pharmaciesData.sort((a, b) => a.name.localeCompare(b.name));
            setPharmacies(pharmaciesData);
        });

        return () => unsubscribe();
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const latitude = parseFloat(formData.get('latitude') as string);
        const longitude = parseFloat(formData.get('longitude') as string);

        try {
            await addPharmacy({ name, address, latitude, longitude });
            toast({ title: 'Success', description: 'Pharmacy added successfully.' });
            setIsFormOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add pharmacy.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (pharmacyId: string) => {
        try {
            await deletePharmacy(pharmacyId);
            toast({ title: 'Success', description: 'Pharmacy removed successfully.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove pharmacy.' });
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Pharmacy
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Add New Pharmacy</DialogTitle>
                                <DialogDescription>
                                    Enter the details of your new store.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" name="name" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="address" className="text-right">Address</Label>
                                    <Input id="address" name="address" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="latitude" className="text-right">Latitude</Label>
                                    <Input id="latitude" name="latitude" type="number" step="any" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="longitude" className="text-right">Longitude</Label>
                                    <Input id="longitude" name="longitude" type="number" step="any" className="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Pharmacy
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="space-y-6">
                {pharmacies.map(pharmacy => (
                    <Collapsible key={pharmacy.id} open={openCollapsible === pharmacy.id} onOpenChange={(isOpen) => setOpenCollapsible(isOpen ? pharmacy.id : null)}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setOpenCollapsible(openCollapsible === pharmacy.id ? null : pharmacy.id)}>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Store className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="font-headline text-xl">{pharmacy.name}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertDialog onOpenChange={(e) => e.stopPropagation()} >
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove the pharmacy and all its inventory data.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(pharmacy.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            {openCollapsible === pharmacy.id ? <ChevronUp /> : <ChevronDown />}
                                            <span className="sr-only">Toggle Inventory</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-2 text-muted-foreground">
                                    <MapPin className="w-5 h-5 mt-1 shrink-0" />
                                    <p>{pharmacy.address}</p>
                                </div>
                            </CardContent>
                            <CollapsibleContent>
                                <CardFooter className="flex-col items-start">
                                    <h3 className="text-lg font-semibold mb-4 ml-1">Inventory for {pharmacy.name}</h3>
                                    <PharmacyInventoryTable pharmacy={pharmacy} />
                                </CardFooter>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>
            {pharmacies.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No pharmacies found. Add your first one!</p>
                </div>
            )}
        </div>
    )
}
