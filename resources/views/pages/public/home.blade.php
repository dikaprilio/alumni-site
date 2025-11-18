<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang di Portal Alumni</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="container text-center">
        <h1 class="display-4 fw-bold mb-3">Portal Alumni</h1>
        <p class="lead text-muted mb-4">Website untuk menghubungkan para alumni.</p>
        
        <div class="d-flex justify-content-center gap-3">
            {{-- LOGIKA AUTH: Cek apakah user sudah login --}}
            @auth
                {{-- Jika SUDAH Login, tampilkan tombol ke Dashboard --}}
                @if(Auth::user()->role == 'admin')
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-primary btn-lg px-4">Ke Dashboard Admin</a>
                @else
                    <a href="{{ route('alumni.home') }}" class="btn btn-primary btn-lg px-4">Ke Beranda Alumni</a>
                @endif

                {{-- Tombol Logout --}}
                <form action="{{ route('logout') }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-outline-danger btn-lg px-4">Logout</button>
                </form>
            @else
                {{-- Jika BELUM Login, tampilkan tombol Login/Register --}}
                <a href="{{ route('login') }}" class="btn btn-primary btn-lg px-4">Login Alumni</a>
                <a href="{{ route('register.step1') }}" class="btn btn-outline-secondary btn-lg px-4">Registrasi</a>
            @endauth
        </div>

        @guest
            <div class="mt-5">
                <a href="{{ route('admin.login') }}" class="text-muted small">Login sebagai Admin</a>
            </div>
        @endguest
    </div>

</body>
</html>