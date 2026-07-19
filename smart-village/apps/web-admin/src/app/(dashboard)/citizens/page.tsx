import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Citizen {
  id: string;
  nik: string;
  name: string;
  gender: string;
  address: string;
  rt: string;
  rw: string;
  isAlive: boolean;
}

async function getCitizens(page = 1): Promise<{ data: Citizen[]; total: number; totalPages: number }> {
  // Mock data - replace with actual API call
  return {
    data: Array.from({ length: 10 }, (_, i) => ({
      id: `citizen-${i}`,
      nik: `320101${String(i).padStart(6, '0')}0001`,
      name: `Warga ${i + 1}`,
      gender: i % 2 === 0 ? 'LAKI_LAKI' : 'PEREMPUAN',
      address: `Jl. Desa No. ${i + 1}`,
      rt: '001',
      rw: '001',
      isAlive: true,
    })),
    total: 100,
    totalPages: 10,
  };
}

export default async function CitizensPage() {
  const { data: citizens } = await getCitizens();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Penduduk</h1>
          <p className="text-muted-foreground">
            Kelola data penduduk desa
          </p>
        </div>
        <Button asChild>
          <Link href="/citizens/create">Tambah Penduduk</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Input placeholder="Cari nama atau NIK..." className="max-w-sm" />
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">NIK</th>
                    <th className="text-left p-2">Nama</th>
                    <th className="text-left p-2">JK</th>
                    <th className="text-left p-2">Alamat</th>
                    <th className="text-left p-2">RT/RW</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2">{c.nik}</td>
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.gender === 'LAKI_LAKI' ? 'L' : 'P'}</td>
                      <td className="p-2">{c.address}</td>
                      <td className="p-2">{c.rt}/{c.rw}</td>
                      <td className="p-2">
                        <Badge variant={c.isAlive ? 'default' : 'destructive'}>
                          {c.isAlive ? 'Hidup' : 'Meninggal'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/citizens/${c.id}`}>Detail</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}