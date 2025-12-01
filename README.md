![Entropy Browser Banner](https://placehold.co/1200x400/050505/e0e0e8?text=THE+ENTROPY+BROWSER&font=monospace)

> *"memories cannot be kept"*

## 🌑 Manifesto

In the digital age, we are obsessed with permanence. We archive, backup, screenshot - desperately clinging to every byte. **The Entropy Browser** challenges this obsession with a radical concept: **ephemeral memory**.

This is not an app. It's a meditation on loss.

Type a thought. Watch it materialize as physical letters that obey gravity. See them pile up like fragments of the past. Move your cursor through the debris and scatter the remains. Eventually, everything fades, just like real memories.

**Built for [Dreamware 2025](https://dreamwarehack.com)** - where digital experiences meet philosophical inquiry.

## ✨ Features

### 🎭 Physics-Driven Typography
Every letter you type becomes a **rigid body** with real physical properties:
- Mass, friction, and restitution
- Gravity pulls them down to pile at the bottom
- Walls contain the chaos within the viewport

### 🌊 Fluid Background (Dream Fragment: Fluid Interface)
A **GLSL shader-based energy field** that evolves organically over time.
- Mathematical noise patterns create a "breathing" effect
- Reacts to time, creating a subtle, hypnotic backdrop
- "Alive" visuals that never repeat exactly

### 🔊 Generative Soundscapes (Dream Fragment: Voice of the Machine)
The system speaks back through audio:
- **Ambient Drone**: A low-frequency hum that grounds the experience
- **Reactive Typing**: Unique sound samples for keystrokes, pitched randomly to create a non-repetitive melody
- **Mute Control**: Toggle the auditory hallucinations at will

### 🖱️ Interactive Decay
Your cursor creates a **repulsion field** that scatters the debris of your memories. Move through the fallen letters and watch them scatter like disturbed thoughts.

### 🎨 Atmospheric Design
- **CRT Scanlines**: subtle retro display artifacts
- **Vignette Overlay**: dramatic edge darkening
- **Glowing Text**: ethereal letter rendering with shadows
- **Custom Cursor**: crosshair design that enhances the mood
- **Ambient Particles**: floating dust in the void

### 📊 Live Statistics
- Track **fragments still falling** in real-time
- Count **letters lost to entropy** forever

## 🛠️ Tech Stack

Built with modern web technologies for maximum performance:

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.0.6 | React framework with App Router |
| [React](https://react.dev/) | 19.2.0 | UI library with React Compiler |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 8.x | React renderer for Three.js |
| [Three.js](https://threejs.org/) | 0.170+ | 3D Library & Shaders |
| [Matter.js](https://brm.io/matter-js/) | 0.20.0 | 2D physics engine |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.17 | Utility-first CSS framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type-safe JavaScript |

**Font**: JetBrains Mono - chosen for its monospace clarity and coding aesthetic.

## 🏗️ Architecture

```
app/
├── page.tsx                 # Main application entry
├── layout.tsx               # Root layout with metadata
├── globals.css              # Theme, animations, custom cursor
└── components/
    └── entropy/
        ├── index.ts         # Public exports
        ├── types.ts         # TypeScript interfaces
        ├── constants.ts     # Physics & canvas configuration
        ├── audio-manager.ts # Singleton audio controller
        ├── hooks/
        │   ├── use-physics-engine.ts   # Matter.js integration
        │   └── use-canvas-renderer.ts  # Custom rendering loop
        └── ui/
            ├── energy-field.tsx # GLSL Shader background
            ├── header.tsx       # Title component
            ├── memory-input.tsx # Text input form
            ├── stats-display.tsx # Live statistics
            └── overlays.tsx     # Visual effects (CRT, vignette)
```

### Key Design Decisions

- **Custom Hooks Architecture**: Separation of physics logic (`usePhysicsEngine`) and rendering (`useCanvasRenderer`) for clean, maintainable code
- **Canvas Rendering**: Direct canvas manipulation for 60fps performance with hundreds of physics bodies
- **Memoized Components**: All UI components wrapped with `memo()` to prevent unnecessary re-renders
- **Throttled State Updates**: Physics state updates throttled to 100ms to prevent React overwhelm

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** (package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/SujalXplores/entropy-browser.git

# Navigate to the project directory
cd entropy-browser

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and begin releasing your memories into the void.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |

## 🎛️ Configuration

Physics and visual constants are centralized in `app/components/entropy/constants.ts`:

### Physics Configuration

| Constant | Default | Description |
|----------|---------|-------------|
| `gravity.y` | `0.8` | Gravitational pull strength |
| `decayStart` | `8000` | Time (ms) before text starts fading |
| `decayDuration` | `4000` | Duration (ms) of the fade effect |
| `repulsionRadius` | `120` | Size of the cursor's repulsion field |
| `repulsionForce` | `0.15` | Strength of the cursor's push |
| `fontSize` | `24` | Letter size in pixels |
| `letterSpacing` | `0.7` | Spacing multiplier between letters |
| `maxBodiesPerBatch` | `50` | Letters created per batch |
| `batchDelay` | `16` | Delay between batches (ms) |

### Body Physics Properties

| Property | Value | Description |
|----------|-------|-------------|
| `friction` | `0.6` | Surface friction |
| `frictionAir` | `0.02` | Air resistance |
| `restitution` | `0.3` | Bounciness |
| `density` | `0.002` | Mass density |

### Canvas Rendering

| Constant | Default | Description |
|----------|---------|-------------|
| `gridSize` | `50` | Background grid spacing |
| `trailOpacity` | `0.3` | Motion blur intensity |
| `particleCount` | `3` | Ambient dust particles per frame |

## 🎨 Theming

The color system uses **OKLCH color space** for perceptual uniformity:

```css
--color-background: oklch(0.07 0 0);        /* Deep black */
--color-foreground: oklch(0.91 0.01 270);   /* Soft white */
--color-muted: oklch(0.7 0.02 270 / 0.85);  /* Dimmed text */
--color-accent: oklch(0.77 0.02 270 / 0.9); /* Highlighted elements */
```

## 🌟 The Philosophy

The Entropy Browser is an **anti-app**. In a world of infinite scrollback, cloud sync, and "memories" features, this project asks: *what if we designed for forgetting?*

Every interaction is a small act of letting go:
- **Type**: acknowledge a thought
- **Watch it fall**: feel the weight of memory
- **Scatter the debris**: disturb the settled past
- **See it fade**: accept impermanence

This is software as meditation. A digital memento mori.

## 🤝 Contributing

Entropy is inevitable, but improvements are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [SujalXplores](https://github.com/SujalXplores)

---

<p align="center">
  <i>Built with 💭 for Dreamware 2025</i>
</p>

<p align="center">
  <a href="https://github.com/SujalXplores/entropy-browser">⭐ Star this project</a> •
  <a href="https://github.com/SujalXplores/entropy-browser/issues">🐛 Report Bug</a> •
  <a href="https://github.com/SujalXplores/entropy-browser/issues">✨ Request Feature</a>
</p>
