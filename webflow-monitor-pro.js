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
      document.body.appendChild(this.container);
    }

    /**
     * Inject enhanced styles with FPS counter
     */
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Main Container - Enhanced */
        .wm-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 700px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wm-container.minimized {
          width: 60px;
          height: 60px;
          top: auto;
          left: auto;
          bottom: 20px;
          right: 20px;
          transform: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .wm-container.expanded {
          width: 95vw;
          height: 95vh;
        }

        /* FPS Counter Overlay */
        .wm-fps-overlay {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          z-index: 999998;
          font-family: 'JetBrains Mono', monospace;
          min-width: 120px;
        }

        .wm-fps-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }

        .wm-fps-value.good { color: #10B981; }
        .wm-fps-value.ok { color: #F59E0B; }
        .wm-fps-value.bad { color: #EF4444; }

        .wm-fps-label {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wm-fps-graph {
          height: 40px;
          margin-top: 8px;
          display: flex;
          align-items: flex-end;
          gap: 1px;
        }

        .wm-fps-bar {
          flex: 1;
          background: rgba(99, 102, 241, 0.5);
          min-width: 2px;
          transition: height 0.1s ease;
        }

        /* Header */
        .wm-header {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: move;
          user-select: none;
        }

        .wm-logo {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 16px;
        }

        .wm-title {
          font-size: 16px;
          font-weight: 600;
          color: #F1F5F9;
          margin-left: 12px;
        }

        .wm-env-badge {
          padding: 4px 8px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 4px;
          font-size: 11px;
          color: #10B981;
          text-transform: uppercase;
          font-weight: 600;
          margin-left: 8px;
        }

        .wm-env-badge.production {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #EF4444;
        }

        .wm-env-badge.staging {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
          color: #F59E0B;
        }

        /* Tabs - Enhanced with more options */
        .wm-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.5);
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0 20px;
          gap: 4px;
          overflow-x: auto;
          flex-wrap: wrap;
        }

        .wm-tab {
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
        }

        .wm-tab:hover {
          color: #F1F5F9;
          background: rgba(255, 255, 255, 0.05);
        }

        .wm-tab.active {
          color: #6366F1;
          border-bottom-color: #6366F1;
        }

        .wm-tab-badge {
          display: inline-block;
          margin-left: 6px;
          padding: 2px 6px;
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .wm-tab-badge.warning { background: rgba(245, 158, 11, 0.2); color: #F59E0B; }
        .wm-tab-badge.info { background: rgba(59, 130, 246, 0.2); color: #3B82F6; }
        .wm-tab-badge.success { background: rgba(16, 185, 129, 0.2); color: #10B981; }

        /* Content */
        .wm-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .wm-content::-webkit-scrollbar { width: 8px; }
        .wm-content::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        .wm-content::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 4px; }

        /* Cards */
        .wm-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .wm-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px);
        }

        .wm-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #F1F5F9;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Grid Layout */
        .wm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .wm-metric {
          background: rgba(30, 41, 59, 0.4);
          padding: 16px;
          border-radius: 8px;
        }

        .wm-metric-label {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }

        .wm-metric-value {
          font-size: 28px;
          font-weight: 700;
          color: #F1F5F9;
          font-family: 'JetBrains Mono', monospace;
        }

        .wm-metric-value.good { color: #10B981; }
        .wm-metric-value.warning { color: #F59E0B; }
        .wm-metric-value.error { color: #EF4444; }

        /* Timeline visualization */
        .wm-timeline {
          position: relative;
          padding: 20px 0;
        }

        .wm-timeline-item {
          position: relative;
          padding-left: 30px;
          padding-bottom: 20px;
          border-left: 2px solid rgba(99, 102, 241, 0.3);
        }

        .wm-timeline-item:last-child {
          border-left-color: transparent;
        }

        .wm-timeline-dot {
          position: absolute;
          left: -6px;
          top: 0;
          width: 10px;
          height: 10px;
          background: #6366F1;
          border-radius: 50%;
        }

        .wm-timeline-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #64748B;
          margin-bottom: 4px;
        }

        .wm-timeline-content {
          font-size: 13px;
          color: #E2E8F0;
        }

        /* Console log styles */
        .wm-console {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          background: rgba(15, 23, 42, 0.8);
          border-radius: 8px;
          padding: 16px;
          max-height: 400px;
          overflow-y: auto;
        }

        .wm-console-entry {
          padding: 4px 0;
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
        }

        .wm-console-entry:last-child {
          border-bottom: none;
        }

        .wm-console-entry.error { color: #EF4444; }
        .wm-console-entry.warning { color: #F59E0B; }
        .wm-console-entry.info { color: #3B82F6; }
        .wm-console-entry.success { color: #10B981; }

        /* Buttons */
        .wm-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .wm-btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          color: white;
        }

        .wm-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .wm-btn-icon {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          color: #94A3B8;
        }

        .wm-btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F1F5F9;
        }

        /* Tables */
        .wm-table {
          width: 100%;
          border-collapse: collapse;
        }

        .wm-table th {
          text-align: left;
          padding: 10px;
          background: rgba(30, 41, 59, 0.6);
          color: #94A3B8;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wm-table td {
          padding: 10px;
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          color: #E2E8F0;
          font-size: 12px;
        }

        .wm-table tr:hover td {
          background: rgba(30, 41, 59, 0.4);
        }

        code {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(15, 23, 42, 0.6);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          color: #10B981;
        }

        /* Minimized state */
        .wm-minimized-icon {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          border-radius: 50%;
          color: white;
        }

        .wm-container.minimized .wm-minimized-icon { display: flex; }
        .wm-container.minimized .wm-header,
        .wm-container.minimized .wm-tabs,
        .wm-container.minimized .wm-content { display: none; }

        /* Utility classes */
        .wm-mb-2 { margin-bottom: 8px; }
        .wm-mb-4 { margin-bottom: 16px; }
        .wm-flex { display: flex; }
        .wm-items-center { align-items: center; }
        .wm-justify-between { justify-content: space-between; }
        .wm-gap-2 { gap: 8px; }
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
        <div class="wm-minimized-icon">🔍</div>
        <div class="wm-header">
          <div class="wm-flex wm-items-center">
            <div class="wm-logo">W</div>
            <div class="wm-title">Webflow Monitor Pro</div>
            <div class="wm-env-badge ${this.config.environment}">${this.config.environment}</div>
          </div>
          <div class="wm-flex wm-gap-2">
            <button class="wm-btn wm-btn-primary wm-export-btn">Export Report</button>
            <button class="wm-btn wm-btn-icon wm-minimize-btn">−</button>
            <button class="wm-btn wm-btn-icon wm-expand-btn">⛶</button>
            <button class="wm-btn wm-btn-icon wm-close-btn">×</button>
          </div>
        </div>
        <div class="wm-tabs">
          <button class="wm-tab active" data-tab="overview">Overview</button>
          <button class="wm-tab" data-tab="performance">Performance</button>
          <button class="wm-tab" data-tab="gsap">GSAP <span class="wm-tab-badge info">0</span></button>
          <button class="wm-tab" data-tab="videos">Videos <span class="wm-tab-badge info">0</span></button>
          <button class="wm-tab" data-tab="errors">Errors <span class="wm-tab-badge">0</span></button>
          <button class="wm-tab" data-tab="dom">DOM</button>
          <button class="wm-tab" data-tab="clicks">Clicks</button>
          <button class="wm-tab" data-tab="scroll">Scroll</button>
          <button class="wm-tab" data-tab="memory">Memory</button>
          <button class="wm-tab" data-tab="scripts">Scripts</button>
          <button class="wm-tab" data-tab="network">Network</button>
          <button class="wm-tab" data-tab="pagespeed">PageSpeed 🚀</button>
          <button class="wm-tab" data-tab="console">Console</button>
        </div>
        <div class="wm-content">
          <div class="wm-loading">Loading...</div>
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
      // Tab switching
      this.shadow.querySelectorAll('.wm-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.switchTab(tab.dataset.tab);
        });
      });

      // Minimize/Expand/Close
      this.shadow.querySelector('.wm-minimize-btn').addEventListener('click', () => this.toggleMinimize());
      this.shadow.querySelector('.wm-expand-btn').addEventListener('click', () => this.toggleExpand());
      this.shadow.querySelector('.wm-close-btn').addEventListener('click', () => this.close());
      this.shadow.querySelector('.wm-export-btn').addEventListener('click', () => this.exportReport());

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggleMinimize();
        }
        // Additional shortcuts
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
          e.preventDefault();
          if (this.fpsOverlay) {
            this.fpsOverlay.style.display = this.fpsOverlay.style.display === 'none' ? 'block' : 'none';
          }
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
      this.shadow.querySelectorAll('.wm-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
      });
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
        gsap: this.data.gsap.timelines.length + this.data.gsap.scrollTriggers.length,
        videos: this.data.videos.length,
        errors: this.data.errors.length
      };

      Object.entries(badges).forEach(([tab, count]) => {
        const tabElement = this.shadow.querySelector(`[data-tab="${tab}"] .wm-tab-badge`);
        if (tabElement) {
          tabElement.textContent = count;
          tabElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
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
              <div style="margin-bottom: 16px;">Fetching performance data from Google...</div>
              <div style="color: #94A3B8;">This may take 10-30 seconds</div>
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

      const url = encodeURIComponent(window.location.href);
      const apiKey = 'AIzaSyBNRu1o8lSmSYBH8vPsLXGhMSL0TQXZQ-8'; // Public PageSpeed API key

      try {
        console.log('%c⏳ Fetching PageSpeed Insights...', 'color: #6366F1; font-weight: bold;');

        // Fetch both mobile and desktop data
        const [mobileResponse, desktopResponse] = await Promise.all([
          fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&key=${apiKey}`),
          fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=desktop&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&key=${apiKey}`)
        ]);

        const mobileData = await mobileResponse.json();
        const desktopData = await desktopResponse.json();

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
        this.data.pageSpeed.error = error.message;
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
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        environment: this.config.environment,
        data: this.data,
        performanceScore: this.calculatePerformanceScore()
      };

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webflow-monitor-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log('%c✅ Report exported successfully', 'color: #10B981; font-weight: bold');
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
  }

  // Initialize
  new WebflowMonitorPro();
})();
