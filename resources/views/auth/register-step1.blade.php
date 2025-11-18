<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi Alumni - Langkah 1</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4" style="width: 400px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Registrasi Alumni</h3>
            <p class="text-muted">Langkah 1: Validasi NIM</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('register.checkNim') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label">NIM (Nomor Induk Mahasiswa)</label>
                <input type="text" name="nim" class="form-control" placeholder="Contoh: J3D119002" value="{{ old('nim') }}" required>
                <div class="form-text">Masukkan NIM Anda untuk memvalidasi data alumni.</div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2">Cek NIM</button>
        </form>

        <div class="text-center mt-4">
            <p class="text-muted small">
                Sudah punya akun? <a href="{{ route('login') }}">Login di sini</a>
            </p>
        </div>
    </div>

</body>
</html>