@if ($paginator->hasPages())
    <nav role="navigation" aria-label="{{ __('Pagination Navigation') }}" class="flex items-center justify-center mt-6">
        <ul class="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li>
                    <span class="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed transition-all" aria-hidden="true">
                        <i class="fa-solid fa-chevron-left text-xs"></i>
                    </span>
                </li>
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm" aria-label="@lang('pagination.previous')">
                        <i class="fa-solid fa-chevron-left text-xs"></i>
                    </a>
                </li>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator (Hidden on Mobile) --}}
                @if (is_string($element))
                    <li class="hidden sm:block">
                        <span class="flex items-center justify-center w-9 h-9 rounded-full text-slate-400 font-medium text-sm">
                            {{ $element }}
                        </span>
                    </li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            {{-- Active Page (Always Visible) --}}
                            <li>
                                <span aria-current="page" class="flex items-center justify-center w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/30 border border-brand-500">
                                    {{ $page }}
                                </span>
                            </li>
                        @else
                            {{-- Inactive Pages (Hidden on Mobile, Visible on Tablet+) --}}
                            <li class="hidden sm:block">
                                <a href="{{ $url }}" class="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm">
                                    {{ $page }}
                                </a>
                            </li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li>
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm" aria-label="@lang('pagination.next')">
                        <i class="fa-solid fa-chevron-right text-xs"></i>
                    </a>
                </li>
            @else
                <li>
                    <span class="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed transition-all" aria-hidden="true">
                        <i class="fa-solid fa-chevron-right text-xs"></i>
                    </span>
                </li>
            @endif
        </ul>
    </nav>
@endif