# Inventory Tracker

A modern Next.js application for tracking inventory of drones and BC (БК) across multiple stores. Built with TypeScript, Tailwind CSS, and React.

## 🚀 Features

- **Multi-Store Management**: Track inventory across multiple store locations
- **Customizable Categories**: Edit category names for flexible inventory organization
- **Real-Time Statistics**: View aggregated statistics across all stores
- **Product Management**: Add, edit, and delete products with quantities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean interface built with Tailwind CSS and shadcn/ui components

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/donazazingo-sketch.git
cd donazazingo-sketch
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
inventory-tracker/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main inventory tracker page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── store-card.tsx    # Store card component
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components inspired by shadcn/ui

## 📝 Usage

1. **Add a Store**: Click "Додати магазин" to create a new store
2. **Edit Store Name**: Click the edit icon next to the store name
3. **Customize Categories**: Click the edit icon next to category names in the header
4. **Add Products**: Click "Додати" under any category in a store card
5. **Edit Products**: Hover over a product and click the edit icon
6. **Delete Items**: Use the trash icon to remove stores or products

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Your Name

---

Made with ❤️ using Next.js
