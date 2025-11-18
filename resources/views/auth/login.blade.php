<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Alumni Site</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4" style="width: 400px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Login Alumni</h3>
            <p class="text-muted">Masuk untuk reuni kembali!</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login.process') }}" method="POST">
            @csrf <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="admin@alumni.com" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="password" required>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2">Masuk Sekarang</button>
        </form>
    </div>

</body>
</html>