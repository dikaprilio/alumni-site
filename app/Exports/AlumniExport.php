<?php

namespace App\Exports;

use App\Models\Alumni;
// --- ADD THESE IMPORTS (Fixes 'undefined type FromQuery' etc) ---
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
// ------------------------------------------------

class AlumniExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query;
    }

    // Header Kolom Excel
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIM',
            'Tahun Lulus',
            'Jurusan',
            'Email Akun',
            'No. HP',
            'Posisi Kerja',
            'Perusahaan',
            'Alamat',
        ];
    }

    // Mapping Data Database ke Kolom Excel
    public function map($alumni): array
    {
        return [
            $alumni->name,
            $alumni->nim,
            $alumni->graduation_year,
            $alumni->major,
            $alumni->user ? $alumni->user->email : '-', // Ambil email dari relasi user
            $alumni->phone_number,
            $alumni->current_position,
            $alumni->company_name,
            $alumni->address,
        ];
    }

    // Styling: Bold Header
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}