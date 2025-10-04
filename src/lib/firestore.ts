
import { db } from './firebase';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import type { Pharmacy, Medicine } from '@/types';
import { mockPharmacies } from './mock-data';

const PHARMACIES_COLLECTION = 'pharmacies';

// Function to seed database with mock data if it's empty
export const seedDatabase = async () => {
    const pharmaciesCollection = collection(db, PHARMACIES_COLLECTION);
    const snapshot = await getDocs(pharmaciesCollection);
    if (snapshot.empty) {
        console.log('Database is empty, seeding with mock data...');
        const batch = writeBatch(db);
        mockPharmacies.forEach((pharmacy) => {
            const { id, ...pharmacyData } = pharmacy;
            const docRef = doc(db, PHARMACIES_COLLECTION, id);
            batch.set(docRef, pharmacyData);
        });
        await batch.commit();
        console.log('Database seeded successfully.');
    } else {
        console.log('Database already contains data, skipping seed.');
    }
};

export const getPharmacies = async (): Promise<Pharmacy[]> => {
    // Ensure data is seeded if collection is empty
    await seedDatabase();
    
    const pharmaciesCollection = collection(db, PHARMACIES_COLLECTION);
    const pharmacySnapshot = await getDocs(pharmaciesCollection);
    const pharmacyList = pharmacySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pharmacy));
    return pharmacyList;
};

export const addPharmacy = async (pharmacy: Omit<Pharmacy, 'id' | 'medicines'>): Promise<Pharmacy> => {
    const newPharmacyRef = await addDoc(collection(db, PHARMACIES_COLLECTION), {
        ...pharmacy,
        medicines: [], // Start with empty inventory
    });
    return {
        id: newPharmacyRef.id,
        ...pharmacy,
        medicines: [],
    };
};

export const deletePharmacy = async (pharmacyId: string): Promise<void> => {
    const pharmacyDoc = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    await deleteDoc(pharmacyDoc);
};

export const addMedicineToPharmacy = async (pharmacyId: string, medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
    const pharmacyRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const pharmacySnap = await getDoc(pharmacyRef);

    if (!pharmacySnap.exists()) {
        throw new Error('Pharmacy not found');
    }

    const pharmacyData = pharmacySnap.data() as Omit<Pharmacy, 'id'>;
    const newMedicine: Medicine = {
        ...medicine,
        id: `med${Date.now()}`,
    };

    const updatedMedicines = [newMedicine, ...(pharmacyData.medicines || [])];
    await updateDoc(pharmacyRef, { medicines: updatedMedicines });

    return newMedicine;
};

export const updateMedicineInPharmacy = async (pharmacyId: string, updatedMedicine: Medicine): Promise<Medicine> => {
    const pharmacyRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const pharmacySnap = await getDoc(pharmacyRef);

    if (!pharmacySnap.exists()) {
        throw new Error('Pharmacy not found');
    }

    const pharmacyData = pharmacySnap.data() as Omit<Pharmacy, 'id'>;
    const medicineIndex = pharmacyData.medicines?.findIndex(m => m.id === updatedMedicine.id) ?? -1;

    if (medicineIndex === -1) {
        throw new Error('Medicine not found in this pharmacy');
    }

    const updatedMedicines = [...(pharmacyData.medicines || [])];
    updatedMedicines[medicineIndex] = updatedMedicine;

    await updateDoc(pharmacyRef, { medicines: updatedMedicines });

    return updatedMedicine;
};

export const deleteMedicineFromPharmacy = async (pharmacyId: string, medicineId: string): Promise<void> => {
    const pharmacyRef = doc(db, PHARMACIES_COLLECTION, pharmacyId);
    const pharmacySnap = await getDoc(pharmacyRef);

    if (!pharmacySnap.exists()) {
        throw new Error('Pharmacy not found');
    }
    
    const pharmacyData = pharmacySnap.data() as Omit<Pharmacy, 'id'>;
    const updatedMedicines = pharmacyData.medicines?.filter(m => m.id !== medicineId) || [];

    await updateDoc(pharmacyRef, { medicines: updatedMedicines });
};
