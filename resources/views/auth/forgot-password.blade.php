<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupa Password - Alumni Site</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4" style="width: 400px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Lupa Password</h3>
            <p class="text-muted">Masukkan email alumni Anda. Kami akan mengirimkan link untuk reset password.</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('password.email') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="alumni@alumni.com" value="{{ old('email') }}" required>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2">Kirim Link Reset</button>
        </form>

        <div class="text-center mt-4">
            <p class="text-muted small">
                Ingat passwordnya? <a href="{{ route('login') }}">Login di sini</a>
            </p>
        </div>
    </div>

</body>
</html>