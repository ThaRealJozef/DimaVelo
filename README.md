# DimaVelo - E-commerce Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive e-commerce website built for DimaVelo, a local bicycle shop in Salé, Morocco. This is a fan project created to support my father's business.

## 🚀 Features

- **Multi-language Support**: French, English, and Arabic interface
- **Responsive Design**: Works on all devices
- **Product Catalog**: Browse bicycles, accessories, and services
- **Contact Form**: Easy customer inquiries
- **Admin Dashboard**: Manage products and categories
- **PWA Support**: Installable web app with offline capabilities

## 🛠️ Technology Stack

- ⚡ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React 19](https://react.dev/) - A JavaScript library for building user interfaces
- 🎨 [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components
- 🌈 [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- 🔄 [React Query](https://tanstack.com/query) - Server state management
- 🌍 [i18n](https://www.i18next.com/) - Internationalization framework
- 🔥 [Firebase](https://firebase.google.com/) - Backend services (Authentication, Firestore, Storage)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/dimavelo.git](https://github.com/yourusername/dimavelo.git)
   cd dimavelo
2. Install dependencies:
   ```bash
   pnpm install
3. Create a 
.env
 file in the root directory and add your Firebase configuration:
   ```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
4. Start the development server:
   ```bash
   pnpm dev
5. Open http://localhost:5173 in your browser.

## 🏗️ Project Structure
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── lib/            # Utilities and configurations
├── services/       # Firebase services
├── contexts/       # React contexts
└── styles/         # Global styles

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
Built with ❤️ as a gift for my father's business
Special thanks to the open-source community for amazing tools and libraries