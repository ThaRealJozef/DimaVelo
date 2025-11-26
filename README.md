# DimaVelo -- E-commerce Website

[![License:
MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, fast, multilingual e-commerce platform built for DimaVelo, a
bicycle shop in Salé, Morocco.\
This project was developed as a personal contribution to support the
business.

------------------------------------------------------------------------

## 🚀 Features

-   🌍 Multilingual UI --- French, English, and Arabic\
-   📱 Fully Responsive --- Optimized for all devices\
-   🛒 Product Catalog --- Bikes, accessories, and services\
-   📬 Contact Form --- Simple customer inquiries\
-   🛠️ Admin Dashboard --- Manage products & categories\
-   📦 PWA Ready --- Installable with offline support

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   ⚡ Vite --- Next-gen frontend tooling\
-   ⚛️ React 19 --- UI framework\
-   🎨 Shadcn/UI --- Radix-powered components\
-   🌈 Tailwind CSS --- Utility-first styling\
-   🔄 React Query --- Server state management\
-   🌍 i18next --- Internationalization\
-   🔥 Firebase --- Auth, Firestore, Storage

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+\
-   pnpm\
-   Git

### Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/yourusername/dimavelo.git
    cd dimavelo
    ```

2.  Install dependencies:

    ``` bash
    pnpm install
    ```

3.  Create a `.env` file:

    ``` env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  Start the dev server:

    ``` bash
    pnpm dev
    ```

5.  Open:\
    http://localhost:5173

------------------------------------------------------------------------

## 🏗️ Project Structure

``` txt
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── lib/            # Configs & utility functions
├── services/       # Firebase logic
├── contexts/       # React context providers
└── styles/         # Global styles
```

------------------------------------------------------------------------

## 📝 License

This project is licensed under the MIT License.\
See the LICENSE file for full details.

------------------------------------------------------------------------

## 🙏 Acknowledgments

Built with ❤️ for my father's business.\
Thanks to the open-source community for the tools that made this
possible.
