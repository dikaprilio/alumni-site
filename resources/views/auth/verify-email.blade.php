<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Anda</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card shadow p-4 p-md-5" style="width: 550px;">
        <div class="text-center mb-4">
            <h3 class="fw-bold">Satu Langkah Lagi!</h3>
            <p class="text-muted fs-6">
                Terima kasih telah mendaftar. Sebelum memulai, mohon verifikasi alamat email Anda dengan mengklik link yang baru saja kami kirimkan ke email Anda.
            </p>
            <p class="text-muted small">
                Jika Anda tidak menerima email tersebut, kami dengan senang hati akan mengirimkan yang baru.
            </p>
        </div>

        @if (session('status') == 'verification-link-sent')
            <div class="alert alert-success text-center">
                Link verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
            </div>
        @endif

        <div class="d-flex justify-content-center gap-3 mt-4">
            {{-- Form untuk kirim ulang email --}}
            <form action="{{ route('verification.send') }}" method="POST" class="d-inline">
                @csrf
                <button type="submit" class="btn btn-primary">
                    Kirim Ulang Email Verifikasi
                </button>
            </form>
            
            {{-- Form untuk logout --}}
            <form action="{{ route('logout') }}" method="POST" class="d-inline">
                @csrf
                <button type="submit" class="btn btn-outline-danger">
                    Logout
                </button>
            </form>
        </div>
    </div>

</body>
</html>