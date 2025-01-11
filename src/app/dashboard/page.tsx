import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ThemeProvider } from '@/components/theme-provider';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  // Acceder a searchParams de manera asíncrona
  const id = searchParams.id;

  // Verificar que id esté definido
  if (!id) {
    return <div>Error: id no está definido</div>;
  }

  // Obtener los datos del dashboard desde la API
  const response = await fetch(`http://localhost:3000/api/dashboard?id=${id}`);
  if (!response.ok) {
    return <div>Error fetching dashboard data</div>;
  }
  const data = await response.json();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Bienvenido, {data.user.login}</h1>
            <p className="text-lg">Días restantes antes de que expire tu acceso: {data.user.daysRemaining}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Aprobadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">R$ {data.totalSales.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Margem de Lucro Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">R$ {data.monthlyProfit.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.availableProducts}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Produtos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.soldProducts}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}