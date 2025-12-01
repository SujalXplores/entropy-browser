# THE ENTROPY BROWSER

> *"memories cannot be kept"*

![Entropy Browser Banner](https://placehold.co/1200x400/050505/FFF?text=THE+ENTROPY+BROWSER&font=monospace)

## 🌑 Manifesto

In the digital age, we are obsessed with permanence. We archive, we backup, we screenshot. **The Entropy Browser** challenges this notion. It is a digital journal designed to be ephemeral. Every word you type is destined to decay.

As you pour your thoughts into the void, the text detaches from the document flow, transforming into physical entities that succumb to gravity. They pile up like rubble—fragments of a memory—before slowly fading into nothingness.

## ✨ Features

- **Physics-based Typography**: Utilizing `matter.js`, every letter becomes a rigid body with mass, friction, and restitution.
- **Interactive Decay**: Your cursor acts as a chaotic force, scattering the debris of your past thoughts.
- **Visual Atmosphere**:
  - CRT Scanline effects & Vignette overlays
  - Dynamic glowing text rendering
  - "JetBrains Mono" / "Fira Code" typography
- **The Void**: A deep, responsive environment that tracks how many of your memories have been lost to entropy.

## 🛠️ Tech Stack

Built with the bleeding edge of web technology:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Physics Engine**: [Matter.js](https://brm.io/matter-js/)
- **Language**: TypeScript
- **Font**: JetBrains Mono / Fira Code

## 🚀 Getting Started

Clone the repository and enter the void.

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/SujalXplores/entropy-browser.git

# Navigate to the project directory
cd entropy-browser

# Install dependencies
pnpm install
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to begin.

## 🎛️ Configuration

You can tweak the laws of physics in `app/page.tsx`:

| Constant | Default | Description |
|----------|---------|-------------|
| `DECAY_START` | `8000` | Time (ms) before text starts fading |
| `DECAY_DURATION` | `4000` | Duration (ms) of the fade effect |
| `REPULSION_RADIUS` | `120` | Size of the cursor's repulsion field |
| `REPULSION_FORCE` | `0.15` | Strength of the cursor's push |

## 🤝 Contributing

Entropy is inevitable, but improvements are welcome. Feel free to fork and submit a pull request.

## 📄 License

MIT © SujalXplores
