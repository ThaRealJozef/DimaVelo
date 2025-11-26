# Plan de Développement MVP - Site Web Magasin de Vélos Salé

## Objectif
Créer un site web e-commerce moderne pour un magasin de vélos à Salé, Maroc, avec:
- Interface client premium en français
- Système admin intuitif pour non-techniques
- Commandes via WhatsApp/téléphone (pas de paiement en ligne)
- Support multilingue (FR/EN/AR/ES)
- Design esthétique avec animations fluides

## Stack Technique
- Next.js 14 + TypeScript + Shadcn-ui + Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- Framer Motion pour animations
- next-intl pour i18n

## Fichiers à Créer (Maximum 8 fichiers principaux)

### 1. Configuration et Types (`lib/types.ts`)
- Interfaces TypeScript pour Product, Category, ContactRequest, ServiceBooking
- Types pour les props des composants
- Enums pour statuts et méthodes de contact

### 2. Configuration Supabase (`lib/supabase.ts`)
- Client Supabase
- Fonctions helper pour requêtes
- Gestion de l'authentification

### 3. Page d'Accueil (`app/page.tsx`)
- Hero section avec animations
- Grille de catégories (4 cards)
- Produits vedettes
- Section services
- Footer avec contact

### 4. Page Catégorie avec Produits (`app/categories/[slug]/page.tsx`)
- Liste de produits avec filtrage
- Système de tri
- Cards produits interactives

### 5. Page Détail Produit (`app/produit/[slug]/page.tsx`)
- Galerie photos avec zoom
- Spécifications techniques
- Boutons WhatsApp et téléphone
- Produits similaires

### 6. Page Services et Réservation (`app/services/page.tsx`)
- Liste des services
- Formulaire de réservation
- Validation et soumission

### 7. Dashboard Admin Principal (`app/admin/page.tsx`)
- Vue d'ensemble avec statistiques
- Gestion des produits (CRUD)
- Gestion des demandes de contact
- Gestion des réservations
- Interface mobile-responsive

### 8. Composants Réutilisables (`components/`)
- ProductCard
- CategoryCard
- Header avec sélecteur de langue
- Footer
- Formulaires avec validation

## Simplifications MVP
1. **Données initiales**: Utiliser des données mock en dur pour démarrer (pas de Supabase en Phase 1)
2. **Multilingue**: Français uniquement au lancement, structure préparée pour autres langues
3. **Admin**: Interface simplifiée en une seule page avec sections
4. **Images**: Utiliser des placeholders, le client ajoutera ses vraies photos après
5. **Animations**: Animations de base (fade-in, hover), pas d'animations complexes

## Ordre d'Implémentation
1. ✅ Setup du template Shadcn-ui
2. ⏳ Créer les types et interfaces TypeScript
3. ⏳ Créer les données mock (produits, catégories)
4. ⏳ Développer la page d'accueil
5. ⏳ Développer la page catégorie
6. ⏳ Développer la page produit
7. ⏳ Développer la page services
8. ⏳ Développer le dashboard admin
9. ⏳ Ajouter les animations et polish
10. ⏳ Tests et vérifications finales

## Notes Importantes
- Tout le texte en français
- Design premium avec Tailwind
- Mobile-first responsive
- Boutons WhatsApp avec liens directs
- Interface admin ultra-simple