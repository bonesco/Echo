/**
 * Webflow Monitor - Premium UI System
 * Vercel/shadcn/ui inspired design
 *
 * This file contains the complete redesigned UI with:
 * - Light/Dark mode theming
 * - shadcn/ui component styles
 * - Command palette
 * - Micro-interactions
 * - Professional polish
 */

// CSS Design System - Vercel/shadcn inspired
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* CSS Variables - Design Tokens */
  :host {
    /* Colors - Light Mode */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

    /* Spacing - 8px grid */
    --space-1: 0.25rem;  /* 4px */
    --space-2: 0.5rem;   /* 8px */
    --space-3: 0.75rem;  /* 12px */
    --space-4: 1rem;     /* 16px */
    --space-5: 1.25rem;  /* 20px */
    --space-6: 1.5rem;   /* 24px */
    --space-8: 2rem;     /* 32px */
    --space-10: 2.5rem;  /* 40px */
    --space-12: 3rem;    /* 48px */
    --space-16: 4rem;    /* 64px */

    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    /* Animation */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 350ms;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Dark Mode */
  :host(.dark) {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }

  /* Reset */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :host {
    all: initial;
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ===== LAYOUT ===== */

  /* Main Container - Sidebar Layout */
  .wm-container {
    position: fixed;
    top: var(--space-4);
    right: var(--space-4);
    bottom: var(--space-4);
    width: 480px;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    box-shadow: var(--shadow-xl);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all var(--duration-normal) var(--ease);
    opacity: 1;
    transform: translateX(0);
  }

  .wm-container.minimized {
    width: 56px;
    height: 56px;
    bottom: var(--space-4);
    top: auto;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
  }

  .wm-container.minimized:hover {
    box-shadow: var(--shadow-xl);
    transform: scale(1.05);
  }

  .wm-container.expanded {
    width: 720px;
  }

  /* Header */
  .wm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid hsl(var(--border));
    background: hsl(var(--card));
    min-height: 64px;
  }

  .wm-header-left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
  }

  .wm-logo {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)) 100%);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    color: hsl(var(--primary-foreground));
    box-shadow: var(--shadow-sm);
  }

  .wm-title-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .wm-title {
    font-size: 15px;
    font-weight: 600;
    color: hsl(var(--foreground));
    letter-spacing: -0.01em;
  }

  .wm-subtitle {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
  }

  .wm-header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  /* Main Content Area */
  .wm-content-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar Navigation */
  .wm-sidebar {
    width: 180px;
    border-right: 1px solid hsl(var(--border));
    background: hsl(var(--card));
    overflow-y: auto;
    flex-shrink: 0;
  }

  .wm-nav {
    padding: var(--space-2);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .wm-nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: calc(var(--radius) - 2px);
    font-size: 13px;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease);
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .wm-nav-item:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  .wm-nav-item.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-weight: 600;
  }

  .wm-nav-item-icon {
    font-size: 16px;
    width: 16px;
    text-align: center;
  }

  .wm-nav-item-badge {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 9999px;
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
  }

  .wm-nav-item.active .wm-nav-item-badge {
    background: hsla(var(--primary-foreground) / 0.2);
    color: hsl(var(--primary-foreground));
  }

  /* Content Panel */
  .wm-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6);
    background: hsl(var(--background));
  }

  /* ===== COMPONENTS ===== */

  /* Button Component */
  .wm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border-radius: calc(var(--radius) - 2px);
    font-size: 13px;
    font-weight: 500;
    padding: 0 var(--space-3);
    height: 32px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease);
    font-family: var(--font-sans);
    white-space: nowrap;
  }

  .wm-btn:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  /* Button Variants */
  .wm-btn-primary {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    box-shadow: var(--shadow-sm);
  }

  .wm-btn-primary:hover {
    background: hsl(var(--primary) / 0.9);
    box-shadow: var(--shadow);
  }

  .wm-btn-secondary {
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .wm-btn-secondary:hover {
    background: hsl(var(--secondary) / 0.8);
  }

  .wm-btn-ghost {
    background: transparent;
    color: hsl(var(--foreground));
  }

  .wm-btn-ghost:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  .wm-btn-icon {
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 16px;
  }

  .wm-btn-icon:hover {
    background: hsl(var(--accent));
  }

  /* Card Component */
  .wm-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    padding: var(--space-6);
    margin-bottom: var(--space-4);
    transition: all var(--duration-fast) var(--ease);
  }

  .wm-card:hover {
    box-shadow: var(--shadow-md);
    border-color: hsl(var(--border) / 0.8);
  }

  .wm-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .wm-card-title {
    font-size: 16px;
    font-weight: 600;
    color: hsl(var(--foreground));
    letter-spacing: -0.01em;
  }

  .wm-card-description {
    font-size: 13px;
    color: hsl(var(--muted-foreground));
    margin-top: var(--space-2);
  }

  /* Badge Component */
  .wm-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    border: 1px solid transparent;
  }

  .wm-badge-default {
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .wm-badge-success {
    background: hsl(142.1 76.2% 36.3% / 0.1);
    color: hsl(142.1 76.2% 36.3%);
    border-color: hsl(142.1 76.2% 36.3% / 0.2);
  }

  .wm-badge-warning {
    background: hsl(38 92% 50% / 0.1);
    color: hsl(38 92% 50%);
    border-color: hsl(38 92% 50% / 0.2);
  }

  .wm-badge-error {
    background: hsl(var(--destructive) / 0.1);
    color: hsl(var(--destructive));
    border-color: hsl(var(--destructive) / 0.2);
  }

  /* Table Component */
  .wm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .wm-table thead {
    border-bottom: 1px solid hsl(var(--border));
  }

  .wm-table th {
    text-align: left;
    padding: var(--space-3) var(--space-2);
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .wm-table td {
    padding: var(--space-3) var(--space-2);
    border-bottom: 1px solid hsl(var(--border));
    color: hsl(var(--foreground));
  }

  .wm-table tr:last-child td {
    border-bottom: none;
  }

  .wm-table tr:hover td {
    background: hsl(var(--accent) / 0.5);
  }

  /* Theme Toggle */
  .wm-theme-toggle {
    width: 32px;
    height: 32px;
    border-radius: calc(var(--radius) - 2px);
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--muted-foreground));
    transition: all var(--duration-fast) var(--ease);
  }

  .wm-theme-toggle:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  /* Command Palette */
  .wm-command-palette {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: hsl(var(--background) / 0.8);
    backdrop-filter: blur(8px);
    z-index: 9999999;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-normal) var(--ease);
  }

  .wm-command-palette.active {
    opacity: 1;
    pointer-events: all;
  }

  .wm-command-dialog {
    width: 90%;
    max-width: 640px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    transform: scale(0.96);
    transition: transform var(--duration-normal) var(--ease);
  }

  .wm-command-palette.active .wm-command-dialog {
    transform: scale(1);
  }

  .wm-command-input {
    width: 100%;
    padding: var(--space-4);
    border: none;
    background: transparent;
    font-size: 16px;
    color: hsl(var(--foreground));
    font-family: var(--font-sans);
    border-bottom: 1px solid hsl(var(--border));
  }

  .wm-command-input:focus {
    outline: none;
  }

  .wm-command-input::placeholder {
    color: hsl(var(--muted-foreground));
  }

  .wm-command-list {
    max-height: 400px;
    overflow-y: auto;
    padding: var(--space-2);
  }

  .wm-command-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease);
  }

  .wm-command-item:hover,
  .wm-command-item.selected {
    background: hsl(var(--accent));
  }

  .wm-command-item-icon {
    font-size: 18px;
  }

  .wm-command-item-content {
    flex: 1;
  }

  .wm-command-item-title {
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .wm-command-item-description {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
  }

  /* Loading States */
  .wm-skeleton {
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 0%,
      hsl(var(--muted) / 0.6) 50%,
      hsl(var(--muted)) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: calc(var(--radius) - 2px);
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .wm-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid hsl(var(--primary) / 0.3);
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .wm-empty-state {
    text-align: center;
    padding: var(--space-12) var(--space-4);
  }

  .wm-empty-state-icon {
    font-size: 48px;
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }

  .wm-empty-state-title {
    font-size: 16px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: var(--space-2);
  }

  .wm-empty-state-description {
    font-size: 13px;
    color: hsl(var(--muted-foreground));
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted));
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.3);
  }

  /* Transitions */
  .wm-fade-in {
    animation: fadeIn var(--duration-normal) var(--ease);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Focus Rings */
  *:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  /* Code/Syntax */
  code {
    font-family: var(--font-mono);
    font-size: 12px;
    background: hsl(var(--muted));
    padding: 2px 6px;
    border-radius: 3px;
    color: hsl(var(--foreground));
  }

  pre {
    font-family: var(--font-mono);
    font-size: 12px;
    background: hsl(var(--muted));
    padding: var(--space-4);
    border-radius: var(--radius);
    overflow-x: auto;
    color: hsl(var(--foreground));
    line-height: 1.6;
  }
`;

export { PREMIUM_STYLES };
