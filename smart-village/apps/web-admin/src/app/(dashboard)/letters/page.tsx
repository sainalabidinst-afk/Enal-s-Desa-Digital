import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Letter {
  id: string;
  letterNumber: string;
  subject: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'SIGNED' | 'CANCELLED';
  citizen: {
    name: string;
    nik: string;
  };
  letterType: {
    name: string;
  };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SIGNED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default async function LettersPage() {
  const letters: Letter[] = Array.from({ length: 10 }, (_, i) => ({
    id: `letter-${i}`,
    letterNumber: `${String(i + 1).padStart(4, '0')}/2026`,
    subject: `Surat ${i + 1}`,
    status: ['PENDING', 'APPROVED', 'SIGNED'][i % 3] as any,
    citizen: {
      name: `Warga ${i + 1}`,
      nik: `320101${String(i).padStart(6, '0')}0001`,
    },
    letterType: {
      name: 'Surat Keterangan Domisili',
    },
    createdAt: new Date().toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pelayanan Surat</h1>
          <p className="text-muted-foreground">
            Kelola pengajuan surat desa
          </p>
        </div>
        <Button asChild>
          <Link href="/letters/create">Buat Surat</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Input placeholder="Cari nomor surat atau pemohon..." className="max-w-sm" />
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">No. Surat</th>
                    <th className="text-left p-2">Jenis</th>
                    <th className="text-left p-2">Pemohon</th>
                    <th className="text-left p-2">Tanggal</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map((l) => (
                    <tr key={l.id} className="border-b">
                      <td className="p-2 font-mono">{l.letterNumber}</td>
                      <td className="p-2">{l.letterType.name}</td>
                      <td className="p-2">{l.citizen.name}</td>
                      <td className="p-2">{new Date(l.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="p-2">
                        <Badge className={statusColors[l.status]}>
                          {l.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/letters/${l.id}`}>Detail</Link>
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