
'use client';

import * as React from 'react';
import { UserHeader } from '@/components/layout/user-header';
import { MedicineSearch } from '@/components/user/medicine-search';
import { getPharmacies } from '@/app/actions';
import type { Pharmacy } from '@/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPharmacies() {
      try {
        const fetchedPharmacies = await getPharmacies();
        setPharmacies(fetchedPharmacies);
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
        // Handle error state if needed
      } finally {
        setIsLoading(false);
      }
    }
    fetchPharmacies();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
            Find Your Medicines, Instantly.
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Search for medicines, check availability in nearby pharmacies, or scan your prescription to get started.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="max-w-3xl mx-auto">
             <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <MedicineSearch pharmacies={pharmacies} />
        )}

      </main>
      <footer className="w-full bg-secondary/50 py-4 mt-auto">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} PharmaFind AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
