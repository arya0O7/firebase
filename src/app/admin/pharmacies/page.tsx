
import { PharmacyManagement } from '@/components/admin/pharmacy-management';
import { getPharmacies } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function PharmaciesPage() {
    // This fetches the initial data. Real-time updates will be handled by the client component.
    const initialPharmacies = await getPharmacies();

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Pharmacy & Inventory</h1>
                <p className="text-muted-foreground">Manage your pharmacy stores and their individual inventories.</p>
            </div>

            <PharmacyManagement initialPharmacies={initialPharmacies} />
        </div>
    );
}

