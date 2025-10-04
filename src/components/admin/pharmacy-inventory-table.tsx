
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, FileEdit, Trash2, Loader2 } from 'lucide-react';
import {
  addMedicineToPharmacy,
  updateMedicineInPharmacy,
  deleteMedicineFromPharmacy,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Medicine, Pharmacy } from '@/types';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
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
  } from "@/components/ui/alert-dialog"

interface PharmacyInventoryTableProps {
  pharmacy: Pharmacy;
}

export function PharmacyInventoryTable({ pharmacy }: PharmacyInventoryTableProps) {
  const [inventory, setInventory] = React.useState(pharmacy.medicines);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentMedicine, setCurrentMedicine] = React.useState<Medicine | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setInventory(pharmacy.medicines);
  }, [pharmacy.medicines]);

  const handleAddClick = () => {
    setCurrentMedicine(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setCurrentMedicine(medicine);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const stock = parseInt(formData.get('stock') as string, 10);
    const price = parseFloat(formData.get('price') as string);
    
    try {
        if (currentMedicine) {
            // Update
            const updated = await updateMedicineInPharmacy(pharmacy.id, { ...currentMedicine, name, stock, price });
            setInventory(inventory.map(m => m.id === updated.id ? updated : m));
            toast({ title: 'Success', description: 'Medicine updated successfully.' });
        } else {
            // Add
            const newMedicine = await addMedicineToPharmacy(pharmacy.id, { name, stock, price });
            setInventory([newMedicine, ...inventory]);
            toast({ title: 'Success', description: 'Medicine added successfully.' });
        }
        setIsFormOpen(false);
        setCurrentMedicine(null);
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (medicineId: string) => {
    try {
        await deleteMedicineFromPharmacy(pharmacy.id, medicineId);
        setInventory(inventory.filter(m => m.id !== medicineId));
        toast({ title: 'Success', description: 'Medicine deleted successfully.' });
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete medicine.' });
    }
  };

  return (
    <div className="w-full">
        <div className="flex justify-end mb-4">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddClick} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{currentMedicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to {currentMedicine ? 'update the' : 'add a new'} medicine for {pharmacy.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" defaultValue={currentMedicine?.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">Stock</Label>
                                <Input id="stock" name="stock" type="number" defaultValue={currentMedicine?.stock} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price (₹)</Label>
                                <Input id="price" name="price" type="number" step="0.01" defaultValue={currentMedicine?.price} className="col-span-3" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                               <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {currentMedicine ? 'Save Changes' : 'Add Medicine'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? inventory.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>
                  <Badge variant={medicine.stock > 10 ? 'default' : medicine.stock > 0 ? 'secondary' : 'destructive'} className={cn(
                      medicine.stock > 50 && "bg-green-100 text-green-800 border-green-200",
                      medicine.stock <= 50 && medicine.stock > 10 && "bg-blue-100 text-blue-800 border-blue-200",
                      medicine.stock <= 10 && medicine.stock > 0 && "bg-yellow-100 text-yellow-800 border-yellow-200",
                      medicine.stock === 0 && "bg-red-100 text-red-800 border-red-200"
                  )}>
                    {medicine.stock}
                  </Badge>
                </TableCell>
                <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(medicine)}>
                        <FileEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the medicine
                                from this pharmacy's inventory.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(medicine.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No medicines in this pharmacy. Click "Add Medicine" to start.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

