import React from 'react';

export default function MonthYearPicker({ label, value, onChange, error, disabled = false }) {
    const currentYear = new Date().getFullYear();

    // Parse existing value
    let selectedYear = '';
    let selectedMonth = '';

    if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            selectedYear = date.getFullYear();
            selectedMonth = date.getMonth(); // 0-11
        }
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate years (Current + 1 down to 1970)
    const years = Array.from({ length: currentYear - 1970 + 2 }, (_, i) => (currentYear + 1) - i);

    const updateDate = (newMonth, newYear) => {
        if (newMonth === '' || newYear === '') return;

        // Format: YYYY-MM-DD (Always 01 for day)
        const monthStr = String(parseInt(newMonth) + 1).padStart(2, '0');
        const dateStr = `${newYear}-${monthStr}-01`;
        onChange(dateStr);
    };

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        // If year is not selected, default to current year
        const year = selectedYear || currentYear;
        updateDate(newMonth, year);
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        // If month is not selected, default to January (0)
        const month = selectedMonth !== '' ? selectedMonth : 0;
        updateDate(month, newYear);
    };

    return (
        <div className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
            <div className="flex gap-2">
                {/* MONTH SELECT */}
                <div className="relative flex-1">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none rounded-xl appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Month</option>
                        {months.map((m, i) => (
                            <option key={i} value={i}>{m}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                </div>

                {/* YEAR SELECT */}
                <div className="relative flex-1">
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none rounded-xl appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
