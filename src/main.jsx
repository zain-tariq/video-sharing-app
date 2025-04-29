import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Add Tailwind CSS styles
const style = document.createElement('style');
style.textContent = `
/* Tailwind-like utility classes */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.ml-2 { margin-left: 0.5rem; }
.ml-3 { margin-left: 0.75rem; }
.ml-4 { margin-left: 1rem; }
.mr-2 { margin-right: 0.5rem; }
.mr-3 { margin-right: 0.75rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.pt-4 { padding-top: 1rem; }
.pt-16 { padding-top: 4rem; }
.pt-20 { padding-top: 5rem; }
.pb-8 { padding-bottom: 2rem; }
.text-center { text-align: center; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 1.875rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-white { color: white; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-900 { color: #111827; }
.text-blue-500 { color: #3b82f6; }
.text-blue-600 { color: #2563eb; }
.text-blue-700 { color: #1d4ed8; }
.text-red-400 { color: #f87171; }
.text-red-700 { color: #b91c1c; }
.text-green-400 { color: #4ade80; }
.text-green-700 { color: #15803d; }
.text-yellow-500 { color: #eab308; }
.bg-white { background-color: white; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-300 { background-color: #d1d5db; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-blue-600 { background-color: #2563eb; }
.bg-red-100 { background-color: #fee2e2; }
.bg-red-500 { background-color: #ef4444; }
.bg-red-600 { background-color: #dc2626; }
.bg-green-100 { background-color: #dcfce7; }
.bg-green-500 { background-color: #22c55e; }
.bg-green-600 { background-color: #16a34a; }
.hover\:bg-blue-500:hover { background-color: #3b82f6; }
.hover\:bg-blue-600:hover { background-color: #2563eb; }
.hover\:bg-blue-700:hover { background-color: #1d4ed8; }
.hover\:bg-red-600:hover { background-color: #dc2626; }
.hover\:bg-green-600:hover { background-color: #16a34a; }
.hover\:bg-gray-100:hover { background-color: #f3f4f6; }
.hover\:text-blue-500:hover { color: #3b82f6; }
.hover\:text-blue-700:hover { color: #1d4ed8; }
.hover\:text-blue-800:hover { color: #1e40af; }
.border { border-width: 1px; }
.border-0 { border-width: 0; }
.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-300 { border-color: #d1d5db; }
.border-red-400 { border-color: #f87171; }
.border-green-400 { border-color: #4ade80; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }
.rounded-t-md { border-top-left-radius: 0.375rem; border-top-right-radius: 0.375rem; }
.rounded-b-md { border-bottom-left-radius: 0.375rem; border-bottom-right-radius: 0.375rem; }
.rounded-l-lg { border-top-left-radius: 0.5rem; border-bottom-left-radius: 0.5rem; }
.rounded-r-lg { border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\:ring-1:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); }
.focus\:ring-2:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); }
.focus\:ring-blue-300:focus { box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.5); }
.focus\:ring-blue-500:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); }
.focus\:ring-blue-600:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5); }
.w-full { width: 100%; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-16 { height: 4rem; }
.h-40 { height: 10rem; }
.h-64 { height: 16rem; }
.h-screen { height: 100vh; }
.min-h-screen { min-height: 100vh; }
.max-h-40 { max-height: 10rem; }
.max-w-md { max-width: 28rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-screen-xl { max-width: 1280px; }
.flex-grow { flex-grow: 1; }
.flex-wrap { flex-wrap: wrap; }
.overflow-hidden { overflow: hidden; }
.overflow-y-auto { overflow-y: auto; }
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.z-10 { z-index: 10; }
.object-cover { object-fit: cover; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.inline-flex { display: inline-flex; }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.border-t-2 { border-top-width: 2px; }
.border-b-2 { border-bottom-width: 2px; }
.disabled\:bg-blue-300:disabled { background-color: #93c5fd; }

@media (min-width: 768px) {
  .md\:flex { display: flex; }
  .md\:hidden { display: none; }
  .md\:flex-row { flex-direction: row; }
  .md\:items-center { align-items: center; }
  .md\:space-x-8 > * + * { margin-left: 2rem; }
  .md\:p-0 { padding: 0; }
  .md\:mt-0 { margin-top: 0; }
  .md\:border-0 { border-width: 0; }
  .md\:bg-white { background-color: white; }
  .md\:hover\:bg-transparent:hover { background-color: transparent; }
  .md\:hover\:text-blue-700:hover { color: #1d4ed8; }
  .md\:w-auto { width: auto; }
  .md\:order-1 { order: 1; }
  .md\:order-2 { order: 2; }
}
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
