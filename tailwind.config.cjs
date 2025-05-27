// tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Memindai file index.html utama
    "./src/**/*.{js,ts,jsx,tsx}", // Memindai semua file .js, .ts, .jsx, .tsx di dalam folder src dan subfoldernya
  ],
  theme: {
    extend: {
      // Di sini Anda bisa menambahkan kustomisasi tema jika diperlukan di masa depan
      // Misalnya: font kustom, warna tambahan, breakpoint baru, dll.
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'], // Contoh mengganti font default
      // },
    },
  },
  plugins: [
    // Plugin Tailwind lain bisa ditambahkan di sini jika diperlukan
    // require('@tailwindcss/forms'), // Contoh plugin untuk styling form
  ],
};