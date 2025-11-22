<!DOCTYPE html>
<html>
<head>
    <title>Data Alumni Export</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .header { margin-bottom: 20px; }
        .header h2 { margin: 0; }
        .header p { margin: 2px 0; color: #555; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan Data Alumni</h2>
        <p>Dicetak pada: {{ date('d F Y, H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Lulus</th>
                <th>Jurusan</th>
                <th>Karir</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            @foreach($alumni as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $row->name }}</td>
                <td>{{ $row->nim }}</td>
                <td>{{ $row->graduation_year }}</td>
                <td>{{ $row->major }}</td>
                <td>
                    @if($row->current_position)
                        {{ $row->current_position }} di {{ $row->company_name }}
                    @else
                        -
                    @endif
                </td>
                <td>{{ $row->user ? $row->user->email : '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>