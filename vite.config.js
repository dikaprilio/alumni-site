// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'; // <--- Import React

export default defineConfig({
    plugins: [
        laravel({
            // Change app.js to app.jsx here
            input: ['resources/css/app.css', 'resources/js/app.jsx'], 
            refresh: true,
        }),
        tailwindcss(),
        react(), // <--- Add React plugin
    ],
});