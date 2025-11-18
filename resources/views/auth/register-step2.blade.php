<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi Alumni - Langkah 2</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4" style="width: 400px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Buat Akun Anda</h3>
            <p class="text-muted">NIM <strong class="text-success">{{ $nim }}</strong> terverifikasi atas nama <strong>{{ $nama ?? 'Alumni' }}</strong>.</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('register.process') }}" method="POST">
            @csrf
            {{-- Kirim NIM tersembunyi --}}
            <input type="hidden" name="nim" value="{{ $nim }}">
            
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="email@anda.com" value="{{ old('email') }}" required>
                <div class="form-text">Email ini akan digunakan untuk login dan verifikasi.</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="Minimal 8 karakter" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Konfirmasi Password</label>
                <input type="password" name="password_confirmation" class="form-control" placeholder="Ulangi password" required>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2">Daftar & Buat Akun</button>
        </form>
    </div>

</body>
</html>