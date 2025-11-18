<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Dashboard')</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                           50: '#FFF0F7',
                           100: '#FFE0F0',
                           500: '#F52A91', // Warna Utama
                           600: '#D9117A',
                           900: '#830042',
                        },
                        dark: '#0F172A'
                    },
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom Scrollbar biar cantik */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-[#F7F8FC] text-slate-800 font-sans antialiased">

    <div class="flex h-screen overflow-hidden">
        
        <aside class="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between">
            <div>
                <div class="h-20 flex items-center px-8 border-b border-slate-50">
                    <div class="flex items-center gap-3 text-brand-500">
                        <i class="fa-solid fa-graduation-cap text-3xl"></i>
                        <span class="text-xl font-bold tracking-tight text-slate-800">Alumni<span class="text-brand-500">Portal</span></span>
                    </div>
                </div>

                <nav class="p-4 space-y-1">
                    <p class="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
                    
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {{ Request::is('admin/dashboard') ? 'bg-brand-50 text-brand-600 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' }}">
                        <i class="fa-solid fa-grid-2 w-5"></i> Dashboard
                    </a>

                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200">
                        <i class="fa-solid fa-users w-5"></i> Data Alumni
                    </a>

                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200">
                        <i class="fa-solid fa-briefcase w-5"></i> Lowongan Kerja
                    </a>

                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200">
                        <i class="fa-solid fa-calendar-day w-5"></i> Event & Reuni
                    </a>
                </nav>
            </div>

            <div class="p-4 border-t border-slate-50">
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout
                    </button>
                </form>
            </div>
        </aside>

        <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
            
            <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
                <div class="w-96">
                    <div class="relative">
                        <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400"></i>
                        <input type="text" placeholder="Cari alumni, pekerjaan, event..." class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-full focus:ring-2 focus:ring-brand-100 focus:bg-white transition-all text-sm">
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <button class="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
                        <i class="fa-solid fa-bell text-xl"></i>
                        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    
                    <div class="flex items-center gap-3 pl-6 border-l border-slate-100">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-bold text-slate-800">{{ Auth::user()->name }}</p>
                            <p class="text-xs text-slate-500">Administrator</p>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                            {{ substr(Auth::user()->name, 0, 1) }}
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto bg-[#F7F8FC] p-8">
                @yield('content')
            </main>

        </div>
    </div>

    @stack('scripts')
</body>
</html>