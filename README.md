# Calendar Challenge

A responsive wall calendar application built with Next.js and React.

## Technical Choices

- **Framework**: [Next.js](https://nextjs.org/) (App Router) was chosen for its robust ecosystem, performant rendering, and easy deployment path.
- **Language**: **TypeScript** is used throughout the project to ensure type safety, catch errors early during development, and provide better autocomplete/tooling setup.
- **Component Architecture**: The UI is broken down into modular React components (like the `WallCalendar`) to maintain a clean separation of concerns and enhance reusability.
- **Styling**: Standard CSS/Tailwind (default Next.js configuration) is used to ensure a responsive, maintainable, and clean user interface.

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17 or higher recommended)
- npm, yarn, pnpm, or bun

### Setup Instructions

1. **Install dependencies**:
   Run the following command in the project root to install the required packages:
   ```bash
   npm install
   ```
   *(If you prefer another package manager, run `yarn install`, `pnpm install`, or `bun install`)*

2. **Run the development server**:
   Start the local development server:
   ```bash
   npm run dev
   ```

3. **View the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the calendar application. The page will auto-update as you edit the source files.

## Project Structure

- `app/` - Contains the main entries for the Next.js App Router (e.g., `page.tsx`, `layout.tsx`).
- `app/Components/` - Contains our modular React components (e.g., `WallCalendar.tsx`).
- `public/` - Static files and assets.

