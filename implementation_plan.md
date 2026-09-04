# Implementation Plan: Standardize Login UI & Staff Portal Enterprise Light Theme

## Overview
1. Standardize `LoginPage.jsx` to match Image 2 (`LoginModal.jsx`) style.
2. Fix route redirection bugs for Staff Sidebar navigation by registering `/staff/tickets` and `/staff/food` in `AppRoutes.jsx`.
3. Create UI-only pages for `StaffTicketsPage.jsx` and `StaffFoodPage.jsx` with zero mock data and clean empty states.
4. Synchronize all Staff portal pages (`StaffPOSPage.jsx`, `StaffTicketsPage.jsx`, `StaffFoodPage.jsx`) to the modern Enterprise Light SaaS Theme (`bg-slate-50`, `bg-white`, `text-slate-900`, `text-blue-600`).

## Changes Made

### Frontend
- `LoginPage.jsx`: Redesigned card, demo account pills with icons, manual input divider, and role-based redirects.
- `AppRoutes.jsx`: Registered `/staff/tickets` and `/staff/food`.
- `StaffTicketsPage.jsx`: Created UI for ticket lookup, QR validation status, and details panel in Enterprise Light Theme.
- `StaffFoodPage.jsx`: Created UI for concession counter with category filtering, cart, and bill summary in Enterprise Light Theme.
- `StaffPOSPage.jsx`: Migrated entire POS layout, seat layout, snack grid, and ticket print modal to Enterprise Light Theme.
