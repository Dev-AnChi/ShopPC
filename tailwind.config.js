// Nội dung file tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Đảm bảo dòng này quét đúng thư mục src
    ],
    theme: {
      extend: {}, // Chúng ta không cần mở rộng theme lúc này
    },
    plugins: [],
  }