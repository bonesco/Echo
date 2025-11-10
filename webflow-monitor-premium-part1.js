/**
 * Webflow Monitor Premium
 * Professional-grade monitoring with premium UI inspired by Linear, Raycast, and Apple
 *
 * Premium Features:
 * - Command Palette (Cmd/Ctrl + K)
 * - Performance Trends & Comparisons
 * - AI-powered Recommendations
 * - Screenshot Capture
 * - Advanced Filtering
 * - Custom Performance Budgets
 * - Historical Tracking
 * - Premium Charts & Visualizations
 *
 * @version 3.0.0 Premium
 * @author Webflow Monitor Team
 */

(function() {
  'use strict';

  if (window.__WEBFLOW_MONITOR_PREMIUM__) {
    console.log('Webflow Monitor Premium already active');
    return;
  }
  window.__WEBFLOW_MONITOR_PREMIUM__ = true;

  class WebflowMonitorPremium {
    constructor(config = {}) {
      this.config = {
        enableLogging: true,
        logLevel: 'all',
        trackPerformance: true,
        trackGSAP: true,
        trackVideos: true,
        trackClicks: true,
        trackScroll: true,
        trackMemory: true,
        showFPS: true,
        environment: this.detectEnvironment(),
        theme: 'dark', // dark or light
        enableCommandPalette: true,
        enableComparison: true,
        enableRecommendations: true,
        performanceBudget: {
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          fcp: 1800,
          ttfb: 600,
          totalSize: 3000000
        },
        ...config
      };

      this.data = this.initializeData();
      this.snapshots = [];
      this.observers = [];
      this.timers = [];
      this.isMinimized = false;
      this.isExpanded = false;
      this.activeTab = 'overview';
      this.commandPaletteOpen = false;
      this.searchQuery = '';
      this.selectedCommand = 0;

      this.init();
    }

    initializeData() {
      return {
        webflow: {},
        performance: {},
        errors: [],
        warnings: [],
        accessibility: [],
        seo: [],
        network: [],
        cssIssues: [],
        gsap: { timelines: [], scrollTriggers: [], animations: [], performance: {} },
        videos: [],
        dom: { queries: {}, mutations: 0, depth: 0, size: 0 },
        clicks: { rage: [], dead: [] },
        scroll: { depth: 0, maxDepth: 0, intersections: {} },
        memory: { snapshots: [], leaks: [] },
        fps: { current: 0, average: 0, drops: [], history: [] },
        global: { variables: [], pollution: [] },
        scripts: { loaded: [], failed: [], duplicates: [], timing: {} },
        recommendations: []
      };
    }

    detectEnvironment() {
      const hostname = window.location.hostname;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) return 'development';
      if (hostname.includes('webflow.io') || hostname.includes('staging') || hostname.includes('dev.')) return 'staging';
      return 'production';
    }

    init() {
      console.log('%c🚀 Webflow Monitor Premium Initializing...', 'color: #6366F1; font-size: 16px; font-weight: bold; text-shadow: 0 2px 10px rgba(99, 102, 241, 0.3)');

      this.createShadowDOM();
      this.injectPremiumStyles();
      this.createPremiumUI();
      this.setupEventListeners();
      this.setupCommandPalette();

      // Core monitoring
      this.setupConsoleInterception();
      this.setupErrorTracking();
      this.setupPerformanceMonitoring();
      this.auditWebflow();
      this.auditAccessibility();
      this.auditSEO();
      this.auditCSS();
      this.setupNetworkMonitoring();

      // Advanced features
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

      // Premium features
      if (this.config.enableRecommendations) this.generateRecommendations();
      this.takeSnapshot('initial');

      this.startMonitoring();
      this.updateUI();

      console.log('%c✨ Webflow Monitor Premium Ready!', 'color: #10B981; font-size: 16px; font-weight: bold; text-shadow: 0 2px 10px rgba(16, 185, 129, 0.3)');
      this.showWelcomeToast();
    }

    createShadowDOM() {
      this.container = document.createElement('div');
      this.container.id = 'webflow-monitor-premium-host';
      this.shadow = this.container.attachShadow({ mode: 'open' });
      document.body.appendChild(this.container);
    }

    injectPremiumStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=SF+Mono:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          all: initial;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Premium Container - Enhanced glassmorphism */
        .wmp-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 920px;
          height: 680px;
          background: linear-gradient(135deg,
            rgba(10, 15, 30, 0.98) 0%,
            rgba(20, 25, 45, 0.98) 50%,
            rgba(15, 20, 40, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.03),
            0 24px 48px -12px rgba(0, 0, 0, 0.6),
            0 0 100px -20px rgba(99, 102, 241, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wmp-container.minimized {
          width: 64px;
          height: 64px;
          top: auto;
          left: auto;
          bottom: 24px;
          right: 24px;
          transform: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        }

        .wmp-container.expanded {
          width: 96vw;
          height: 94vh;
        }

        /* Premium Header */
        .wmp-header {
          background: linear-gradient(180deg,
            rgba(255, 255, 255, 0.02) 0%,
            rgba(255, 255, 255, 0.00) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: move;
          user-select: none;
          backdrop-filter: blur(20px);
        }

        .wmp-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          position: relative;
          overflow: hidden;
        }

        .wmp-logo::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0%, 100% { left: -100%; }
          50% { left: 200%; }
        }

        .wmp-title {
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #F1F5F9, #94A3B8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          margin-left: 12px;
        }

        .wmp-badge {
          padding: 4px 10px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.15));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #A855F7, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 8px;
        }

        .wmp-env-badge {
          padding: 5px 12px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 8px;
          font-size: 11px;
          color: #10B981;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin-left: 12px;
        }

        .wmp-env-badge.production {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.25);
          color: #EF4444;
        }

        .wmp-env-badge.staging {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.25);
          color: #F59E0B;
        }

        /* Premium Buttons */
        .wmp-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .wmp-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }

        .wmp-btn:active::before {
          width: 300px;
          height: 300px;
        }

        .wmp-btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .wmp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .wmp-btn-icon {
          width: 36px;
          height: 36px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #94A3B8;
          border-radius: 8px;
        }

        .wmp-btn-icon:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
          color: #F1F5F9;
          transform: translateY(-1px);
        }

        /* Premium Tabs */
        .wmp-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 24px;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .wmp-tabs::-webkit-scrollbar {
          display: none;
        }

        .wmp-tab {
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          font-family: inherit;
          position: relative;
        }

        .wmp-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.04);
          opacity: 0;
          transition: opacity 0.25s;
          border-radius: 8px 8px 0 0;
        }

        .wmp-tab:hover::before {
          opacity: 1;
        }

        .wmp-tab:hover {
          color: #F1F5F9;
        }

        .wmp-tab.active {
          color: #6366F1;
          border-bottom-color: #6366F1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
        }

        .wmp-tab-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 3px 7px;
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .wmp-tab-badge.warning {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.2);
        }

        .wmp-tab-badge.info {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.2);
        }

        .wmp-tab-badge.success {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.2);
        }

        /* Premium Content Area */
        .wmp-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          position: relative;
        }

        .wmp-content::-webkit-scrollbar { width: 10px; }
        .wmp-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin: 4px;
        }
        .wmp-content::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
        .wmp-content::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        /* Premium Cards */
        .wmp-card {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .wmp-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(99, 102, 241, 0.1);
        }

        .wmp-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #F1F5F9;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          letter-spacing: -0.01em;
        }

        /* Premium Grid */
        .wmp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .wmp-metric {
          background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.05) 0%,
            rgba(139, 92, 246, 0.05) 100%);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wmp-metric:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
        }

        .wmp-metric-label {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .wmp-metric-value {
          font-size: 36px;
          font-weight: 800;
          color: #F1F5F9;
          font-family: 'SF Mono', monospace;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .wmp-metric-value.good {
          background: linear-gradient(135deg, #10B981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wmp-metric-value.warning {
          background: linear-gradient(135deg, #F59E0B, #D97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wmp-metric-value.error {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wmp-metric-change {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .wmp-metric-change.positive {
          color: #10B981;
        }

        .wmp-metric-change.negative {
          color: #EF4444;
        }

        /* Command Palette - Raycast inspired */
        .wmp-command-palette {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000000;
          display: none;
          align-items: flex-start;
          justify-content: center;
          padding-top: 120px;
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .wmp-command-palette.open {
          display: flex;
        }

        .wmp-command-box {
          width: 600px;
          max-height: 500px;
          background: linear-gradient(135deg,
            rgba(15, 20, 35, 0.98) 0%,
            rgba(20, 25, 45, 0.98) 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.04),
            0 24px 64px rgba(0, 0, 0, 0.6),
            0 0 100px rgba(99, 102, 241, 0.2);
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .wmp-command-input {
          width: 100%;
          padding: 20px 24px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #F1F5F9;
          font-size: 18px;
          font-weight: 500;
          font-family: inherit;
          outline: none;
        }

        .wmp-command-input::placeholder {
          color: #64748B;
        }

        .wmp-command-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 8px;
        }

        .wmp-command-item {
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wmp-command-item:hover,
        .wmp-command-item.selected {
          background: rgba(99, 102, 241, 0.15);
        }

        .wmp-command-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          background: rgba(99, 102, 241, 0.1);
        }

        .wmp-command-info {
          flex: 1;
        }

        .wmp-command-name {
          font-size: 14px;
          font-weight: 600;
          color: #F1F5F9;
          margin-bottom: 2px;
        }

        .wmp-command-desc {
          font-size: 12px;
          color: #94A3B8;
        }

        .wmp-command-shortcut {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          font-family: 'SF Mono', monospace;
        }

        /* Premium FPS Counter */
        .wmp-fps-overlay {
          position: fixed;
          top: 24px;
          right: 24px;
          background: linear-gradient(135deg,
            rgba(15, 20, 35, 0.95) 0%,
            rgba(20, 25, 45, 0.95) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px 20px;
          z-index: 999998;
          font-family: 'SF Mono', monospace;
          min-width: 140px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .wmp-fps-value {
          font-size: 40px;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .wmp-fps-value.good {
          background: linear-gradient(135deg, #10B981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .wmp-fps-value.ok {
          background: linear-gradient(135deg, #F59E0B, #D97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .wmp-fps-value.bad {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wmp-fps-label {
          font-size: 11px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .wmp-fps-graph {
          height: 48px;
          margin-top: 12px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          background: rgba(0, 0, 0, 0.2);
          padding: 4px;
          border-radius: 6px;
        }

        .wmp-fps-bar {
          flex: 1;
          background: linear-gradient(180deg, #6366F1, #8B5CF6);
          min-width: 3px;
          border-radius: 2px;
          transition: height 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Premium Toast */
        .wmp-toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: linear-gradient(135deg,
            rgba(15, 20, 35, 0.98) 0%,
            rgba(20, 25, 45, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 16px 20px;
          min-width: 320px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 100px rgba(99, 102, 241, 0.2);
          z-index: 10000000;
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .wmp-toast-title {
          font-size: 14px;
          font-weight: 700;
          color: #F1F5F9;
          margin-bottom: 4px;
        }

        .wmp-toast-message {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.5;
        }

        /* Minimized Icon */
        .wmp-minimized-icon {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          border-radius: 50%;
          color: white;
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          50% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
        }

        .wmp-container.minimized .wmp-minimized-icon { display: flex; }
        .wmp-container.minimized .wmp-header,
        .wmp-container.minimized .wmp-tabs,
        .wmp-container.minimized .wmp-content { display: none; }

        /* Premium Charts */
        .wmp-chart {
          margin-top: 20px;
        }

        .wmp-chart-bar {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .wmp-chart-label {
          width: 140px;
          font-size: 13px;
          color: #94A3B8;
          font-weight: 600;
        }

        .wmp-chart-track {
          flex: 1;
          height: 10px;
          background: rgba(99, 102, 241, 0.08);
          border-radius: 6px;
          overflow: hidden;
          margin: 0 16px;
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .wmp-chart-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);
          border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }

        .wmp-chart-value {
          width: 90px;
          text-align: right;
          font-size: 13px;
          font-weight: 700;
          color: #F1F5F9;
          font-family: 'SF Mono', monospace;
        }

        /* Performance Score Ring */
        .wmp-score-ring {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 20px;
        }

        .wmp-score-circle {
          transform: rotate(-90deg);
        }

        .wmp-score-bg {
          fill: none;
          stroke: rgba(99, 102, 241, 0.08);
          stroke-width: 10;
        }

        .wmp-score-progress {
          fill: none;
          stroke: url(#scoreGradient);
          stroke-width: 10;
          stroke-linecap: round;
          transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
        }

        .wmp-score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 44px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'SF Mono', monospace;
        }

        /* Recommendations */
        .wmp-recommendation {
          background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.08) 0%,
            rgba(139, 92, 246, 0.08) 100%);
          border-left: 3px solid #6366F1;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 12px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wmp-recommendation:hover {
          background: linear-gradient(135deg,
            rgba(99, 102, 241, 0.12) 0%,
            rgba(139, 92, 246, 0.12) 100%);
          transform: translateX(4px);
        }

        .wmp-recommendation-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .wmp-recommendation-title {
          font-size: 14px;
          font-weight: 700;
          color: #F1F5F9;
          margin-bottom: 6px;
        }

        .wmp-recommendation-desc {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .wmp-recommendation-priority {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wmp-recommendation-priority.high {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .wmp-recommendation-priority.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .wmp-recommendation-priority.low {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .wmp-recommendation-action {
          font-size: 12px;
          font-weight: 600;
          color: #6366F1;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .wmp-recommendation-action:hover {
          color: #8B5CF6;
        }

        /* Empty States */
        .wmp-empty {
          text-align: center;
          padding: 80px 24px;
        }

        .wmp-empty-icon {
          font-size: 72px;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .wmp-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #94A3B8;
          margin-bottom: 12px;
        }

        .wmp-empty-text {
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
        }

        /* Loading States */
        .wmp-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
        }

        .wmp-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366F1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Utility Classes */
        .wmp-flex { display: flex; }
        .wmp-items-center { align-items: center; }
        .wmp-justify-between { justify-content: space-between; }
        .wmp-gap-2 { gap: 8px; }
        .wmp-gap-3 { gap: 12px; }
        .wmp-mb-4 { margin-bottom: 16px; }
        .wmp-mt-4 { margin-top: 16px; }
      `;
      this.shadow.appendChild(style);
    }

    // Due to file size, I'll create this in parts. Let me create the main UI and essential methods first.

    createPremiumUI() {
      const container = document.createElement('div');
      container.className = 'wmp-container';
      container.innerHTML = `
        <div class="wmp-minimized-icon">✨</div>
        <div class="wmp-header">
          <div class="wmp-flex wmp-items-center">
            <div class="wmp-logo">W</div>
            <div class="wmp-title">Webflow Monitor</div>
            <div class="wmp-badge">PREMIUM</div>
            <div class="wmp-env-badge ${this.config.environment}">${this.config.environment}</div>
          </div>
          <div class="wmp-flex wmp-gap-2">
            <button class="wmp-btn wmp-btn-primary wmp-export-btn">Export Report</button>
            <button class="wmp-btn wmp-btn-icon wmp-command-btn" title="Command Palette (⌘K)">⌘</button>
            <button class="wmp-btn wmp-btn-icon wmp-snapshot-btn" title="Take Snapshot">📸</button>
            <button class="wmp-btn wmp-btn-icon wmp-minimize-btn">−</button>
            <button class="wmp-btn wmp-btn-icon wmp-expand-btn">⛶</button>
            <button class="wmp-btn wmp-btn-icon wmp-close-btn">×</button>
          </div>
        </div>
        <div class="wmp-tabs">
          <button class="wmp-tab active" data-tab="overview">Overview</button>
          <button class="wmp-tab" data-tab="performance">Performance</button>
          <button class="wmp-tab" data-tab="recommendations">Recommendations <span class="wmp-tab-badge info">0</span></button>
          <button class="wmp-tab" data-tab="comparison">Comparison</button>
          <button class="wmp-tab" data-tab="errors">Errors <span class="wmp-tab-badge">0</span></button>
          <button class="wmp-tab" data-tab="accessibility">Accessibility</button>
          <button class="wmp-tab" data-tab="seo">SEO</button>
          <button class="wmp-tab" data-tab="network">Network</button>
        </div>
        <div class="wmp-content">
          <div class="wmp-loading">
            <div class="wmp-spinner"></div>
          </div>
        </div>
      `;

      this.shadow.appendChild(container);
      this.containerElement = container;

      // Create FPS overlay
      if (this.config.showFPS) {
        const fpsOverlay = document.createElement('div');
        fpsOverlay.className = 'wmp-fps-overlay';
        fpsOverlay.innerHTML = `
          <div class="wmp-fps-value good">60</div>
          <div class="wmp-fps-label">FPS</div>
          <div class="wmp-fps-graph"></div>
        `;
        this.shadow.appendChild(fpsOverlay);
        this.fpsOverlay = fpsOverlay;
      }

      // Create command palette
      if (this.config.enableCommandPalette) {
        const commandPalette = document.createElement('div');
        commandPalette.className = 'wmp-command-palette';
        commandPalette.innerHTML = `
          <div class="wmp-command-box">
            <input type="text" class="wmp-command-input" placeholder="Type a command or search..." />
            <div class="wmp-command-list"></div>
          </div>
        `;
        this.shadow.appendChild(commandPalette);
        this.commandPaletteElement = commandPalette;
      }
    }

    // Continuing in next message due to size...
    // Will add: setupEventListeners, setupCommandPalette, render methods, monitoring methods, etc.

  }

  // Initialize
  new WebflowMonitorPremium();
})();
