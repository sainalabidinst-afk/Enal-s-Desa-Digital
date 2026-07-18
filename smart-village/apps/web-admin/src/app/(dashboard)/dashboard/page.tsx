import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Penduduk',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Surat Keluar',
      value: '156',
      change: '+8.2%',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Pengaduan',
      value: '23',
      change: '-2.4%',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
    {
      title: 'Pertumbuhan',
      value: '12.5%',
      change: '+4.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan data desa dalam satu tampilan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>{' '}
                dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Statistik bulanan untuk tahun 2024
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pengaduan Terbaru</CardTitle>
            <CardDescription>
              Ada 23 pengaduan yang perlu ditindaklanjuti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Jalan Rusak di RT 03
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dilaporkan 2 jam yang lalu
                  </p>
                </div>
                <div className="ml-auto font-medium text-orange-600">Pending</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lampu Jalan Mati
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dilaporkan 5 jam yang lalu
                  </p>
                </div>
                <div className="ml-auto font-medium text-blue-600">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
