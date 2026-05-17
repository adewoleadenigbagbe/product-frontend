# Product Frontend

A production-ready Vue.js application built with modern tooling.

## Features

- ⚡️ **Vite** - Next generation frontend tooling
- 🖖 **Vue 3** - The progressive JavaScript framework
- 📘 **TypeScript** - Type-safe development
- 🎨 **Vue Router** - Client-side routing
- 🏪 **Pinia** - State management
- 🧪 **Vitest** - Unit testing framework
- 📝 **ESLint & Prettier** - Code quality and formatting
- 🔗 **Axios** - HTTP client

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── composables/    # Vue composition functions
├── router/         # Route definitions
├── stores/         # Pinia stores
├── utils/          # Utility functions
├── assets/         # Static assets
├── types/          # TypeScript type definitions
├── views/          # Page components
├── App.vue         # Root component
└── main.ts         # Application entry point

tests/              # Test files
public/             # Public static files
dist/               # Built files (generated)
```

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Lint and fix files |
| `npm run format` | Format code with Prettier |

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Product Frontend
```

## Code Style

The project uses ESLint and Prettier for code quality. Run the following before committing:

```bash
npm run lint
npm run format
```

## Testing

Run unit tests with:

```bash
npm run test
```

View coverage report:

```bash
npm run test:coverage
```

## License

See LICENSE file for details.
