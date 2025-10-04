
'use server';

import { getAlternativeSuggestions as getAlternativeSuggestionsFlow } from '@/ai/flows/alternative-suggestions';
import { getMedicineInformation as getMedicineInformationFlow } from '@/ai/flows/medicine-information';
import { scanPrescription as scanPrescriptionFlow } from '@/ai/flows/prescription-scanner';


import type { AlternativeSuggestionsInput, AlternativeSuggestionsOutput } from '@/ai/flows/alternative-suggestions';
import type { GetMedicineInformationInput, GetMedicineInformationOutput } from '@/ai/flows/medicine-information';
import type { ScanPrescriptionInput, ScanPrescriptionOutput } from '@/ai/flows/prescription-scanner';

import * as firestoreService from '@/lib/firestore';
import type { Medicine, Pharmacy } from '@/types';

// AI-powered actions
export async function getAlternativeSuggestions(input: AlternativeSuggestionsInput): Promise<AlternativeSuggestionsOutput> {
  return await getAlternativeSuggestionsFlow(input);
}

export async function getMedicineInformation(input: GetMedicineInformationInput): Promise<GetMedicineInformationOutput> {
  return await getMedicineInformationFlow(input);
}

interface ScanPrescriptionForAvailabilityInput {
  prescriptionImage: string;
}

interface ScanPrescriptionForAvailabilityOutput extends ScanPrescriptionOutput {
    availability: {
        pharmacyId: string;
        medicinesInStock: string[];
    }[];
}


export async function scanPrescriptionForAvailability(input: ScanPrescriptionForAvailabilityInput): Promise<ScanPrescriptionForAvailabilityOutput> {
  const pharmacies = await firestoreService.getPharmacies();
  // 1. AI scans the image to get a list of medicine names
  const aiResult = await scanPrescriptionFlow({ prescriptionImage: input.prescriptionImage });

  // 2. Server checks availability for those medicines in all pharmacies
  const availability = pharmacies.map(p => {
    const medicinesInStock = aiResult.medicines.filter(medName => {
        const foundMed = p.medicines.find(m => m.name.toLowerCase() === medName.toLowerCase());
        return foundMed && foundMed.stock > 0;
    });
    return {
        pharmacyId: p.id,
        medicinesInStock: medicinesInStock,
    }
  });

  return { ...aiResult, availability };
}



// Firestore Data Management Actions
export async function getPharmacies(): Promise<Pharmacy[]> {
    return firestoreService.getPharmacies();
}

export async function addPharmacy(pharmacy: Omit<Pharmacy, 'id' | 'medicines'>): Promise<Pharmacy> {
    return firestoreService.addPharmacy(pharmacy);
}

export async function deletePharmacy(pharmacyId: string): Promise<{ success: boolean }> {
    await firestoreService.deletePharmacy(pharmacyId);
    return { success: true };
}


export async function addMedicineToPharmacy(pharmacyId: string, medicine: Omit<Medicine, 'id'>): Promise<Medicine> {
    return firestoreService.addMedicineToPharmacy(pharmacyId, medicine);
}

export async function updateMedicineInPharmacy(pharmacyId: string, updatedMedicine: Medicine): Promise<Medicine> {
    return firestoreService.updateMedicineInPharmacy(pharmacyId, updatedMedicine);
}

export async function deleteMedicineFromPharmacy(pharmacyId: string, medicineId: string): Promise<{ success: boolean }> {
    await firestoreService.deleteMedicineFromPharmacy(pharmacyId, medicineId);
    return { success: true };
}
