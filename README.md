# React Three Fiber + Vite Boilerplate

A modern TypeScript project template featuring React Three Fiber for 3D graphics, built with Vite for fast development.

## Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- 🎨 **React Three Fiber** - React renderer for Three.js
- 🧩 **TypeScript** - Type-safe development
- 🎭 **Interactive 3D Scenes** - Basic and advanced examples
- 🎮 **Orbit Controls** - Mouse and touch camera controls
- ✨ **Modern UI** - Beautiful gradient background and responsive design

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── AdvancedScene.tsx    # Advanced 3D scene with animations
├── App.tsx                  # Main application component
├── App.css                  # Application styles
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Features Explained

### Basic Scene
- Simple rotating orange cube
- Basic lighting setup
- Orbit controls for camera movement

### Advanced Scene
- Interactive animated sphere (click to scale, hover to change color)
- Rotating wireframe torus
- Floating 3D text
- Environment lighting (sunset preset)
- Ground plane
- Multiple light sources

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Dependencies

- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **three** - 3D graphics library
- **@types/three** - TypeScript definitions for Three.js

## Customization

### Adding New 3D Objects

Create new components in the `components/` directory and import them into your scenes:

```tsx
function MyCustomObject() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}
```

### Modifying Scenes

Edit the `BasicScene` or `AdvancedScene` components to add, remove, or modify 3D objects.

### Styling

Modify `App.css` to change the visual appearance of the UI elements.

## Performance Tips

- Use `useFrame` sparingly and optimize animations
- Implement proper cleanup in `useEffect` hooks
- Use `Suspense` for loading states
- Consider using `InstancedMesh` for many similar objects

## Troubleshooting

### Common Issues

1. **3D objects not visible**: Check camera position and lighting
2. **Performance issues**: Reduce polygon count or optimize animations
3. **TypeScript errors**: Ensure all dependencies are properly installed

### Getting Help

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## License

This project is open source and available under the MIT License.
