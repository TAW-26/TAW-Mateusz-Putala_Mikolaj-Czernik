/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Teraz ta ścieżka będzie działać poprawnie
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}