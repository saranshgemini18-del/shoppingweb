# Bharat Bazaar: Web Features & Specifications

This document outlines the key features and technical specifications of the Bharat Bazaar e-commerce application.

## Core Features

### 1. User Authentication & Roles
- **Login System:** Secure login for both 'Admin' and 'Customer' roles.
- **Guest Access:** Allows users to browse the product catalog and add items to the cart without creating an account.
- **Account Creation:** A dedicated sign-up page for new customers to register.
- **Animated Welcome Page:** A brief, animated welcome screen is displayed upon successful login for a polished user experience.

*Login Page*
![Login Page](https://placehold.co/800x450?text=Login+Screen)

### 2. Customer-Facing Experience (Dashboard)
- **Product Catalog:** A rich catalog page to display all products.
  - **Search:** Users can search for products by name.
  - **Category Filtering:** Products can be filtered by categories like Apparel, Jewelry, Home Decor, etc.
- **Shopping Cart:** A persistent shopping cart where users can add and manage products.
- **Checkout Process:**
  - A multi-step checkout page to collect shipping and payment information.
  - Guests are prompted to log in before they can place an order.
- **Order Confirmation:** A confirmation page is displayed after a successful order, summarizing the purchase.
- **My Orders:** A dedicated page for logged-in customers to view their order history and track order statuses.
- **AI-Powered Chat Widget:** A support chat widget provides quick answers to common questions about shipping, tracking, and returns.

*Customer Product Catalog*
![Customer Product Catalog](https://placehold.co/800x450?text=Product+Catalog+View)

### 3. Admin Panel
- **Secure Dashboard:** A role-protected admin area accessible only to users with the 'Admin' role.
- **Analytics Overview:** The admin dashboard displays key metrics:
  - Total Products
  - Total Orders
  - Total Revenue
- **Product Management (CRUD):**
  - View a list of all products.
  - Add new products via a form.
  - Edit existing product details.
  - Delete products.
- **Order Management:**
  - View a list of all customer orders.
  - Inspect individual order details, including items, customer information, shipping address, and payment details.
  - Update the status of an order (e.g., Pending, Shipped, Delivered, Cancelled).

*Admin Dashboard*
![Admin Dashboard](https://placehold.co/800x450?text=Admin+Dashboard+Overview)

## Technical Specifications

- **Framework:** Next.js with App Router
- **Language:** TypeScript
- **Styling:**
  - Tailwind CSS for utility-first styling.
  - ShadCN UI for the component library (e.g., Cards, Buttons, Forms).
  - A custom theme with support for both light and dark modes defined in `src/app/globals.css`.
- **State Management:**
  - React Context API for managing global state for Products, Orders, Users, and the Shopping Cart.
  - Client-side data is persisted in the browser's `localStorage`.
- **Form Handling:** `react-hook-form` with `zod` for robust form validation.
- **Animations:** `framer-motion` is used for UI animations, such as the welcome screen.
- **Icons:** `lucide-react` for a consistent and clean icon set.
