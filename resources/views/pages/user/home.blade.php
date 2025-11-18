<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Alumni</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4 p-md-5" style="width: 500px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Selamat Datang, Alumni!</h3>
            
            {{-- Menampilkan nama user yang sedang login --}}
            @auth
                <p class="text-muted fs-5">Anda login sebagai: <strong>{{ Auth::user()->name }}</strong></p>
                <p class="text-muted">Ini adalah halaman beranda untuk alumni.</p>
            @endauth
        </div>

        <div class="d-grid gap-3">
            {{-- Tombol untuk mencoba akses admin dashboard --}}
            <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-warning">
                Coba Akses Admin Dashboard (Seharusnya Gagal)
            </a>
    
            {{-- Form untuk logout --}}
            <form action="{{ route('logout') }}" method="POST" class="d-grid">
                @csrf
                <button type="submit" class="btn btn-danger w-100 py-2">
                    Logout
                </button>
            </form>
        </div>
    </div>

</body>
</html>