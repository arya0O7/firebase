import { getPharmacies } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Store, TrendingUp, Users } from 'lucide-react';
import { GrowthChart } from '@/components/admin/growth-chart';

export default async function DashboardPage() {
  const pharmacies = await getPharmacies();
  const totalPharmacies = pharmacies.length;

  const growthData = [
    { month: 'January', signups: 1 },
    { month: 'February', signups: 2 },
    { month: 'March', signups: 5 },
    { month: 'April', signups: 8 },
    { month: 'May', signups: 12 },
    { month: 'June', signups: totalPharmacies },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Here's an overview of your application's status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPharmacies}</div>
            <p className="text-xs text-muted-foreground">
              Pharmacies using the platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+25%</div>
            <p className="text-xs text-muted-foreground">
              Store sign-ups this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Sign-up Growth</CardTitle>
          <CardDescription>
            A look at the number of new stores joining over the past few months.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <GrowthChart data={growthData} />
        </CardContent>
      </Card>
    </div>
  );
}
