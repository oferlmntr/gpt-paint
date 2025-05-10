# GPT Power-Ups Directory Structure

```
gpt-powerups/
├── .cursor/                   # Cursor IDE configuration
│   ├── project-context.md     # Project overview for AI context
│   ├── directory-structure.md # This file
│   └── rules/                 # AI guidance for specific file types
│       ├── general.mdc        # General rules for all files
│       ├── react-components.mdc # React component guidelines
│       ├── typescript.mdc     # TypeScript coding standards
│       ├── extension.mdc      # Chrome extension guidelines
│       └── canvas.mdc         # Canvas drawing guidelines
├── .cursorrules               # Legacy rules file (global guidance)
├── .github/                   # GitHub configuration
│   └── ISSUE_TEMPLATE/        # Issue templates
├── dist/                      # Build output (generated)
│   ├── assets/                # Compiled assets
│   └── icons/                 # Extension icons
├── public/                    # Static assets
│   └── icons/                 # Source icon files
├── screenshots/               # Project screenshots for documentation
├── scripts/                   # Build and utility scripts
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── DrawingPanel.tsx   # Main drawing panel container
│   │   ├── Canvas.tsx         # Drawing canvas implementation
│   │   ├── Toolbar.tsx        # Drawing tools and controls
│   │   ├── ColorPicker.tsx    # Color selection component
│   │   ├── BrushSizeSelector.tsx # Brush size selection 
│   │   └── FloatingButton.tsx # Floating action button
│   ├── context/               # React context providers
│   │   └── DrawingContext.tsx # Drawing state context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDraggable.ts    # Hook for draggable elements
│   │   └── useResizable.ts    # Hook for resizable elements
│   ├── types/                 # TypeScript type definitions
│   │   └── chrome.d.ts        # Chrome extension type definitions
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main React app component
│   ├── contentScript.tsx      # Chrome extension content script
│   ├── extension.css          # Extension-specific CSS
│   ├── index.css              # Global CSS
│   ├── main.tsx               # React app entry point
│   ├── popup.tsx              # Extension popup component
│   └── vite-env.d.ts          # Vite environment type definitions
├── .gitignore                 # Git ignore configuration
├── CODE_OF_CONDUCT.md         # Code of conduct for contributors
├── CONTRIBUTING.md            # Contribution guidelines
├── eslint.config.js           # ESLint configuration
├── EXTENSION.md               # Extension-specific documentation
├── index.html                 # HTML entry point
├── LICENSE                    # Project license
├── package-lock.json          # NPM package lock
├── package.json               # NPM package configuration
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Project readme
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.app.json          # TypeScript app configuration
├── tsconfig.json              # TypeScript base configuration
├── tsconfig.node.json         # TypeScript Node configuration
└── vite.config.ts             # Vite build configuration
```

## Key Files for Development

When working on this project, pay special attention to:

1. **src/App.tsx** - Main React component structure
2. **src/contentScript.tsx** - Chrome extension injection logic
3. **src/components/** - UI components for the drawing tool
4. **src/context/DrawingContext.tsx** - State management for drawing
5. **public/manifest.json** - Extension configuration

## Key Features Location

1. **Drawing Tool**
   - src/components/Canvas.tsx - Main drawing canvas
   - src/components/Toolbar.tsx - Drawing tools UI
   - src/context/DrawingContext.tsx - Drawing state

2. **RTL Toggle**
   - src/contentScript.tsx - RTL button injection and functionality 