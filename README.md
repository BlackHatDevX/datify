# Datify - Dynamic Event Calendar Application

A modern, feature-rich event calendar application built with Next.js, React, and TypeScript. Datify offers a beautiful interface with an animated night sky background and powerful event management capabilities.

## 🌟 Features

- **Interactive Calendar Interface**
  - Responsive grid layout
  - Month navigation
  - Date selection
  - Beautiful animated shooting stars background

- **Event Management**
  - Create, edit, and delete events
  - Categorize events (Work, Personal, Other)
  - Color-coded event categories
  - Drag-and-drop event rescheduling
  - Mobile-friendly event handling

- **Advanced Search & Navigation**
  - Real-time event search
  - Search results dropdown
  - Quick navigation to event dates
  - Search across all calendar dates

- **Data Export**
  - Export events in multiple formats:
    - Excel (.xlsx)
    - CSV
    - JSON

- **Modern UI/UX**
  - Glassmorphic design elements
  - Responsive layout
  - Dark mode support
  - Smooth animations
  - Mobile-first approach

## 🚀 Demo

Visit the live demo: [Datify Calendar App](https://bit.ly/datify-calendar)

## 💻 Local Development

### Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/blackhatdevx/datify.git
   cd datify
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
datify/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── Calendar.tsx       # Calendar grid component
│   │   ├── EventList.tsx      # Event list component
│   │   ├── AddEventDialog.tsx # Event creation dialog
│   │   ├── ExportDialog.tsx   # Export functionality
│   │   └── ShootingStars.tsx  # Background animation
│   ├── contexts/
│   │   └── EventContext.tsx   # Event state management
│   ├── hooks/
│   │   └── useEvents.ts       # Event-related hooks
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/
│   └── assets/               # Static assets
└── package.json
```

## 🛠️ Built With

- **Framework**
  - [Next.js 13](https://nextjs.org/) - React framework
  - [React](https://reactjs.org/) - UI library
  - [TypeScript](https://www.typescriptlang.org/) - Type safety

- **Styling**
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - UI components
  - [Lucide Icons](https://lucide.dev/) - Icon set

- **State Management & Data Handling**
  - [React Context](https://reactjs.org/docs/context.html) - State management
  - [xlsx](https://www.npmjs.com/package/xlsx) - Excel file handling
  - [csv-stringify](https://www.npmjs.com/package/csv-stringify) - CSV generation

- **Drag & Drop**
  - [@dnd-kit/core](https://dndkit.com/) - Drag and drop functionality

- **Date Handling**
  - [date-fns](https://date-fns.org/) - Date manipulation

- **Development Tools**
  - [ESLint](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting

## 👨‍💻 Created By

Developed by Jash Gro as an assignment for Dacoid Digital.

## 📄 License

This project is open source.

---

For any questions or feedback, contact:
- Email: jashg703gd@gmail.com
- Telegram: [@developer_x](https://telegram.dog/deveioper_x)
