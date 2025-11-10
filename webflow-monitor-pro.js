/**
 * Webflow Monitor Pro
 * Advanced monitoring and debugging tool for Webflow websites
 *
 * Features:
 * - All standard debug console features
 * - GSAP animation monitoring and performance tracking
 * - Video performance tracking (Vimeo/YouTube)
 * - Advanced DOM performance monitoring
 * - Click rage and dead click detection
 * - Scroll depth and viewport intersection tracking
 * - Memory leak detection
 * - FPS counter with animation jank detection
 * - Global variable pollution tracking
 * - Console hijacking detection
 * - Third-party script impact analysis
 * - And much more...
 *
 * @version 2.0.0
 * @author Webflow Monitor Team
 */

(function() {
  'use strict';

  // Prevent multiple instances
  if (window.__WEBFLOW_MONITOR_PRO__) {
    console.log('Webflow Monitor Pro already active');
    return;
  }
  window.__WEBFLOW_MONITOR_PRO__ = true;

  class WebflowMonitorPro {
    constructor(config = {}) {
      // Configuration
      this.config = {
        enableLogging: true,
        logLevel: 'all', // 'errors', 'warnings', 'all'
        trackPerformance: true,
        trackGSAP: true,
        trackVideos: true,
        trackClicks: true,
        trackScroll: true,
        trackMemory: true,
        showFPS: true,
        environment: this.detectEnvironment(),
        reportingEndpoint: null,
        performanceBudget: {
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          fcp: 1800,
          ttfb: 600
        },
        ...config
      };

      // Data storage
      this.data = {
        webflow: {},
        performance: {},
        errors: [],
        warnings: [],
        accessibility: [],
        seo: [],
        network: [],
        cssIssues: [],
        gsap: {
          timelines: [],
          scrollTriggers: [],
          animations: [],
          performance: {}
        },
        videos: [],
        dom: {
          queries: {},
          mutations: 0,
          depth: 0,
          size: 0
        },
        clicks: {
          rage: [],
          dead: []
        },
        scroll: {
          depth: 0,
          maxDepth: 0,
          intersections: {}
        },
        memory: {
          snapshots: [],
          leaks: []
        },
        fps: {
          current: 0,
          average: 0,
          drops: []
        },
        global: {
          variables: [],
          pollution: []
        },
        scripts: {
          loaded: [],
          failed: [],
          duplicates: [],
          timing: {}
        },
        pageSpeed: {
          loading: false,
          loaded: false,
          error: null,
          mobile: {
            score: null,
            scores: {},
            opportunities: [],
            diagnostics: []
          },
          desktop: {
            score: null,
            scores: {},
            opportunities: [],
            diagnostics: []
          },
          recommendations: []
        },
        issues: {
          all: [], // Consolidated issues with severity
          byType: {
            critical: [],
            high: [],
            medium: [],
            low: []
          },
          patterns: [], // Detected anti-patterns
          resources: {
            byVendor: {},
            blocking: [],
            large: [],
            duplicate: []
          },
          fixes: [] // AI-generated fix suggestions
        }
      };

      // State
      this.observers = [];
      this.timers = [];
      this.isMinimized = false;
      this.isExpanded = false;
      this.activeTab = 'overview';
      this.fpsCounter = null;
      this.lastFrameTime = performance.now();
      this.frameCount = 0;
      this.originalConsole = {};
      this.theme = localStorage.getItem('wm-theme') || 'dark';
      this.commandPaletteOpen = false;
      this.commandSearchQuery = '';
      this.selectedCommandIndex = 0;

      this.init();
    }

    /**
     * Detect environment (development, staging, production)
     */
    detectEnvironment() {
      const hostname = window.location.hostname;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return 'development';
      }
      if (hostname.includes('webflow.io') || hostname.includes('staging') || hostname.includes('dev.')) {
        return 'staging';
      }
      return 'production';
    }

    /**
     * Initialize the monitor
     */
    init() {
      console.log('%c🔍 Webflow Monitor Pro Initializing...', 'color: #6366F1; font-size: 14px; font-weight: bold;');

      // Setup monitoring modules
      this.createShadowDOM();
      this.injectStyles();
      this.createUI();
      this.setupEventListeners();

      // Core monitoring
      this.setupConsoleInterception();
      this.setupErrorTracking();
      this.setupPerformanceMonitoring();
      this.auditWebflow();
      this.auditAccessibility();
      this.auditSEO();
      this.auditCSS();
      this.setupNetworkMonitoring();

      // Advanced monitoring
      if (this.config.trackGSAP) this.monitorGSAP();
      if (this.config.trackVideos) this.monitorVideos();
      if (this.config.trackClicks) this.setupClickTracking();
      if (this.config.trackScroll) this.setupScrollTracking();
      if (this.config.trackMemory) this.setupMemoryMonitoring();
      if (this.config.showFPS) this.startFPSCounter();

      this.trackGlobalVariables();
      this.detectConsoleHijacking();
      this.trackScriptLoading();
      this.setupDOMPerformanceTracking();
      this.detectDuplicateScripts();

      // Start continuous monitoring
      this.startMonitoring();

      // Run AI Issue Detective
      setTimeout(() => this.analyzeIssues(), 2000); // Run after 2 seconds to collect initial data

      // Initial render
      this.updateUI();

      console.log('%c✅ Webflow Monitor Pro Ready!', 'color: #10B981; font-size: 14px; font-weight: bold;');
      this.logSummary();
    }

    /**
     * Create Shadow DOM
     */
    createShadowDOM() {
      this.container = document.createElement('div');
      this.container.id = 'webflow-monitor-pro-host';
      this.shadow = this.container.attachShadow({ mode: 'open' });

      // Apply theme class to host
      if (this.theme === 'dark') {
        this.container.classList.add('dark');
      }

      document.body.appendChild(this.container);
    }

    /**
     * Inject enhanced styles with FPS counter
     */
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
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

  /* Grid & Metric Components */
  .wm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .wm-metric {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    padding: var(--space-4);
    transition: all var(--duration-fast) var(--ease);
  }

  .wm-metric:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: var(--shadow-sm);
  }

  .wm-metric-label {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
    margin-bottom: var(--space-2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
  }

  .wm-metric-value {
    font-size: 24px;
    font-weight: 700;
    color: hsl(var(--foreground));
    font-variant-numeric: tabular-nums;
  }

  .wm-metric-value.good {
    color: hsl(142.1 76.2% 36.3%);
  }

  .wm-metric-value.warning {
    color: hsl(38 92% 50%);
  }

  .wm-metric-value.error {
    color: hsl(var(--destructive));
  }

  .wm-metric-value.info {
    color: hsl(var(--primary));
  }

  /* Console Entry */
  .wm-console-entry {
    padding: var(--space-2) var(--space-3);
    border-radius: calc(var(--radius) - 2px);
    font-family: var(--font-mono);
    font-size: 12px;
    margin-bottom: var(--space-2);
    border-left: 3px solid hsl(var(--border));
    background: hsl(var(--muted) / 0.3);
  }

  .wm-console-entry.error {
    background: hsl(var(--destructive) / 0.1);
    border-left-color: hsl(var(--destructive));
    color: hsl(var(--destructive));
  }

  .wm-console-entry.warning {
    background: hsl(38 92% 50% / 0.1);
    border-left-color: hsl(38 92% 50%);
    color: hsl(38 92% 50%);
  }

  .wm-console-entry.log {
    background: hsl(var(--muted) / 0.3);
    border-left-color: hsl(var(--muted-foreground));
    color: hsl(var(--foreground));
  }

  /* Loading State */
  .wm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    color: hsl(var(--muted-foreground));
    font-size: 14px;
  }

  /* FPS Overlay */
  .wm-fps-overlay {
    position: fixed;
    top: 16px;
    left: 16px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    padding: var(--space-3);
    min-width: 80px;
    z-index: 999998;
    box-shadow: var(--shadow-lg);
  }

  .wm-fps-value {
    font-size: 24px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: hsl(var(--foreground));
  }

  .wm-fps-value.good {
    color: hsl(142.1 76.2% 36.3%);
  }

  .wm-fps-value.warning {
    color: hsl(38 92% 50%);
  }

  .wm-fps-value.error {
    color: hsl(var(--destructive));
  }

  .wm-fps-label {
    font-size: 10px;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: var(--space-1);
  }

  .wm-fps-graph {
    height: 40px;
    margin-top: var(--space-2);
    position: relative;
    background: hsl(var(--muted) / 0.3);
    border-radius: 2px;
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

  .wm-command-item-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--foreground));
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
      this.shadow.appendChild(style);
    }

    /**
     * Create UI structure
     */
    createUI() {
      const container = document.createElement('div');
      container.className = 'wm-container';
      container.innerHTML = `
        <!-- Header -->
        <div class="wm-header">
          <div class="wm-header-left">
            <div class="wm-logo">W</div>
            <div class="wm-title-group">
              <div class="wm-title">Webflow Monitor</div>
              <div class="wm-subtitle">${this.config.environment} environment</div>
            </div>
          </div>
          <div class="wm-header-actions">
            <button class="wm-theme-toggle" title="Toggle theme">${this.theme === 'dark' ? '☀️' : '🌙'}</button>
            <button class="wm-btn wm-btn-ghost wm-command-trigger" title="Command Palette (⌘K)">⌘K</button>
            <button class="wm-btn wm-btn-primary wm-export-btn">Export</button>
            <button class="wm-btn wm-btn-icon wm-minimize-btn">−</button>
            <button class="wm-btn wm-btn-icon wm-expand-btn">⛶</button>
            <button class="wm-btn wm-btn-icon wm-close-btn">×</button>
          </div>
        </div>

        <!-- Content Wrapper -->
        <div class="wm-content-wrapper">
          <!-- Sidebar Navigation -->
          <nav class="wm-sidebar">
            <div class="wm-nav">
              <button class="wm-nav-item active" data-tab="overview">
                <span class="wm-nav-item-icon">📊</span>
                <span>Overview</span>
              </button>
              <button class="wm-nav-item" data-tab="issues">
                <span class="wm-nav-item-icon">🎯</span>
                <span>Issues</span>
                <span class="wm-nav-item-badge">0</span>
              </button>
              <button class="wm-nav-item" data-tab="performance">
                <span class="wm-nav-item-icon">⚡</span>
                <span>Performance</span>
              </button>
              <button class="wm-nav-item" data-tab="pagespeed">
                <span class="wm-nav-item-icon">🚀</span>
                <span>PageSpeed</span>
              </button>
              <button class="wm-nav-item" data-tab="gsap">
                <span class="wm-nav-item-icon">✨</span>
                <span>GSAP</span>
                <span class="wm-nav-item-badge">0</span>
              </button>
              <button class="wm-nav-item" data-tab="videos">
                <span class="wm-nav-item-icon">🎬</span>
                <span>Videos</span>
                <span class="wm-nav-item-badge">0</span>
              </button>
              <button class="wm-nav-item" data-tab="errors">
                <span class="wm-nav-item-icon">🔴</span>
                <span>Errors</span>
                <span class="wm-nav-item-badge">0</span>
              </button>
              <button class="wm-nav-item" data-tab="dom">
                <span class="wm-nav-item-icon">📄</span>
                <span>DOM</span>
              </button>
              <button class="wm-nav-item" data-tab="clicks">
                <span class="wm-nav-item-icon">👆</span>
                <span>Clicks</span>
              </button>
              <button class="wm-nav-item" data-tab="scroll">
                <span class="wm-nav-item-icon">📜</span>
                <span>Scroll</span>
              </button>
              <button class="wm-nav-item" data-tab="memory">
                <span class="wm-nav-item-icon">💾</span>
                <span>Memory</span>
              </button>
              <button class="wm-nav-item" data-tab="scripts">
                <span class="wm-nav-item-icon">📦</span>
                <span>Scripts</span>
              </button>
              <button class="wm-nav-item" data-tab="network">
                <span class="wm-nav-item-icon">🌐</span>
                <span>Network</span>
              </button>
              <button class="wm-nav-item" data-tab="console">
                <span class="wm-nav-item-icon">💻</span>
                <span>Console</span>
              </button>
            </div>
          </nav>

          <!-- Main Content -->
          <main class="wm-content">
            <div class="wm-loading">Loading...</div>
          </main>
        </div>

        <!-- Command Palette -->
        <div class="wm-command-palette">
          <div class="wm-command-dialog">
            <input class="wm-command-input" type="text" placeholder="Type a command or search..." autocomplete="off" />
            <div class="wm-command-list"></div>
          </div>
        </div>
      `;

      this.shadow.appendChild(container);
      this.containerElement = container;

      // Create FPS overlay if enabled
      if (this.config.showFPS) {
        const fpsOverlay = document.createElement('div');
        fpsOverlay.className = 'wm-fps-overlay';
        fpsOverlay.innerHTML = `
          <div class="wm-fps-value good">60</div>
          <div class="wm-fps-label">FPS</div>
          <div class="wm-fps-graph"></div>
        `;
        this.shadow.appendChild(fpsOverlay);
        this.fpsOverlay = fpsOverlay;
      }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Sidebar navigation switching
      this.shadow.querySelectorAll('.wm-nav-item').forEach(navItem => {
        navItem.addEventListener('click', () => {
          this.switchTab(navItem.dataset.tab);
        });
      });

      // Minimize/Expand/Close
      this.shadow.querySelector('.wm-minimize-btn').addEventListener('click', () => this.toggleMinimize());
      this.shadow.querySelector('.wm-expand-btn').addEventListener('click', () => this.toggleExpand());
      this.shadow.querySelector('.wm-close-btn').addEventListener('click', () => this.close());
      this.shadow.querySelector('.wm-export-btn').addEventListener('click', () => this.exportReport());

      // Theme toggle
      this.shadow.querySelector('.wm-theme-toggle').addEventListener('click', () => this.toggleTheme());

      // Command palette trigger
      this.shadow.querySelector('.wm-command-trigger').addEventListener('click', () => this.openCommandPalette());

      // Command palette close on backdrop click
      this.shadow.querySelector('.wm-command-palette').addEventListener('click', (e) => {
        if (e.target.classList.contains('wm-command-palette')) {
          this.closeCommandPalette();
        }
      });

      // Command palette input
      const commandInput = this.shadow.querySelector('.wm-command-input');
      commandInput.addEventListener('input', (e) => this.handleCommandSearch(e.target.value));
      commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeCommandPalette();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateCommands(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateCommands(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelectedCommand();
        }
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for command palette
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          this.openCommandPalette();
        }

        // Cmd/Ctrl + Shift + D to toggle minimize
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggleMinimize();
        }

        // Cmd/Ctrl + Shift + F to toggle FPS
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
          e.preventDefault();
          if (this.fpsOverlay) {
            this.fpsOverlay.style.display = this.fpsOverlay.style.display === 'none' ? 'block' : 'none';
          }
        }

        // Escape to close command palette
        if (e.key === 'Escape' && this.commandPaletteOpen) {
          e.preventDefault();
          this.closeCommandPalette();
        }
      });

      // Dragging
      this.setupDragging();

      // Click on minimized state
      this.containerElement.addEventListener('click', (e) => {
        if (this.isMinimized && e.target.closest('.wm-minimized-icon')) {
          this.toggleMinimize();
        }
      });
    }

    /**
     * Setup dragging functionality
     */
    setupDragging() {
      const header = this.shadow.querySelector('.wm-header');
      let isDragging = false;
      let currentX, currentY, initialX, initialY;

      header.addEventListener('mousedown', (e) => {
        if (this.isMinimized || e.target.closest('button')) return;
        isDragging = true;
        initialX = e.clientX - this.containerElement.offsetLeft;
        initialY = e.clientY - this.containerElement.offsetTop;
        this.containerElement.style.transform = 'none';
        this.containerElement.style.top = this.containerElement.offsetTop + 'px';
        this.containerElement.style.left = this.containerElement.offsetLeft + 'px';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        this.containerElement.style.left = currentX + 'px';
        this.containerElement.style.top = currentY + 'px';
      });

      document.addEventListener('mouseup', () => isDragging = false);
    }

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      this.containerElement.classList.toggle('minimized', this.isMinimized);
    }

    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.containerElement.classList.toggle('expanded', this.isExpanded);
    }

    close() {
      this.cleanup();
      this.container.remove();
      window.__WEBFLOW_MONITOR_PRO__ = false;
    }

    cleanup() {
      this.observers.forEach(observer => observer.disconnect());
      this.timers.forEach(timer => clearInterval(timer));
      if (this.fpsCounter) cancelAnimationFrame(this.fpsCounter);
    }

    /**
     * Switch active tab
     */
    switchTab(tabName) {
      this.activeTab = tabName;
      this.shadow.querySelectorAll('.wm-nav-item').forEach(navItem => {
        navItem.classList.toggle('active', navItem.dataset.tab === tabName);
      });

      // Auto-fetch PageSpeed data when tab is opened for the first time
      if (tabName === 'pagespeed' && !this.data.pageSpeed.loaded && !this.data.pageSpeed.loading) {
        console.log('%c🚀 Auto-fetching PageSpeed data...', 'color: #6366F1; font-weight: bold');
        this.fetchPageSpeedData();
      }

      this.renderTabContent(tabName);
    }

    /**
     * Update UI with latest data
     */
    updateUI() {
      this.updateBadges();
      if (this.activeTab) {
        this.renderTabContent(this.activeTab);
      }
    }

    /**
     * Update tab badges
     */
    updateBadges() {
      const badges = {
        issues: this.data.issues.all.length,
        gsap: this.data.gsap.timelines.length + this.data.gsap.scrollTriggers.length,
        videos: this.data.videos.length,
        errors: this.data.errors.length
      };

      Object.entries(badges).forEach(([tab, count]) => {
        const tabElement = this.shadow.querySelector(`[data-tab="${tab}"] .wm-nav-item-badge`);
        if (tabElement) {
          tabElement.textContent = count;
          tabElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
      });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('wm-theme', this.theme);
      this.container.classList.toggle('dark');

      // Update theme toggle icon
      const toggleBtn = this.shadow.querySelector('.wm-theme-toggle');
      if (toggleBtn) {
        toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
      }
    }

    /**
     * Get available commands for command palette
     */
    getCommands() {
      return [
        { id: 'overview', label: 'Go to Overview', icon: '📊', action: () => this.switchTab('overview') },
        { id: 'issues', label: 'Go to AI Issue Detective', icon: '🎯', action: () => this.switchTab('issues') },
        { id: 'performance', label: 'Go to Performance', icon: '⚡', action: () => this.switchTab('performance') },
        { id: 'pagespeed', label: 'Go to PageSpeed', icon: '🚀', action: () => this.switchTab('pagespeed') },
        { id: 'gsap', label: 'Go to GSAP', icon: '✨', action: () => this.switchTab('gsap') },
        { id: 'videos', label: 'Go to Videos', icon: '🎬', action: () => this.switchTab('videos') },
        { id: 'errors', label: 'Go to Errors', icon: '🔴', action: () => this.switchTab('errors') },
        { id: 'dom', label: 'Go to DOM', icon: '📄', action: () => this.switchTab('dom') },
        { id: 'clicks', label: 'Go to Clicks', icon: '👆', action: () => this.switchTab('clicks') },
        { id: 'scroll', label: 'Go to Scroll', icon: '📜', action: () => this.switchTab('scroll') },
        { id: 'memory', label: 'Go to Memory', icon: '💾', action: () => this.switchTab('memory') },
        { id: 'scripts', label: 'Go to Scripts', icon: '📦', action: () => this.switchTab('scripts') },
        { id: 'network', label: 'Go to Network', icon: '🌐', action: () => this.switchTab('network') },
        { id: 'console', label: 'Go to Console', icon: '💻', action: () => this.switchTab('console') },
        { id: 'export', label: 'Export Report', icon: '💾', action: () => this.exportReport() },
        { id: 'theme', label: 'Toggle Theme', icon: '🌓', action: () => this.toggleTheme() },
        { id: 'refresh', label: 'Refresh Data', icon: '🔄', action: () => this.updateUI() },
        { id: 'pagespeed-fetch', label: 'Fetch PageSpeed Data', icon: '🚀', action: () => this.fetchPageSpeedData() },
      ];
    }

    /**
     * Open command palette
     */
    openCommandPalette() {
      this.commandPaletteOpen = true;
      const palette = this.shadow.querySelector('.wm-command-palette');
      const input = this.shadow.querySelector('.wm-command-input');

      if (palette && input) {
        palette.classList.add('active');
        input.focus();
        this.selectedCommandIndex = 0;
        this.renderCommandList(this.getCommands());
      }
    }

    /**
     * Close command palette
     */
    closeCommandPalette() {
      this.commandPaletteOpen = false;
      const palette = this.shadow.querySelector('.wm-command-palette');
      const input = this.shadow.querySelector('.wm-command-input');

      if (palette && input) {
        palette.classList.remove('active');
        input.value = '';
        this.selectedCommandIndex = 0;
      }
    }

    /**
     * Handle command search input
     */
    handleCommandSearch(query) {
      this.commandSearchQuery = query.toLowerCase();
      const commands = this.getCommands();
      const filtered = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(this.commandSearchQuery)
      );
      this.selectedCommandIndex = 0;
      this.renderCommandList(filtered);
    }

    /**
     * Navigate commands with arrow keys
     */
    navigateCommands(direction) {
      const commandItems = this.shadow.querySelectorAll('.wm-command-item');
      if (commandItems.length === 0) return;

      // Remove current selection
      if (commandItems[this.selectedCommandIndex]) {
        commandItems[this.selectedCommandIndex].classList.remove('selected');
      }

      // Update index
      this.selectedCommandIndex += direction;
      if (this.selectedCommandIndex < 0) {
        this.selectedCommandIndex = commandItems.length - 1;
      } else if (this.selectedCommandIndex >= commandItems.length) {
        this.selectedCommandIndex = 0;
      }

      // Add new selection
      if (commandItems[this.selectedCommandIndex]) {
        commandItems[this.selectedCommandIndex].classList.add('selected');
        commandItems[this.selectedCommandIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    /**
     * Execute selected command
     */
    executeSelectedCommand() {
      const commandItems = this.shadow.querySelectorAll('.wm-command-item');
      if (commandItems[this.selectedCommandIndex]) {
        commandItems[this.selectedCommandIndex].click();
      }
    }

    /**
     * Render command list in palette
     */
    renderCommandList(commands) {
      const listContainer = this.shadow.querySelector('.wm-command-list');
      if (!listContainer) return;

      if (commands.length === 0) {
        listContainer.innerHTML = `
          <div class="wm-empty-state" style="padding: 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
            <div style="color: hsl(var(--muted-foreground)); font-size: 14px;">No commands found</div>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = commands.map((cmd, index) => `
        <div class="wm-command-item ${index === this.selectedCommandIndex ? 'selected' : ''}" data-command-id="${cmd.id}">
          <span class="wm-command-item-icon">${cmd.icon}</span>
          <span class="wm-command-item-label">${cmd.label}</span>
        </div>
      `).join('');

      // Add click handlers
      listContainer.querySelectorAll('.wm-command-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          const command = commands[index];
          if (command && command.action) {
            command.action();
            this.closeCommandPalette();
          }
        });
      });
    }

    // ============================================
    // RENDER METHODS
    // ============================================

    renderTabContent(tabName) {
      const content = this.shadow.querySelector('.wm-content');

      switch(tabName) {
        case 'overview':
          content.innerHTML = this.renderOverview();
          break;
        case 'issues':
          content.innerHTML = this.renderIssues();
          break;
        case 'performance':
          content.innerHTML = this.renderPerformance();
          break;
        case 'gsap':
          content.innerHTML = this.renderGSAP();
          break;
        case 'videos':
          content.innerHTML = this.renderVideos();
          break;
        case 'errors':
          content.innerHTML = this.renderErrors();
          break;
        case 'dom':
          content.innerHTML = this.renderDOM();
          break;
        case 'clicks':
          content.innerHTML = this.renderClicks();
          break;
        case 'scroll':
          content.innerHTML = this.renderScroll();
          break;
        case 'memory':
          content.innerHTML = this.renderMemory();
          break;
        case 'scripts':
          content.innerHTML = this.renderScripts();
          break;
        case 'network':
          content.innerHTML = this.renderNetwork();
          break;
        case 'pagespeed':
          content.innerHTML = this.renderPageSpeed();
          break;
        case 'console':
          content.innerHTML = this.renderConsole();
          break;
      }
    }

    renderOverview() {
      const perfScore = this.calculatePerformanceScore();

      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Performance Score</div>
            <div class="wm-metric-value ${perfScore >= 90 ? 'good' : perfScore >= 70 ? 'warning' : 'error'}">${perfScore}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Current FPS</div>
            <div class="wm-metric-value ${this.data.fps.current >= 55 ? 'good' : this.data.fps.current >= 30 ? 'warning' : 'error'}">${Math.round(this.data.fps.current)}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Errors</div>
            <div class="wm-metric-value ${this.data.errors.length === 0 ? 'good' : 'error'}">${this.data.errors.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">DOM Size</div>
            <div class="wm-metric-value">${this.data.dom.size}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Memory</div>
            <div class="wm-metric-value">${this.formatBytes(this.getCurrentMemory())}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Scripts</div>
            <div class="wm-metric-value">${this.data.scripts.loaded.length}</div>
          </div>
        </div>

        <div class="wm-card">
          <div class="wm-card-title">Quick Summary</div>
          <div class="wm-grid">
            ${this.config.trackGSAP ? `
            <div class="wm-metric">
              <div class="wm-metric-label">GSAP Timelines</div>
              <div class="wm-metric-value info">${this.data.gsap.timelines.length}</div>
            </div>
            <div class="wm-metric">
              <div class="wm-metric-label">ScrollTriggers</div>
              <div class="wm-metric-value info">${this.data.gsap.scrollTriggers.length}</div>
            </div>
            ` : ''}
            ${this.config.trackVideos ? `
            <div class="wm-metric">
              <div class="wm-metric-label">Video Players</div>
              <div class="wm-metric-value info">${this.data.videos.length}</div>
            </div>
            ` : ''}
            ${this.config.trackClicks ? `
            <div class="wm-metric">
              <div class="wm-metric-label">Click Rage Events</div>
              <div class="wm-metric-value ${this.data.clicks.rage.length > 0 ? 'warning' : 'good'}">${this.data.clicks.rage.length}</div>
            </div>
            <div class="wm-metric">
              <div class="wm-metric-label">Dead Clicks</div>
              <div class="wm-metric-value ${this.data.clicks.dead.length > 0 ? 'warning' : 'good'}">${this.data.clicks.dead.length}</div>
            </div>
            ` : ''}
          </div>
        </div>

        ${this.data.errors.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Recent Errors</div>
          ${this.data.errors.slice(0, 5).map(error => `
            <div class="wm-console-entry error">${this.escapeHtml(error.message)}</div>
          `).join('')}
        </div>
        ` : ''}
      `;
    }

    renderPerformance() {
      const perf = this.data.performance;
      return `
        <div class="wm-card">
          <div class="wm-card-title">Core Web Vitals</div>
          <table class="wm-table">
            <tr>
              <td>Largest Contentful Paint (LCP)</td>
              <td><code>${Math.round(perf.lcp || 0)}ms</code></td>
              <td>${perf.lcp > 2500 ? '❌ Poor' : perf.lcp > 1200 ? '⚠️ Needs Improvement' : '✅ Good'}</td>
            </tr>
            <tr>
              <td>First Input Delay (FID)</td>
              <td><code>${Math.round(perf.fid || 0)}ms</code></td>
              <td>${perf.fid > 100 ? '❌ Poor' : perf.fid > 50 ? '⚠️ Needs Improvement' : '✅ Good'}</td>
            </tr>
            <tr>
              <td>Cumulative Layout Shift (CLS)</td>
              <td><code>${(perf.cls || 0).toFixed(3)}</code></td>
              <td>${perf.cls > 0.25 ? '❌ Poor' : perf.cls > 0.1 ? '⚠️ Needs Improvement' : '✅ Good'}</td>
            </tr>
            <tr>
              <td>Time to First Byte (TTFB)</td>
              <td><code>${Math.round(perf.ttfb || 0)}ms</code></td>
              <td>${perf.ttfb > 800 ? '❌ Poor' : perf.ttfb > 200 ? '⚠️ OK' : '✅ Good'}</td>
            </tr>
            <tr>
              <td>First Contentful Paint (FCP)</td>
              <td><code>${Math.round(perf.fcp || 0)}ms</code></td>
              <td>${perf.fcp > 3000 ? '❌ Poor' : perf.fcp > 1000 ? '⚠️ OK' : '✅ Good'}</td>
            </tr>
          </table>
        </div>

        <div class="wm-card">
          <div class="wm-card-title">Resource Breakdown</div>
          <div class="wm-grid">
            <div class="wm-metric">
              <div class="wm-metric-label">JavaScript</div>
              <div class="wm-metric-value">${this.formatBytes(perf.jsSize || 0)}</div>
            </div>
            <div class="wm-metric">
              <div class="wm-metric-label">CSS</div>
              <div class="wm-metric-value">${this.formatBytes(perf.cssSize || 0)}</div>
            </div>
            <div class="wm-metric">
              <div class="wm-metric-label">Images</div>
              <div class="wm-metric-value">${this.formatBytes(perf.imageSize || 0)}</div>
            </div>
            <div class="wm-metric">
              <div class="wm-metric-label">Fonts</div>
              <div class="wm-metric-value">${this.formatBytes(perf.fontSize || 0)}</div>
            </div>
          </div>
        </div>
      `;
    }

    renderGSAP() {
      if (!window.gsap) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">GSAP Not Detected</div>
            <p style="color: #94A3B8;">GSAP library is not loaded on this page.</p>
          </div>
        `;
      }

      return `
        <div class="wm-card">
          <div class="wm-card-title">GSAP Information</div>
          <table class="wm-table">
            <tr>
              <td>GSAP Version</td>
              <td><code>${window.gsap.version || 'Unknown'}</code></td>
            </tr>
            <tr>
              <td>Timelines Active</td>
              <td><code>${this.data.gsap.timelines.length}</code></td>
            </tr>
            <tr>
              <td>ScrollTrigger Instances</td>
              <td><code>${this.data.gsap.scrollTriggers.length}</code></td>
            </tr>
            <tr>
              <td>Plugins Loaded</td>
              <td><code>${this.getGSAPPlugins().join(', ') || 'None'}</code></td>
            </tr>
          </table>
        </div>

        ${this.data.gsap.timelines.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Active Timelines</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Progress</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.gsap.timelines.map((tl, i) => `
                <tr>
                  <td><code>Timeline ${i + 1}</code></td>
                  <td>${Math.round(tl.progress * 100)}%</td>
                  <td>${tl.duration.toFixed(2)}s</td>
                  <td>${tl.paused ? '⏸️ Paused' : '▶️ Playing'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${this.data.gsap.scrollTriggers.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">ScrollTrigger Instances</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Trigger</th>
                <th>Start</th>
                <th>End</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.gsap.scrollTriggers.map(st => `
                <tr>
                  <td><code>${st.trigger || 'N/A'}</code></td>
                  <td>${st.start}</td>
                  <td>${st.end}</td>
                  <td>${Math.round(st.progress * 100)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
      `;
    }

    renderVideos() {
      if (this.data.videos.length === 0) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">No Video Players Detected</div>
            <p style="color: #94A3B8;">No Vimeo or YouTube players found on this page.</p>
          </div>
        `;
      }

      return `
        <div class="wm-card">
          <div class="wm-card-title">Video Players (${this.data.videos.length})</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>ID</th>
                <th>Status</th>
                <th>Load Time</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.videos.map(video => `
                <tr>
                  <td>${video.type}</td>
                  <td><code>${video.id || 'N/A'}</code></td>
                  <td>${video.loaded ? '✅ Loaded' : '⏳ Loading'}</td>
                  <td>${video.loadTime ? Math.round(video.loadTime) + 'ms' : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    renderErrors() {
      if (this.data.errors.length === 0) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">No Errors Detected</div>
            <p style="color: #10B981;">✅ All JavaScript is running smoothly!</p>
          </div>
        `;
      }

      return `
        <div class="wm-card">
          <div class="wm-card-title">Errors (${this.data.errors.length})</div>
          <div class="wm-console">
            ${this.data.errors.map(error => `
              <div class="wm-console-entry error">
                <div><strong>${this.escapeHtml(error.message)}</strong></div>
                ${error.stack ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.7;">${this.escapeHtml(error.stack.split('\n').slice(0, 3).join('\n'))}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderDOM() {
      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">DOM Nodes</div>
            <div class="wm-metric-value">${this.data.dom.size}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">DOM Depth</div>
            <div class="wm-metric-value">${this.data.dom.depth}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Mutations</div>
            <div class="wm-metric-value">${this.data.dom.mutations}</div>
          </div>
        </div>

        <div class="wm-card">
          <div class="wm-card-title">Most Queried Selectors</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Selector</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(this.data.dom.queries)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([selector, count]) => `
                  <tr>
                    <td><code>${this.escapeHtml(selector)}</code></td>
                    <td>${count}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No data yet</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
    }

    renderClicks() {
      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Click Rage Events</div>
            <div class="wm-metric-value ${this.data.clicks.rage.length > 0 ? 'warning' : 'good'}">${this.data.clicks.rage.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Dead Clicks</div>
            <div class="wm-metric-value ${this.data.clicks.dead.length > 0 ? 'warning' : 'good'}">${this.data.clicks.dead.length}</div>
          </div>
        </div>

        ${this.data.clicks.rage.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Click Rage Events (User Frustration)</div>
          <p class="wm-mb-2" style="color: #94A3B8; font-size: 12px;">Detected rapid repeated clicks - indicates user frustration</p>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Clicks</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.clicks.rage.map(rage => `
                <tr>
                  <td><code>${this.escapeHtml(rage.selector)}</code></td>
                  <td>${rage.count}</td>
                  <td>${new Date(rage.timestamp).toLocaleTimeString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${this.data.clicks.dead.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Dead Clicks (Non-interactive Elements)</div>
          <p class="wm-mb-2" style="color: #94A3B8; font-size: 12px;">Clicks on elements with no event listeners</p>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.clicks.dead.map(click => `
                <tr>
                  <td><code>${this.escapeHtml(click.selector)}</code></td>
                  <td>${new Date(click.timestamp).toLocaleTimeString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
      `;
    }

    renderScroll() {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollPercent = Math.round((this.data.scroll.maxDepth / maxScroll) * 100);

      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Current Scroll</div>
            <div class="wm-metric-value">${Math.round(this.data.scroll.depth)}px</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Max Scroll Depth</div>
            <div class="wm-metric-value">${scrollPercent}%</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Page Height</div>
            <div class="wm-metric-value">${document.documentElement.scrollHeight}px</div>
          </div>
        </div>

        <div class="wm-card">
          <div class="wm-card-title">Scroll Depth Analysis</div>
          <div style="background: rgba(30, 41, 59, 0.4); padding: 12px; border-radius: 8px;">
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">User scrolled to ${scrollPercent}% of page</div>
            <div style="width: 100%; height: 8px; background: rgba(15, 23, 42, 0.6); border-radius: 4px; overflow: hidden;">
              <div style="width: ${scrollPercent}%; height: 100%; background: linear-gradient(90deg, #6366F1, #3B82F6); border-radius: 4px;"></div>
            </div>
          </div>
        </div>
      `;
    }

    renderMemory() {
      const currentMemory = this.getCurrentMemory();

      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Current Memory</div>
            <div class="wm-metric-value">${this.formatBytes(currentMemory)}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Snapshots</div>
            <div class="wm-metric-value">${this.data.memory.snapshots.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Potential Leaks</div>
            <div class="wm-metric-value ${this.data.memory.leaks.length > 0 ? 'warning' : 'good'}">${this.data.memory.leaks.length}</div>
          </div>
        </div>

        ${this.data.memory.snapshots.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Memory Over Time</div>
          <div class="wm-timeline">
            ${this.data.memory.snapshots.slice(-10).map(snapshot => `
              <div class="wm-timeline-item">
                <div class="wm-timeline-dot"></div>
                <div class="wm-timeline-time">${new Date(snapshot.timestamp).toLocaleTimeString()}</div>
                <div class="wm-timeline-content">${this.formatBytes(snapshot.usedJSHeapSize)} used / ${this.formatBytes(snapshot.totalJSHeapSize)} total</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      `;
    }

    renderScripts() {
      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Scripts Loaded</div>
            <div class="wm-metric-value good">${this.data.scripts.loaded.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Failed Scripts</div>
            <div class="wm-metric-value ${this.data.scripts.failed.length > 0 ? 'error' : 'good'}">${this.data.scripts.failed.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Duplicates</div>
            <div class="wm-metric-value ${this.data.scripts.duplicates.length > 0 ? 'warning' : 'good'}">${this.data.scripts.duplicates.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Global Vars</div>
            <div class="wm-metric-value">${this.data.global.pollution.length}</div>
          </div>
        </div>

        ${this.data.scripts.loaded.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Loaded Scripts</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>Script</th>
                <th>Type</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.scripts.loaded.map(script => `
                <tr>
                  <td><code>${this.truncate(script.src || script.name, 60)}</code></td>
                  <td>${script.type || 'inline'}</td>
                  <td>${script.size ? this.formatBytes(script.size) : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${this.data.scripts.duplicates.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">⚠️ Duplicate Scripts Detected</div>
          <p class="wm-mb-2" style="color: #F59E0B; font-size: 12px;">The following scripts are loaded multiple times:</p>
          <ul style="list-style: none; padding: 0;">
            ${this.data.scripts.duplicates.map(dup => `
              <li style="padding: 8px; background: rgba(245, 158, 11, 0.1); border-left: 3px solid #F59E0B; margin-bottom: 8px; border-radius: 4px;">
                <code>${this.escapeHtml(dup)}</code>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        ${this.data.global.pollution.length > 0 ? `
        <div class="wm-card">
          <div class="wm-card-title">Global Variable Pollution</div>
          <p class="wm-mb-2" style="color: #94A3B8; font-size: 12px;">Variables added to window object (first 20):</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${this.data.global.pollution.slice(0, 20).map(varName => `
              <code style="padding: 4px 8px;">${this.escapeHtml(varName)}</code>
            `).join('')}
          </div>
        </div>
        ` : ''}
      `;
    }

    renderNetwork() {
      const failedRequests = this.data.network.filter(r => r.status >= 400);
      const slowRequests = this.data.network.filter(r => r.duration > 3000);

      return `
        <div class="wm-grid">
          <div class="wm-metric">
            <div class="wm-metric-label">Total Requests</div>
            <div class="wm-metric-value">${this.data.network.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Failed</div>
            <div class="wm-metric-value ${failedRequests.length > 0 ? 'error' : 'good'}">${failedRequests.length}</div>
          </div>
          <div class="wm-metric">
            <div class="wm-metric-label">Slow (&gt;3s)</div>
            <div class="wm-metric-value ${slowRequests.length > 0 ? 'warning' : 'good'}">${slowRequests.length}</div>
          </div>
        </div>

        <div class="wm-card">
          <div class="wm-card-title">All Requests</div>
          <table class="wm-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Type</th>
                <th>Size</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.network.map(req => `
                <tr>
                  <td><code>${this.truncate(req.name, 50)}</code></td>
                  <td>${req.type}</td>
                  <td>${this.formatBytes(req.size || 0)}</td>
                  <td>${Math.round(req.duration || 0)}ms</td>
                  <td><span class="${req.status >= 400 ? 'wm-console-entry error' : 'wm-console-entry success'}">${req.status || 'pending'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    renderPageSpeed() {
      const ps = this.data.pageSpeed;

      // Show loading state
      if (ps.loading) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">⏳ Loading PageSpeed Insights...</div>
            <div style="padding: 40px; text-align: center;">
              <div style="margin-bottom: 16px; font-size: 15px;">🔄 Running Google PageSpeed analysis...</div>
              <div style="color: #94A3B8; margin-bottom: 8px;">This typically takes 30-60 seconds</div>
              <div style="color: #64748B; font-size: 13px;">Google is analyzing your site for mobile and desktop performance</div>
              <div style="margin-top: 24px; padding: 16px; background: rgba(99, 102, 241, 0.1); border-radius: 8px; border: 1px solid rgba(99, 102, 241, 0.2);">
                <div style="color: #A5B4FC; font-size: 13px;">💡 Tip: Keep this tab open while the analysis runs</div>
              </div>
            </div>
          </div>
        `;
      }

      // Show error state
      if (ps.error) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">❌ PageSpeed Error</div>
            <div style="padding: 20px;">
              <div style="color: #EF4444; margin-bottom: 12px;">Failed to fetch PageSpeed data</div>
              <div style="color: #94A3B8; font-size: 13px;">${this.escapeHtml(ps.error)}</div>
              <button class="wm-btn wm-btn-primary" style="margin-top: 16px;" onclick="window.webflowMonitor.fetchPageSpeedData()">
                Retry
              </button>
            </div>
          </div>
        `;
      }

      // Show empty state with fetch button
      if (!ps.loaded) {
        return `
          <div class="wm-card">
            <div class="wm-card-title">🚀 Google PageSpeed Insights</div>
            <div style="padding: 40px; text-align: center;">
              <div style="margin-bottom: 16px; color: #CBD5E1;">
                Get comprehensive performance insights from Google PageSpeed
              </div>
              <button class="wm-btn wm-btn-primary" onclick="window.webflowMonitor.fetchPageSpeedData()">
                Run PageSpeed Test
              </button>
              <div style="margin-top: 12px; color: #64748B; font-size: 12px;">
                This will analyze mobile and desktop performance
              </div>
            </div>
          </div>
        `;
      }

      // Helper function to get score color
      const getScoreColor = (score) => {
        if (score >= 90) return '#10B981'; // Green
        if (score >= 50) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
      };

      // Helper function to get priority badge color
      const getPriorityColor = (priority) => {
        if (priority === 'high') return '#EF4444';
        if (priority === 'medium') return '#F59E0B';
        return '#6B7280';
      };

      return `
        <div class="wm-card">
          <div class="wm-card-title">🚀 Google PageSpeed Insights</div>

          <!-- Score Overview -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <!-- Mobile Scores -->
            <div style="background: rgba(30, 41, 59, 0.5); padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
              <div style="font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                📱 Mobile
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.mobile.scores.performance)};">
                    ${ps.mobile.scores.performance}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Performance</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.mobile.scores.accessibility)};">
                    ${ps.mobile.scores.accessibility}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Accessibility</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.mobile.scores.bestPractices)};">
                    ${ps.mobile.scores.bestPractices}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Best Practices</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.mobile.scores.seo)};">
                    ${ps.mobile.scores.seo}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">SEO</div>
                </div>
              </div>
            </div>

            <!-- Desktop Scores -->
            <div style="background: rgba(30, 41, 59, 0.5); padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
              <div style="font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                💻 Desktop
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.desktop.scores.performance)};">
                    ${ps.desktop.scores.performance}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Performance</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.desktop.scores.accessibility)};">
                    ${ps.desktop.scores.accessibility}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Accessibility</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.desktop.scores.bestPractices)};">
                    ${ps.desktop.scores.bestPractices}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Best Practices</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 700; color: ${getScoreColor(ps.desktop.scores.seo)};">
                    ${ps.desktop.scores.seo}
                  </div>
                  <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">SEO</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          ${ps.recommendations.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px;">💡 Recommendations</div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${ps.recommendations.map(rec => `
                  <div style="background: rgba(30, 41, 59, 0.5); padding: 16px; border-radius: 8px; border-left: 3px solid ${getPriorityColor(rec.priority)};">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <span style="background: ${getPriorityColor(rec.priority)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase; font-weight: 600;">
                        ${rec.priority}
                      </span>
                      <span style="color: #94A3B8; font-size: 12px;">${rec.category}</span>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 6px;">${this.escapeHtml(rec.issue)}</div>
                    <div style="color: #CBD5E1; font-size: 13px; margin-bottom: 6px;">${this.escapeHtml(rec.recommendation)}</div>
                    <div style="color: #64748B; font-size: 12px; font-style: italic;">${this.escapeHtml(rec.impact)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Top Opportunities (Mobile) -->
          ${ps.mobile.opportunities.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px;">⚡ Top Opportunities (Mobile)</div>
              <table class="wm-table">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Potential Savings</th>
                  </tr>
                </thead>
                <tbody>
                  ${ps.mobile.opportunities.slice(0, 5).map(opp => `
                    <tr>
                      <td>
                        <div style="font-weight: 500;">${this.escapeHtml(opp.title)}</div>
                        <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">${this.escapeHtml(opp.description)}</div>
                      </td>
                      <td style="color: ${opp.savings > 2000 ? '#EF4444' : opp.savings > 1000 ? '#F59E0B' : '#10B981'}; font-weight: 600;">
                        ${(opp.savings / 1000).toFixed(1)}s
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <!-- Diagnostics -->
          ${ps.mobile.diagnostics.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px;">🔍 Diagnostics</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${ps.mobile.diagnostics.slice(0, 5).map(diag => `
                  <div style="background: rgba(30, 41, 59, 0.3); padding: 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div style="font-weight: 500; margin-bottom: 4px;">${this.escapeHtml(diag.title)}</div>
                    <div style="color: #94A3B8; font-size: 12px;">${this.escapeHtml(diag.description)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <button class="wm-btn wm-btn-primary" onclick="window.webflowMonitor.fetchPageSpeedData()" style="width: 100%;">
            🔄 Refresh PageSpeed Data
          </button>
        </div>
      `;
    }

    renderIssues() {
      const issues = this.data.issues;
      const totalIssues = issues.all.length;

      // Helper function to get severity color
      const getSeverityColor = (severity) => {
        const colors = {
          critical: '#EF4444',
          high: '#F59E0B',
          medium: '#F59E0B',
          low: '#6B7280'
        };
        return colors[severity] || '#6B7280';
      };

      // Helper function to get severity icon
      const getSeverityIcon = (severity) => {
        const icons = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '⚪'
        };
        return icons[severity] || '⚪';
      };

      return `
        <div class="wm-card">
          <div class="wm-card-title">🎯 AI Issue Detective</div>

          ${totalIssues === 0 ? `
            <div style="padding: 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #10B981;">No Critical Issues Detected</div>
              <div style="color: #94A3B8;">AI analysis found your site is performing well</div>
              <button class="wm-btn wm-btn-primary" onclick="window.webflowMonitor.analyzeIssues()" style="margin-top: 20px;">
                🔄 Re-analyze
              </button>
            </div>
          ` : `
            <!-- Issue Summary -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
              <div style="background: rgba(239, 68, 68, 0.1); padding: 16px; border-radius: 8px; border-left: 3px solid #EF4444;">
                <div style="font-size: 24px; font-weight: 700; color: #EF4444;">${issues.byType.critical.length}</div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Critical</div>
              </div>
              <div style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: 8px; border-left: 3px solid #F59E0B;">
                <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${issues.byType.high.length}</div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">High Priority</div>
              </div>
              <div style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: 8px; border-left: 3px solid #F59E0B;">
                <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${issues.byType.medium.length}</div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Medium</div>
              </div>
              <div style="background: rgba(107, 114, 128, 0.1); padding: 16px; border-radius: 8px; border-left: 3px solid #6B7280;">
                <div style="font-size: 24px; font-weight: 700; color: #94A3B8;">${issues.byType.low.length}</div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Low Priority</div>
              </div>
            </div>

            <!-- Critical Issues First -->
            ${issues.byType.critical.length > 0 ? `
              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #EF4444;">🔴 Critical Issues</div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${issues.byType.critical.map(issue => `
                    <div style="background: rgba(239, 68, 68, 0.05); padding: 16px; border-radius: 8px; border-left: 3px solid #EF4444;">
                      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                          <div style="font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(issue.title)}</div>
                          <div style="color: #CBD5E1; font-size: 13px; margin-bottom: 8px;">${this.escapeHtml(issue.description)}</div>
                        </div>
                        ${issue.source ? `<div style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap;">${this.escapeHtml(issue.source)}</div>` : ''}
                      </div>
                      ${issue.fix ? `
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 6px; border-left: 2px solid #10B981; margin-top: 8px;">
                          <div style="font-size: 12px; font-weight: 600; color: #10B981; margin-bottom: 4px;">💡 AI Suggestion:</div>
                          <div style="color: #CBD5E1; font-size: 13px;">${this.escapeHtml(issue.fix)}</div>
                        </div>
                      ` : ''}
                      ${issue.impact ? `<div style="color: #94A3B8; font-size: 12px; margin-top: 8px; font-style: italic;">Impact: ${this.escapeHtml(issue.impact)}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- High Priority Issues -->
            ${issues.byType.high.length > 0 ? `
              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #F59E0B;">🟠 High Priority Issues</div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${issues.byType.high.map(issue => `
                    <div style="background: rgba(245, 158, 11, 0.05); padding: 16px; border-radius: 8px; border-left: 3px solid #F59E0B;">
                      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                          <div style="font-weight: 600; margin-bottom: 4px;">${this.escapeHtml(issue.title)}</div>
                          <div style="color: #CBD5E1; font-size: 13px; margin-bottom: 8px;">${this.escapeHtml(issue.description)}</div>
                        </div>
                        ${issue.source ? `<div style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap;">${this.escapeHtml(issue.source)}</div>` : ''}
                      </div>
                      ${issue.fix ? `
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 6px; border-left: 2px solid #10B981; margin-top: 8px;">
                          <div style="font-size: 12px; font-weight: 600; color: #10B981; margin-bottom: 4px;">💡 AI Suggestion:</div>
                          <div style="color: #CBD5E1; font-size: 13px;">${this.escapeHtml(issue.fix)}</div>
                        </div>
                      ` : ''}
                      ${issue.impact ? `<div style="color: #94A3B8; font-size: 12px; margin-top: 8px; font-style: italic;">Impact: ${this.escapeHtml(issue.impact)}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Anti-Patterns Detected -->
            ${issues.patterns.length > 0 ? `
              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px;">⚠️ Anti-Patterns Detected</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${issues.patterns.map(pattern => `
                    <div style="background: rgba(30, 41, 59, 0.5); padding: 12px; border-radius: 6px; border-left: 2px solid #F59E0B;">
                      <div style="font-weight: 500; margin-bottom: 4px;">${this.escapeHtml(pattern.name)}</div>
                      <div style="color: #94A3B8; font-size: 12px;">${this.escapeHtml(pattern.description)}</div>
                      ${pattern.occurrences ? `<div style="color: #64748B; font-size: 11px; margin-top: 4px;">Found ${pattern.occurrences} time(s)</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Resource Attribution -->
            ${Object.keys(issues.resources.byVendor).length > 0 ? `
              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; margin-bottom: 12px; font-size: 15px;">📦 Resource Attribution</div>
                <table class="wm-table">
                  <thead>
                    <tr>
                      <th>Vendor/Source</th>
                      <th>Scripts</th>
                      <th>Total Size</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.entries(issues.resources.byVendor).map(([vendor, data]) => `
                      <tr>
                        <td style="font-weight: 500;">${this.escapeHtml(vendor)}</td>
                        <td>${data.count}</td>
                        <td>${this.formatBytes(data.size)}</td>
                        <td>
                          ${data.blocking > 0 ? `<span style="color: #EF4444;">⚠️ ${data.blocking} blocking</span>` : '<span style="color: #10B981;">✓</span>'}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <button class="wm-btn wm-btn-primary" onclick="window.webflowMonitor.analyzeIssues()" style="width: 100%;">
              🔄 Re-analyze Issues
            </button>
          `}
        </div>
      `;
    }

    renderConsole() {
      return `
        <div class="wm-card">
          <div class="wm-card-title">Console Output (Latest 100)</div>
          <div class="wm-console">
            ${this.consoleHistory.slice(-100).map(entry => `
              <div class="wm-console-entry ${entry.type}">
                [${entry.type.toUpperCase()}] ${this.escapeHtml(String(entry.message))}
              </div>
            `).join('') || '<div style="color: #94A3B8;">No console messages yet</div>'}
          </div>
        </div>
      `;
    }

    // ============================================
    // MONITORING METHODS
    // ============================================

    /**
     * Setup console interception
     */
    setupConsoleInterception() {
      this.consoleHistory = [];

      ['log', 'warn', 'error', 'info'].forEach(method => {
        this.originalConsole[method] = console[method];
        console[method] = (...args) => {
          this.consoleHistory.push({
            type: method === 'log' ? 'info' : method,
            message: args.join(' '),
            timestamp: Date.now()
          });
          this.originalConsole[method].apply(console, args);
        };
      });
    }

    /**
     * Setup error tracking
     */
    setupErrorTracking() {
      window.addEventListener('error', (e) => {
        this.data.errors.push({
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          timestamp: Date.now()
        });
        this.updateUI();
      });

      window.addEventListener('unhandledrejection', (e) => {
        this.data.errors.push({
          message: `Unhandled Promise Rejection: ${e.reason}`,
          stack: e.reason?.stack,
          timestamp: Date.now()
        });
        this.updateUI();
      });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      this.data.performance = {
        pageLoadTime: perf ? Math.round(perf.loadEventEnd - perf.fetchStart) : 0,
        domContentLoaded: perf ? Math.round(perf.domContentLoadedEventEnd - perf.fetchStart) : 0,
        loadEvent: perf ? Math.round(perf.loadEventEnd - perf.fetchStart) : 0,
        ttfb: perf ? Math.round(perf.responseStart - perf.requestStart) : 0,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        lcp: 0,
        fid: 0,
        cls: 0
      };

      // Calculate resource sizes
      const resources = performance.getEntriesByType('resource');
      this.data.performance.jsSize = resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.cssSize = resources.filter(r => r.name.includes('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.imageSize = resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.fontSize = resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

      // Performance observers
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.data.performance.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          this.observers.push(lcpObserver);
        } catch (e) {}

        try {
          const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
              this.data.performance.fid = Math.round(entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          this.observers.push(fidObserver);
        } catch (e) {}

        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                this.data.performance.cls = Math.round(clsValue * 1000) / 1000;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          this.observers.push(clsObserver);
        } catch (e) {}
      }
    }

    /**
     * Fetch Google PageSpeed Insights data
     */
    async fetchPageSpeedData() {
      this.data.pageSpeed.loading = true;
      this.data.pageSpeed.error = null;
      this.updateUI(); // Show loading state immediately

      const url = encodeURIComponent(window.location.href);
      const apiKey = 'AIzaSyBNRu1o8lSmSYBH8vPsLXGhMSL0TQXZQ-8'; // Public PageSpeed API key

      try {
        console.log('%c⏳ Fetching PageSpeed Insights...', 'color: #6366F1; font-weight: bold;');
        console.log('%c⏰ This may take 30-60 seconds...', 'color: #94A3B8; font-style: italic;');

        // Create abort controller with 90 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);

        // Fetch both mobile and desktop data with timeout
        const [mobileResponse, desktopResponse] = await Promise.all([
          fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&key=${apiKey}`, {
            signal: controller.signal
          }),
          fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=desktop&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&key=${apiKey}`, {
            signal: controller.signal
          })
        ]);

        clearTimeout(timeoutId);

        // Check if responses are OK
        if (!mobileResponse.ok || !desktopResponse.ok) {
          throw new Error(`API Error: ${mobileResponse.status} - ${mobileResponse.statusText}`);
        }

        const mobileData = await mobileResponse.json();
        const desktopData = await desktopResponse.json();

        // Check for API errors in response
        if (mobileData.error) {
          throw new Error(`PageSpeed API Error: ${mobileData.error.message || 'Unknown error'}`);
        }
        if (desktopData.error) {
          throw new Error(`PageSpeed API Error: ${desktopData.error.message || 'Unknown error'}`);
        }

        // Parse mobile data
        if (mobileData.lighthouseResult) {
          const lr = mobileData.lighthouseResult;
          this.data.pageSpeed.mobile.score = Math.round((lr.categories.performance?.score || 0) * 100);
          this.data.pageSpeed.mobile.scores = {
            performance: Math.round((lr.categories.performance?.score || 0) * 100),
            accessibility: Math.round((lr.categories.accessibility?.score || 0) * 100),
            bestPractices: Math.round((lr.categories['best-practices']?.score || 0) * 100),
            seo: Math.round((lr.categories.seo?.score || 0) * 100)
          };

          // Extract opportunities
          this.data.pageSpeed.mobile.opportunities = Object.entries(lr.audits)
            .filter(([key, audit]) => audit.score !== null && audit.score < 1 && audit.details?.overallSavingsMs)
            .map(([key, audit]) => ({
              id: key,
              title: audit.title,
              description: audit.description,
              score: audit.score,
              savings: audit.details.overallSavingsMs,
              displayValue: audit.displayValue
            }))
            .sort((a, b) => b.savings - a.savings)
            .slice(0, 10);

          // Extract diagnostics
          this.data.pageSpeed.mobile.diagnostics = Object.entries(lr.audits)
            .filter(([key, audit]) => audit.score !== null && audit.score < 1 && !audit.details?.overallSavingsMs && audit.scoreDisplayMode === 'binary')
            .map(([key, audit]) => ({
              id: key,
              title: audit.title,
              description: audit.description,
              score: audit.score
            }))
            .slice(0, 10);
        }

        // Parse desktop data
        if (desktopData.lighthouseResult) {
          const lr = desktopData.lighthouseResult;
          this.data.pageSpeed.desktop.score = Math.round((lr.categories.performance?.score || 0) * 100);
          this.data.pageSpeed.desktop.scores = {
            performance: Math.round((lr.categories.performance?.score || 0) * 100),
            accessibility: Math.round((lr.categories.accessibility?.score || 0) * 100),
            bestPractices: Math.round((lr.categories['best-practices']?.score || 0) * 100),
            seo: Math.round((lr.categories.seo?.score || 0) * 100)
          };

          // Extract opportunities
          this.data.pageSpeed.desktop.opportunities = Object.entries(lr.audits)
            .filter(([key, audit]) => audit.score !== null && audit.score < 1 && audit.details?.overallSavingsMs)
            .map(([key, audit]) => ({
              id: key,
              title: audit.title,
              description: audit.description,
              score: audit.score,
              savings: audit.details.overallSavingsMs,
              displayValue: audit.displayValue
            }))
            .sort((a, b) => b.savings - a.savings)
            .slice(0, 10);

          // Extract diagnostics
          this.data.pageSpeed.desktop.diagnostics = Object.entries(lr.audits)
            .filter(([key, audit]) => audit.score !== null && audit.score < 1 && !audit.details?.overallSavingsMs && audit.scoreDisplayMode === 'binary')
            .map(([key, audit]) => ({
              id: key,
              title: audit.title,
              description: audit.description,
              score: audit.score
            }))
            .slice(0, 10);
        }

        // Generate recommendations
        this.generatePageSpeedRecommendations();

        this.data.pageSpeed.loaded = true;
        this.data.pageSpeed.loading = false;

        console.log('%c✅ PageSpeed data loaded!', 'color: #10B981; font-weight: bold;');
        this.updateUI();

      } catch (error) {
        console.error('%c❌ PageSpeed fetch failed:', 'color: #EF4444', error);

        // Better error messages
        let errorMessage = error.message;
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - PageSpeed API took too long to respond. Try again later.';
        } else if (errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network error - Unable to reach PageSpeed API. Check your internet connection.';
        }

        this.data.pageSpeed.error = errorMessage;
        this.data.pageSpeed.loading = false;
        this.updateUI();
      }
    }

    /**
     * Generate PageSpeed recommendations
     */
    generatePageSpeedRecommendations() {
      const recommendations = [];
      const mobile = this.data.pageSpeed.mobile;
      const desktop = this.data.pageSpeed.desktop;

      // Performance recommendations
      if (mobile.scores.performance < 50 || desktop.scores.performance < 50) {
        recommendations.push({
          priority: 'high',
          category: 'Performance',
          issue: 'Poor Performance Score',
          recommendation: 'Your site has a low performance score. Focus on the top opportunities listed below to improve load times.',
          impact: 'Critical - affects user experience and SEO rankings'
        });
      } else if (mobile.scores.performance < 90 || desktop.scores.performance < 90) {
        recommendations.push({
          priority: 'medium',
          category: 'Performance',
          issue: 'Performance Can Be Improved',
          recommendation: 'Your site is performing adequately but has room for optimization. Review the opportunities below.',
          impact: 'Moderate - minor improvements can enhance user experience'
        });
      }

      // Accessibility recommendations
      if (mobile.scores.accessibility < 90 || desktop.scores.accessibility < 90) {
        recommendations.push({
          priority: 'high',
          category: 'Accessibility',
          issue: 'Accessibility Issues Detected',
          recommendation: 'Improve accessibility by adding alt text to images, ensuring proper color contrast, and using semantic HTML.',
          impact: 'Critical - affects users with disabilities and legal compliance'
        });
      }

      // SEO recommendations
      if (mobile.scores.seo < 90 || desktop.scores.seo < 90) {
        recommendations.push({
          priority: 'medium',
          category: 'SEO',
          issue: 'SEO Improvements Needed',
          recommendation: 'Optimize meta tags, ensure mobile-friendliness, and fix any crawlability issues.',
          impact: 'Important - affects search engine visibility'
        });
      }

      // Best practices recommendations
      if (mobile.scores.bestPractices < 90 || desktop.scores.bestPractices < 90) {
        recommendations.push({
          priority: 'low',
          category: 'Best Practices',
          issue: 'Best Practice Violations',
          recommendation: 'Follow modern web development best practices for security, compatibility, and maintainability.',
          impact: 'Low - improves code quality and security'
        });
      }

      // Specific opportunity-based recommendations
      const allOpportunities = [...mobile.opportunities, ...desktop.opportunities];
      const topOpportunity = allOpportunities.sort((a, b) => b.savings - a.savings)[0];

      if (topOpportunity && topOpportunity.savings > 1000) {
        recommendations.push({
          priority: 'high',
          category: 'Performance',
          issue: topOpportunity.title,
          recommendation: topOpportunity.description,
          impact: `Could save ${Math.round(topOpportunity.savings / 1000)}s`
        });
      }

      this.data.pageSpeed.recommendations = recommendations;
    }

    /**
     * AI-Powered Issue Analysis
     * Analyzes site for issues, patterns, and generates fixes
     */
    analyzeIssues() {
      console.log('%c🤖 Running AI Issue Detective...', 'color: #6366F1; font-weight: bold;');

      // Reset issues
      this.data.issues.all = [];
      this.data.issues.byType = { critical: [], high: [], medium: [], low: [] };
      this.data.issues.patterns = [];
      this.data.issues.resources.byVendor = {};
      this.data.issues.fixes = [];

      // 1. ANALYZE ERRORS WITH SOURCE ATTRIBUTION
      this.data.errors.forEach(error => {
        const source = this.attributeErrorSource(error);
        const severity = this.categorizeErrorSeverity(error);
        const fix = this.generateErrorFix(error);

        const issue = {
          type: 'error',
          severity,
          title: error.message || 'JavaScript Error',
          description: error.stack ? error.stack.split('\n')[0] : error.message,
          source,
          fix,
          impact: this.getErrorImpact(error)
        };

        this.data.issues.all.push(issue);
        this.data.issues.byType[severity].push(issue);
      });

      // 2. ANALYZE PERFORMANCE ISSUES
      const perf = this.data.performance;

      if (perf.lcp > 2500) {
        this.data.issues.all.push({
          type: 'performance',
          severity: perf.lcp > 4000 ? 'critical' : 'high',
          title: 'Slow Largest Contentful Paint (LCP)',
          description: `LCP is ${Math.round(perf.lcp)}ms (should be < 2500ms)`,
          source: 'Performance Metrics',
          fix: 'Optimize images, reduce server response time, and eliminate render-blocking resources. Use WebP format for images and lazy loading.',
          impact: 'Users experience slow page loading, affecting engagement and SEO'
        });
        this.data.issues.byType[perf.lcp > 4000 ? 'critical' : 'high'].push(this.data.issues.all[this.data.issues.all.length - 1]);
      }

      if (perf.cls > 0.1) {
        this.data.issues.all.push({
          type: 'performance',
          severity: perf.cls > 0.25 ? 'high' : 'medium',
          title: 'Poor Cumulative Layout Shift (CLS)',
          description: `CLS is ${perf.cls.toFixed(3)} (should be < 0.1)`,
          source: 'Performance Metrics',
          fix: 'Add explicit width/height to images and embeds. Reserve space for ads. Avoid inserting content above existing content.',
          impact: 'Elements shift during load, causing accidental clicks and poor UX'
        });
        this.data.issues.byType[perf.cls > 0.25 ? 'high' : 'medium'].push(this.data.issues.all[this.data.issues.all.length - 1]);
      }

      if (perf.fid > 100) {
        this.data.issues.all.push({
          type: 'performance',
          severity: 'high',
          title: 'Slow First Input Delay (FID)',
          description: `FID is ${Math.round(perf.fid)}ms (should be < 100ms)`,
          source: 'Performance Metrics',
          fix: 'Break up long JavaScript tasks, optimize third-party scripts, and use web workers for heavy computations.',
          impact: 'Page feels unresponsive to user interactions'
        });
        this.data.issues.byType.high.push(this.data.issues.all[this.data.issues.all.length - 1]);
      }

      // 3. DETECT ANTI-PATTERNS
      this.detectAntiPatterns();

      // 4. ANALYZE RESOURCES BY VENDOR
      this.analyzeResourcesByVendor();

      // 5. CHECK FOR MEMORY LEAKS
      if (this.data.memory.leaks.length > 0) {
        this.data.issues.all.push({
          type: 'memory',
          severity: 'high',
          title: 'Memory Leak Detected',
          description: `Detected ${this.data.memory.leaks.length} potential memory leak(s)`,
          source: 'Memory Monitor',
          fix: 'Check for event listeners not being removed, circular references, and detached DOM nodes. Use browser DevTools Memory profiler.',
          impact: 'Page becomes slower over time, eventually causing crashes'
        });
        this.data.issues.byType.high.push(this.data.issues.all[this.data.issues.all.length - 1]);
      }

      // 6. CHECK ACCESSIBILITY ISSUES
      if (this.data.accessibility.length > 0) {
        const criticalA11y = this.data.accessibility.filter(a =>
          a.type === 'error' || a.message.includes('missing alt') || a.message.includes('contrast')
        ).length;

        if (criticalA11y > 0) {
          this.data.issues.all.push({
            type: 'accessibility',
            severity: 'high',
            title: `${this.data.accessibility.length} Accessibility Issue(s)`,
            description: `${criticalA11y} critical a11y violations found`,
            source: 'Accessibility Audit',
            fix: 'Add alt text to all images, ensure proper heading hierarchy, improve color contrast, and add ARIA labels where needed.',
            impact: 'Site is difficult or impossible to use for users with disabilities'
          });
          this.data.issues.byType.high.push(this.data.issues.all[this.data.issues.all.length - 1]);
        }
      }

      // 7. CHECK FOR LARGE RESOURCES
      const largeScripts = this.data.scripts.loaded.filter(s => s.size > 500000); // > 500KB
      if (largeScripts.length > 0) {
        this.data.issues.all.push({
          type: 'resource',
          severity: 'medium',
          title: `${largeScripts.length} Large Script(s) Detected`,
          description: `Scripts larger than 500KB slow down your site`,
          source: 'Resource Analysis',
          fix: 'Use code splitting, lazy loading, and tree shaking. Consider switching to lighter alternatives or loading scripts on-demand.',
          impact: 'Increased page load time and data usage'
        });
        this.data.issues.byType.medium.push(this.data.issues.all[this.data.issues.all.length - 1]);
      }

      console.log('%c✅ AI Issue Detective complete!', 'color: #10B981; font-weight: bold;');
      console.log(`%c   Found ${this.data.issues.all.length} issues (${this.data.issues.byType.critical.length} critical, ${this.data.issues.byType.high.length} high)`, 'color: #94A3B8');

      this.updateUI();
    }

    /**
     * Attribute error to source file/vendor
     */
    attributeErrorSource(error) {
      if (!error.stack) return 'Unknown';

      const stack = error.stack;

      // Try to extract filename from stack trace
      const fileMatch = stack.match(/https?:\/\/([^\/]+)\/([^\s:)]+)/);
      if (fileMatch) {
        const domain = fileMatch[1];
        const filename = fileMatch[2].split('/').pop();

        // Categorize by known vendors
        if (domain.includes('webflow')) return 'Webflow';
        if (domain.includes('google')) return 'Google';
        if (domain.includes('facebook') || domain.includes('fb')) return 'Facebook';
        if (domain.includes('analytics')) return 'Analytics';
        if (domain.includes('jquery')) return 'jQuery';

        return filename || domain;
      }

      return 'Custom Code';
    }

    /**
     * Categorize error severity
     */
    categorizeErrorSeverity(error) {
      const msg = error.message?.toLowerCase() || '';

      // Critical errors
      if (msg.includes('uncaught') || msg.includes('syntax error') || msg.includes('is not defined')) {
        return 'critical';
      }

      // High priority
      if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('timeout')) {
        return 'high';
      }

      // Medium priority
      if (msg.includes('warning') || msg.includes('deprecated')) {
        return 'medium';
      }

      return 'high'; // Default for unknown errors
    }

    /**
     * Generate AI-powered fix suggestion
     */
    generateErrorFix(error) {
      const msg = error.message?.toLowerCase() || '';

      if (msg.includes('is not defined')) {
        const varName = error.message.match(/(\w+) is not defined/)?.[1];
        return varName ?
          `Variable "${varName}" is not defined. Check if the script containing it is loaded before use, or if there's a typo in the variable name.` :
          'Check if all required scripts are loaded and variable names are correct.';
      }

      if (msg.includes('cannot read property') || msg.includes('cannot read properties')) {
        return 'Add null/undefined checks before accessing properties. Use optional chaining (?.) to safely access nested properties.';
      }

      if (msg.includes('failed to fetch')) {
        return 'Check network connectivity, CORS settings, and ensure the API endpoint is accessible. Add proper error handling for fetch requests.';
      }

      if (msg.includes('syntax error')) {
        return 'Fix JavaScript syntax errors. Check for missing brackets, quotes, or semicolons. Use a linter like ESLint.';
      }

      return 'Review the error stack trace to identify the source. Check browser console for more details.';
    }

    /**
     * Get error impact description
     */
    getErrorImpact(error) {
      const msg = error.message?.toLowerCase() || '';

      if (msg.includes('is not defined') || msg.includes('syntax error')) {
        return 'Breaks functionality - features may not work at all';
      }

      if (msg.includes('failed to fetch') || msg.includes('network')) {
        return 'Data loading failures - content may not display';
      }

      return 'May cause unexpected behavior or reduce functionality';
    }

    /**
     * Detect common anti-patterns
     */
    detectAntiPatterns() {
      // Detect excessive DOM queries
      const domQueries = Object.keys(this.data.dom.queries);
      const excessiveQueries = domQueries.filter(selector =>
        this.data.dom.queries[selector] > 100
      );

      if (excessiveQueries.length > 0) {
        this.data.issues.patterns.push({
          name: 'Excessive DOM Queries',
          description: `${excessiveQueries.length} selector(s) queried more than 100 times. Cache DOM references instead.`,
          occurrences: excessiveQueries.length,
          fix: 'Store DOM elements in variables instead of querying repeatedly'
        });
      }

      // Detect duplicate scripts
      if (this.data.scripts.duplicates.length > 0) {
        this.data.issues.patterns.push({
          name: 'Duplicate Scripts',
          description: `${this.data.scripts.duplicates.length} script(s) loaded multiple times`,
          occurrences: this.data.scripts.duplicates.length,
          fix: 'Remove duplicate script tags from your HTML'
        });
      }

      // Detect FPS drops
      if (this.data.fps.drops.length > 5) {
        this.data.issues.patterns.push({
          name: 'Frequent FPS Drops',
          description: 'Animations are janky - frame rate drops frequently',
          occurrences: this.data.fps.drops.length,
          fix: 'Use CSS transforms instead of absolute positioning. Use requestAnimationFrame for JS animations.'
        });
      }

      // Detect rage clicks
      if (this.data.clicks.rage.length > 0) {
        this.data.issues.patterns.push({
          name: 'Rage Clicks Detected',
          description: 'Users are repeatedly clicking - indicates broken UI or slow response',
          occurrences: this.data.clicks.rage.length,
          fix: 'Add loading states, disable buttons during processing, fix broken click handlers'
        });
      }
    }

    /**
     * Analyze resources by vendor/domain
     */
    analyzeResourcesByVendor() {
      const resources = performance.getEntriesByType('resource');
      const vendors = {};

      resources.forEach(resource => {
        try {
          const url = new URL(resource.name);
          const domain = url.hostname;

          // Categorize vendor
          let vendor = domain;
          if (domain.includes('webflow')) vendor = 'Webflow';
          else if (domain.includes('google')) vendor = 'Google';
          else if (domain.includes('facebook') || domain.includes('fb')) vendor = 'Facebook';
          else if (domain.includes('analytics')) vendor = 'Analytics';
          else if (domain === window.location.hostname) vendor = 'Your Site';

          if (!vendors[vendor]) {
            vendors[vendor] = {
              count: 0,
              size: 0,
              blocking: 0
            };
          }

          vendors[vendor].count++;
          vendors[vendor].size += resource.transferSize || 0;

          // Check if blocking
          if (resource.renderBlockingStatus === 'blocking') {
            vendors[vendor].blocking++;
          }
        } catch (e) {
          // Invalid URL, skip
        }
      });

      this.data.issues.resources.byVendor = vendors;
    }

    /**
     * Monitor GSAP
     */
    monitorGSAP() {
      if (!window.gsap) {
        console.log('%c⚠️ GSAP not detected', 'color: #F59E0B');
        return;
      }

      // Track all timelines
      const originalTimeline = window.gsap.timeline;
      window.gsap.timeline = function(...args) {
        const tl = originalTimeline.apply(this, args);
        this.data.gsap.timelines.push({
          timeline: tl,
          duration: tl.duration(),
          progress: tl.progress(),
          paused: tl.paused(),
          reversed: tl.reversed()
        });
        return tl;
      }.bind(this);

      // Monitor ScrollTrigger if available
      if (window.ScrollTrigger) {
        const updateScrollTriggers = () => {
          this.data.gsap.scrollTriggers = window.ScrollTrigger.getAll().map(st => ({
            trigger: st.trigger ? this.getSelector(st.trigger) : 'N/A',
            start: st.vars.start || 'N/A',
            end: st.vars.end || 'N/A',
            progress: st.progress || 0,
            enabled: st.enabled
          }));
        };

        this.timers.push(setInterval(updateScrollTriggers, 1000));
      }

      console.log('%c✅ GSAP monitoring active', 'color: #10B981');
    }

    /**
     * Monitor videos
     */
    monitorVideos() {
      const checkVideos = () => {
        // Check for Vimeo
        document.querySelectorAll('iframe[src*="vimeo.com"]').forEach(iframe => {
          if (!this.data.videos.find(v => v.element === iframe)) {
            const startTime = performance.now();
            this.data.videos.push({
              type: 'Vimeo',
              element: iframe,
              id: iframe.src.match(/vimeo\.com\/video\/(\d+)/)?.[1],
              loaded: iframe.complete,
              loadTime: iframe.complete ? performance.now() - startTime : null
            });
          }
        });

        // Check for YouTube
        document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').forEach(iframe => {
          if (!this.data.videos.find(v => v.element === iframe)) {
            const startTime = performance.now();
            this.data.videos.push({
              type: 'YouTube',
              element: iframe,
              id: iframe.src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/)?.[1],
              loaded: iframe.complete,
              loadTime: iframe.complete ? performance.now() - startTime : null
            });
          }
        });
      };

      checkVideos();
      this.timers.push(setInterval(checkVideos, 2000));
    }

    /**
     * Setup click tracking (rage clicks and dead clicks)
     */
    setupClickTracking() {
      const clickCounts = new Map();
      const RAGE_THRESHOLD = 5;
      const RAGE_WINDOW = 1000; // 1 second

      document.addEventListener('click', (e) => {
        const target = e.target;
        const selector = this.getSelector(target);
        const now = Date.now();

        // Track click count for rage detection
        if (!clickCounts.has(target)) {
          clickCounts.set(target, []);
        }

        const clicks = clickCounts.get(target);
        clicks.push(now);

        // Remove old clicks outside the window
        while (clicks[0] < now - RAGE_WINDOW) {
          clicks.shift();
        }

        // Detect click rage
        if (clicks.length >= RAGE_THRESHOLD) {
          this.data.clicks.rage.push({
            selector,
            count: clicks.length,
            timestamp: now
          });
          clickCounts.delete(target);
          console.log('%c🔥 Click rage detected on: ' + selector, 'color: #EF4444; font-weight: bold');
        }

        // Detect dead clicks (no event listeners)
        const hasListeners = target.onclick || target.addEventListener.toString() !== 'function addEventListener() { [native code] }';
        if (!hasListeners && !target.matches('a, button, input, select, textarea, [onclick]')) {
          this.data.clicks.dead.push({
            selector,
            timestamp: now
          });
        }
      }, true);
    }

    /**
     * Setup scroll tracking
     */
    setupScrollTracking() {
      const updateScroll = () => {
        this.data.scroll.depth = window.scrollY;
        this.data.scroll.maxDepth = Math.max(this.data.scroll.maxDepth, window.scrollY);
      };

      window.addEventListener('scroll', this.debounce(updateScroll, 100));
      updateScroll();
    }

    /**
     * Setup memory monitoring
     */
    setupMemoryMonitoring() {
      const takeSnapshot = () => {
        if (performance.memory) {
          this.data.memory.snapshots.push({
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            timestamp: Date.now()
          });

          // Keep only last 50 snapshots
          if (this.data.memory.snapshots.length > 50) {
            this.data.memory.snapshots.shift();
          }

          // Detect potential memory leaks (simple heuristic)
          if (this.data.memory.snapshots.length >= 10) {
            const recent = this.data.memory.snapshots.slice(-10);
            const growth = recent[recent.length - 1].usedJSHeapSize - recent[0].usedJSHeapSize;
            if (growth > 10000000) { // 10MB growth
              this.data.memory.leaks.push({
                growth,
                timestamp: Date.now()
              });
            }
          }
        }
      };

      takeSnapshot();
      this.timers.push(setInterval(takeSnapshot, 5000));
    }

    /**
     * Start FPS counter
     */
    startFPSCounter() {
      const fpsHistory = [];
      const MAX_HISTORY = 60;

      const measureFPS = () => {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        const fps = 1000 / delta;

        this.data.fps.current = fps;
        fpsHistory.push(fps);

        if (fpsHistory.length > MAX_HISTORY) {
          fpsHistory.shift();
        }

        this.data.fps.average = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;

        // Detect FPS drops
        if (fps < 30 && this.data.fps.average > 50) {
          this.data.fps.drops.push({
            fps,
            timestamp: now
          });
        }

        // Update FPS overlay
        if (this.fpsOverlay) {
          const fpsValue = this.fpsOverlay.querySelector('.wm-fps-value');
          const fpsGraph = this.fpsOverlay.querySelector('.wm-fps-graph');

          fpsValue.textContent = Math.round(fps);
          fpsValue.className = 'wm-fps-value ' + (fps >= 55 ? 'good' : fps >= 30 ? 'ok' : 'bad');

          // Update graph
          const bars = Array.from(fpsGraph.children);
          if (bars.length >= 30) {
            fpsGraph.removeChild(bars[0]);
          }

          const bar = document.createElement('div');
          bar.className = 'wm-fps-bar';
          bar.style.height = `${(fps / 60) * 100}%`;
          fpsGraph.appendChild(bar);
        }

        this.lastFrameTime = now;
        this.fpsCounter = requestAnimationFrame(measureFPS);
      };

      this.fpsCounter = requestAnimationFrame(measureFPS);
    }

    /**
     * Track global variables
     */
    trackGlobalVariables() {
      const knownGlobals = new Set([
        'window', 'document', 'console', 'navigator', 'location', 'history',
        'screen', 'performance', 'localStorage', 'sessionStorage', 'setTimeout',
        'setInterval', 'clearTimeout', 'clearInterval', 'requestAnimationFrame',
        'cancelAnimationFrame', 'fetch', 'XMLHttpRequest', 'WebSocket',
        'Promise', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date',
        'Math', 'JSON', 'RegExp', 'Error', 'Map', 'Set', 'WeakMap', 'WeakSet',
        'Proxy', 'Reflect', 'Symbol', 'Int8Array', 'Uint8Array', 'Int16Array',
        'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array',
        '__WEBFLOW_MONITOR_PRO__'
      ]);

      Object.keys(window).forEach(key => {
        if (!knownGlobals.has(key)) {
          this.data.global.pollution.push(key);
        }
      });

      console.log(`%c📊 Global variables: ${this.data.global.pollution.length} custom`, 'color: #3B82F6');
    }

    /**
     * Detect console hijacking
     */
    detectConsoleHijacking() {
      const isNative = (func) => {
        return func.toString().includes('[native code]');
      };

      const hijacked = [];
      ['log', 'warn', 'error', 'info'].forEach(method => {
        if (!isNative(console[method])) {
          hijacked.push(method);
        }
      });

      if (hijacked.length > 0) {
        console.warn(`%c⚠️ Console hijacking detected: ${hijacked.join(', ')}`, 'color: #F59E0B; font-weight: bold');
      }
    }

    /**
     * Track script loading
     */
    trackScriptLoading() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const resources = performance.getEntriesByType('resource');

      scripts.forEach(script => {
        const resource = resources.find(r => r.name === script.src);

        this.data.scripts.loaded.push({
          src: script.src || 'inline',
          name: script.src ? script.src.split('/').pop() : 'inline',
          type: script.type || 'text/javascript',
          async: script.async,
          defer: script.defer,
          size: resource?.transferSize || null
        });
      });

      // Detect duplicates
      const srcCounts = {};
      scripts.forEach(script => {
        if (script.src) {
          srcCounts[script.src] = (srcCounts[script.src] || 0) + 1;
        }
      });

      Object.entries(srcCounts).forEach(([src, count]) => {
        if (count > 1) {
          this.data.scripts.duplicates.push(src);
        }
      });

      if (this.data.scripts.duplicates.length > 0) {
        console.warn(`%c⚠️ Duplicate scripts detected: ${this.data.scripts.duplicates.length}`, 'color: #F59E0B');
      }
    }

    /**
     * Setup DOM performance tracking
     */
    setupDOMPerformanceTracking() {
      // Track DOM size
      this.data.dom.size = document.querySelectorAll('*').length;
      this.data.dom.depth = this.getMaxDOMDepth();

      // Intercept querySelector calls
      const originalQuerySelector = document.querySelector;
      const originalQuerySelectorAll = document.querySelectorAll;

      document.querySelector = (selector) => {
        this.data.dom.queries[selector] = (this.data.dom.queries[selector] || 0) + 1;
        return originalQuerySelector.call(document, selector);
      };

      document.querySelectorAll = (selector) => {
        this.data.dom.queries[selector] = (this.data.dom.queries[selector] || 0) + 1;
        return originalQuerySelectorAll.call(document, selector);
      };

      // Track mutations
      const mutationObserver = new MutationObserver((mutations) => {
        this.data.dom.mutations += mutations.length;
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      this.observers.push(mutationObserver);
    }

    /**
     * Detect duplicate scripts
     */
    detectDuplicateScripts() {
      // Already done in trackScriptLoading
    }

    /**
     * Audit Webflow
     */
    auditWebflow() {
      this.data.webflow = {
        isWebflow: !!window.Webflow,
        siteId: document.querySelector('meta[name="webflow-site-id"]')?.content,
        environment: window.location.hostname.includes('webflow.io') ? 'staging' : 'production',
        breakpoint: this.getCurrentBreakpoint(),
        webflowVersion: window.Webflow?.version
      };
    }

    /**
     * Audit accessibility
     */
    auditAccessibility() {
      this.data.accessibility = [];

      // Missing alt tags
      document.querySelectorAll('img:not([alt])').forEach(img => {
        this.data.accessibility.push({
          type: 'missing-alt',
          message: 'Image missing alt attribute',
          element: img,
          selector: this.getSelector(img)
        });
      });

      // Missing form labels
      document.querySelectorAll('input:not([type="hidden"]):not([type="submit"])').forEach(input => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label');

        if (!hasLabel && !hasAriaLabel) {
          this.data.accessibility.push({
            type: 'missing-label',
            message: 'Form input missing label',
            element: input,
            selector: this.getSelector(input)
          });
        }
      });
    }

    /**
     * Audit SEO
     */
    auditSEO() {
      this.data.seo = [];

      const title = document.querySelector('title');
      if (!title || !title.textContent.trim()) {
        this.data.seo.push({ type: 'missing-title', message: 'Missing page title' });
      }

      const h1Tags = document.querySelectorAll('h1');
      if (h1Tags.length === 0) {
        this.data.seo.push({ type: 'missing-h1', message: 'No H1 tag found' });
      } else if (h1Tags.length > 1) {
        this.data.seo.push({ type: 'multiple-h1', message: `Multiple H1 tags found (${h1Tags.length})` });
      }
    }

    /**
     * Audit CSS
     */
    auditCSS() {
      this.data.cssIssues = [];

      const bodyWidth = document.body.clientWidth;
      document.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > bodyWidth + 5) {
          this.data.cssIssues.push({
            type: 'overflow',
            message: 'Element causing horizontal scroll',
            element: el,
            selector: this.getSelector(el)
          });
        }
      });
    }

    /**
     * Setup network monitoring
     */
    setupNetworkMonitoring() {
      const resources = performance.getEntriesByType('resource');
      this.data.network = resources.map(r => ({
        name: r.name,
        type: r.initiatorType,
        size: r.transferSize || 0,
        duration: r.duration,
        status: r.responseStatus || 200
      }));
    }

    /**
     * Start continuous monitoring
     */
    startMonitoring() {
      this.timers.push(setInterval(() => {
        this.updateUI();
      }, 2000));
    }

    /**
     * Calculate performance score
     */
    calculatePerformanceScore() {
      const perf = this.data.performance;
      let score = 100;

      if (perf.lcp > 2500) score -= 20;
      if (perf.fid > 100) score -= 15;
      if (perf.cls > 0.1) score -= 15;
      if (perf.fcp > 1800) score -= 10;
      if (perf.ttfb > 600) score -= 10;
      if (perf.totalSize > 3000000) score -= 10;
      if (this.data.network.length > 100) score -= 10;
      if (perf.pageLoadTime > 3000) score -= 10;

      return Math.max(0, Math.round(score));
    }

    /**
     * Export report
     */
    exportReport() {
      try {
        // Clean data to ensure JSON compatibility
        const cleanData = JSON.parse(JSON.stringify(this.data, (key, value) => {
          // Filter out DOM elements, functions, and circular references
          if (value instanceof Element || value instanceof Node) return '[DOM Element]';
          if (typeof value === 'function') return '[Function]';
          if (value === window) return '[Window]';
          if (value === document) return '[Document]';
          return value;
        }));

        const report = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          environment: this.config.environment,
          data: cleanData,
          performanceScore: this.calculatePerformanceScore(),
          pageSpeedScores: this.data.pageSpeed.loaded ? {
            mobile: this.data.pageSpeed.mobile.scores,
            desktop: this.data.pageSpeed.desktop.scores,
            recommendations: this.data.pageSpeed.recommendations
          } : null
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webflow-monitor-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('✅ Report exported successfully', 'success');
        console.log('%c✅ Report exported successfully', 'color: #10B981; font-weight: bold');
      } catch (error) {
        console.error('%c❌ Export failed:', 'color: #EF4444', error);
        this.showToast('❌ Export failed: ' + error.message, 'error');
      }
    }

    /**
     * Log summary to console
     */
    logSummary() {
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366F1');
      console.log('%c📊 Webflow Monitor Pro - Summary', 'color: #6366F1; font-size: 16px; font-weight: bold');
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366F1');
      console.log(`%c⚡ Performance Score: ${this.calculatePerformanceScore()}/100`, 'color: #10B981; font-weight: bold');
      console.log(`%c🎯 FPS: ${Math.round(this.data.fps.current)}`, 'color: #3B82F6');
      console.log(`%c📦 Scripts: ${this.data.scripts.loaded.length} loaded, ${this.data.scripts.duplicates.length} duplicates`, 'color: #94A3B8');
      console.log(`%c🌐 Network: ${this.data.network.length} requests`, 'color: #94A3B8');
      console.log(`%c🔴 Errors: ${this.data.errors.length}`, this.data.errors.length > 0 ? 'color: #EF4444' : 'color: #10B981');

      if (this.config.trackGSAP && window.gsap) {
        console.log(`%c✨ GSAP: ${this.data.gsap.timelines.length} timelines, ${this.data.gsap.scrollTriggers.length} ScrollTriggers`, 'color: #10B981');
      }

      if (this.config.trackVideos) {
        console.log(`%c🎬 Videos: ${this.data.videos.length} players`, 'color: #94A3B8');
      }

      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366F1');
      console.log('%cPress Cmd/Ctrl+Shift+D to toggle console', 'color: #64748B; font-style: italic');
      console.log('%cPress Cmd/Ctrl+Shift+F to toggle FPS overlay', 'color: #64748B; font-style: italic');
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    getCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width >= 992) return 'desktop';
      if (width >= 768) return 'tablet';
      if (width >= 480) return 'mobile-landscape';
      return 'mobile';
    }

    getGSAPPlugins() {
      if (!window.gsap) return [];
      const plugins = [];
      if (window.ScrollTrigger) plugins.push('ScrollTrigger');
      if (window.Draggable) plugins.push('Draggable');
      if (window.MotionPathPlugin) plugins.push('MotionPath');
      if (window.TextPlugin) plugins.push('Text');
      return plugins;
    }

    getCurrentMemory() {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    }

    getMaxDOMDepth(element = document.body, depth = 0) {
      if (!element.children.length) return depth;
      return Math.max(...Array.from(element.children).map(child =>
        this.getMaxDOMDepth(child, depth + 1)
      ));
    }

    getSelector(el) {
      if (el.id) return `#${el.id}`;
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) return `${el.tagName.toLowerCase()}.${classes[0]}`;
      }
      return el.tagName.toLowerCase();
    }

    formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    truncate(str, length) {
      if (!str) return '';
      str = String(str);
      return str.length > length ? str.substring(0, length) + '...' : str;
    }

    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    showToast(message, type = 'info') {
      // Simple console-based toast since we don't have a UI toast system
      const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#6366F1'
      };
      console.log(`%c${message}`, `color: ${colors[type]}; font-weight: bold`);
    }
  }

  // Initialize and expose to window
  window.webflowMonitor = new WebflowMonitorPro();
})();
