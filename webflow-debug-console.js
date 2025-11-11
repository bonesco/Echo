/**
 * Webflow Debug Console
 * A sophisticated, production-ready debugging tool for Webflow websites
 *
 * Features:
 * - Modern glassmorphic UI inspired by Linear and Raycast
 * - Comprehensive Webflow-specific debugging
 * - Performance monitoring with visual metrics
 * - Accessibility and SEO auditing
 * - Network monitoring and error tracking
 * - Export functionality for reports
 *
 * @version 1.0.0
 * @author Webflow Debug Console
 */

(function() {
  'use strict';

  // Prevent multiple instances
  if (window.__WEBFLOW_DEBUG_CONSOLE__) {
    console.log('Webflow Debug Console already active');
    return;
  }
  window.__WEBFLOW_DEBUG_CONSOLE__ = true;

  class WebflowDebugConsole {
    constructor() {
      this.data = {
        webflow: {},
        performance: {},
        errors: [],
        accessibility: [],
        seo: [],
        network: [],
        cssIssues: []
      };

      this.observers = [];
      this.isMinimized = false;
      this.isExpanded = false;
      this.activeTab = 'overview';
      this.consoleErrors = [];
      this.searchTerm = '';

      this.init();
    }

    /**
     * Initialize the debug console
     */
    init() {
      this.createShadowDOM();
      this.injectStyles();
      this.createUI();
      this.setupEventListeners();
      this.runAllAudits();
      this.startMonitoring();
      this.interceptConsole();
    }

    /**
     * Create Shadow DOM to isolate styles
     */
    createShadowDOM() {
      this.container = document.createElement('div');
      this.container.id = 'webflow-debug-console-host';
      this.shadow = this.container.attachShadow({ mode: 'open' });
      document.body.appendChild(this.container);
    }

    /**
     * Inject glassmorphic styles
     */
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Main Container */
        .wdc-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wdc-container.minimized {
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

        .wdc-container.minimized .wdc-header,
        .wdc-container.minimized .wdc-tabs,
        .wdc-container.minimized .wdc-content {
          display: none;
        }

        .wdc-container.expanded {
          width: 95vw;
          height: 95vh;
        }

        /* Header */
        .wdc-header {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: move;
          user-select: none;
        }

        .wdc-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wdc-logo {
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

        .wdc-title {
          font-size: 16px;
          font-weight: 600;
          color: #F1F5F9;
          letter-spacing: -0.02em;
        }

        .wdc-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 20px;
          font-size: 12px;
          color: #10B981;
          font-weight: 500;
        }

        .wdc-status-dot {
          width: 6px;
          height: 6px;
          background: #10B981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .wdc-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wdc-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Inter', sans-serif;
        }

        .wdc-btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .wdc-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        .wdc-btn-icon {
          width: 32px;
          height: 32px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          color: #94A3B8;
          border-radius: 6px;
        }

        .wdc-btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F1F5F9;
        }

        /* Tabs */
        .wdc-tabs {
          display: flex;
          background: rgba(15, 23, 42, 0.5);
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0 20px;
          gap: 4px;
          overflow-x: auto;
        }

        .wdc-tab {
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
        }

        .wdc-tab:hover {
          color: #F1F5F9;
          background: rgba(255, 255, 255, 0.05);
        }

        .wdc-tab.active {
          color: #6366F1;
          border-bottom-color: #6366F1;
        }

        .wdc-tab-badge {
          display: inline-block;
          margin-left: 6px;
          padding: 2px 6px;
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .wdc-tab-badge.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }

        .wdc-tab-badge.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        /* Content */
        .wdc-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .wdc-content::-webkit-scrollbar {
          width: 8px;
        }

        .wdc-content::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        .wdc-content::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }

        .wdc-content::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        /* Overview Grid */
        .wdc-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .wdc-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wdc-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .wdc-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .wdc-card-title {
          font-size: 13px;
          font-weight: 500;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wdc-card-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .wdc-card-value {
          font-size: 36px;
          font-weight: 700;
          color: #F1F5F9;
          margin-bottom: 8px;
          line-height: 1;
        }

        .wdc-card-label {
          font-size: 13px;
          color: #64748B;
        }

        .wdc-card-gradient {
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Performance Score Ring */
        .wdc-score-ring {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 16px;
        }

        .wdc-score-circle {
          transform: rotate(-90deg);
        }

        .wdc-score-bg {
          fill: none;
          stroke: rgba(99, 102, 241, 0.1);
          stroke-width: 8;
        }

        .wdc-score-progress {
          fill: none;
          stroke: url(#scoreGradient);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wdc-score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 32px;
          font-weight: 700;
          color: #F1F5F9;
        }

        /* Issue List */
        .wdc-issue-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wdc-issue {
          background: rgba(30, 41, 59, 0.4);
          border-left: 3px solid #EF4444;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .wdc-issue:hover {
          background: rgba(30, 41, 59, 0.6);
          transform: translateX(4px);
        }

        .wdc-issue.warning {
          border-left-color: #F59E0B;
        }

        .wdc-issue.info {
          border-left-color: #3B82F6;
        }

        .wdc-issue-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .wdc-issue-title {
          font-size: 14px;
          font-weight: 600;
          color: #F1F5F9;
          flex: 1;
        }

        .wdc-issue-severity {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .wdc-issue-severity.error {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }

        .wdc-issue-severity.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }

        .wdc-issue-severity.info {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }

        .wdc-issue-description {
          font-size: 13px;
          color: #94A3B8;
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .wdc-issue-location {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #64748B;
          background: rgba(15, 23, 42, 0.6);
          padding: 8px;
          border-radius: 4px;
          display: none;
        }

        .wdc-issue.expanded .wdc-issue-location {
          display: block;
        }

        /* Data Table */
        .wdc-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .wdc-table th {
          text-align: left;
          padding: 12px;
          background: rgba(30, 41, 59, 0.6);
          color: #94A3B8;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
        }

        .wdc-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          color: #E2E8F0;
          font-size: 13px;
        }

        .wdc-table tr:hover td {
          background: rgba(30, 41, 59, 0.4);
        }

        .wdc-table code {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(15, 23, 42, 0.6);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          color: #10B981;
        }

        /* Search */
        .wdc-search {
          width: 100%;
          padding: 12px 16px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          color: #F1F5F9;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          margin-bottom: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wdc-search:focus {
          outline: none;
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .wdc-search::placeholder {
          color: #64748B;
        }

        /* Empty State */
        .wdc-empty {
          text-align: center;
          padding: 60px 20px;
        }

        .wdc-empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .wdc-empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #94A3B8;
          margin-bottom: 8px;
        }

        .wdc-empty-text {
          font-size: 14px;
          color: #64748B;
        }

        /* Loading State */
        .wdc-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .wdc-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366F1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Toast Notifications */
        .wdc-toast {
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          padding: 16px;
          min-width: 300px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000000;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .wdc-toast-title {
          font-size: 14px;
          font-weight: 600;
          color: #F1F5F9;
          margin-bottom: 4px;
        }

        .wdc-toast-message {
          font-size: 13px;
          color: #94A3B8;
        }

        /* Minimized State Icon */
        .wdc-minimized-icon {
          width: 100%;
          height: 100%;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
          border-radius: 50%;
          color: white;
        }

        .wdc-container.minimized .wdc-minimized-icon {
          display: flex;
        }

        /* Performance Chart */
        .wdc-chart {
          margin-top: 16px;
        }

        .wdc-chart-bar {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .wdc-chart-label {
          width: 120px;
          font-size: 13px;
          color: #94A3B8;
        }

        .wdc-chart-track {
          flex: 1;
          height: 8px;
          background: rgba(30, 41, 59, 0.6);
          border-radius: 4px;
          overflow: hidden;
          margin: 0 12px;
        }

        .wdc-chart-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1 0%, #3B82F6 100%);
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wdc-chart-value {
          width: 80px;
          text-align: right;
          font-size: 13px;
          font-weight: 600;
          color: #F1F5F9;
        }

        /* Highlight Overlay */
        .wdc-highlight {
          position: absolute;
          pointer-events: none;
          background: rgba(99, 102, 241, 0.2);
          border: 2px solid #6366F1;
          z-index: 999998;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Utility Classes */
        .wdc-mt-4 { margin-top: 16px; }
        .wdc-mb-4 { margin-bottom: 16px; }
        .wdc-flex { display: flex; }
        .wdc-items-center { align-items: center; }
        .wdc-gap-2 { gap: 8px; }
        .wdc-text-error { color: #EF4444; }
        .wdc-text-warning { color: #F59E0B; }
        .wdc-text-success { color: #10B981; }
        .wdc-hidden { display: none; }
      `;
      this.shadow.appendChild(style);
    }

    /**
     * Create the main UI structure
     */
    createUI() {
      const container = document.createElement('div');
      container.className = 'wdc-container';
      container.innerHTML = `
        <div class="wdc-minimized-icon">🔍</div>
        <div class="wdc-header">
          <div class="wdc-header-left">
            <div class="wdc-logo">W</div>
            <div class="wdc-title">Webflow Debug Console</div>
            <div class="wdc-status">
              <div class="wdc-status-dot"></div>
              <span>Active</span>
            </div>
          </div>
          <div class="wdc-header-right">
            <button class="wdc-btn wdc-btn-primary wdc-export-btn">Export Report</button>
            <button class="wdc-btn wdc-btn-icon wdc-minimize-btn">−</button>
            <button class="wdc-btn wdc-btn-icon wdc-expand-btn">⛶</button>
            <button class="wdc-btn wdc-btn-icon wdc-close-btn">×</button>
          </div>
        </div>
        <div class="wdc-tabs">
          <button class="wdc-tab active" data-tab="overview">Overview</button>
          <button class="wdc-tab" data-tab="performance">Performance</button>
          <button class="wdc-tab" data-tab="errors">Errors <span class="wdc-tab-badge">0</span></button>
          <button class="wdc-tab" data-tab="accessibility">Accessibility <span class="wdc-tab-badge warning">0</span></button>
          <button class="wdc-tab" data-tab="seo">SEO <span class="wdc-tab-badge warning">0</span></button>
          <button class="wdc-tab" data-tab="network">Network</button>
          <button class="wdc-tab" data-tab="webflow">Webflow Config</button>
        </div>
        <div class="wdc-content">
          <div class="wdc-loading">
            <div class="wdc-spinner"></div>
          </div>
        </div>
      `;

      this.shadow.appendChild(container);
      this.containerElement = container;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const shadow = this.shadow;

      // Tab switching
      shadow.querySelectorAll('.wdc-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.switchTab(e.target.dataset.tab);
        });
      });

      // Minimize button
      shadow.querySelector('.wdc-minimize-btn').addEventListener('click', () => {
        this.toggleMinimize();
      });

      // Expand button
      shadow.querySelector('.wdc-expand-btn').addEventListener('click', () => {
        this.toggleExpand();
      });

      // Close button
      shadow.querySelector('.wdc-close-btn').addEventListener('click', () => {
        this.close();
      });

      // Export button
      shadow.querySelector('.wdc-export-btn').addEventListener('click', () => {
        this.exportReport();
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.toggleMinimize();
        }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'E') {
          e.preventDefault();
          this.exportReport();
        }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'R') {
          e.preventDefault();
          this.runAllAudits();
          this.showToast('Refreshed', 'All audits have been refreshed');
        }
      });

      // Dragging
      this.setupDragging();

      // Click on minimized state
      this.containerElement.addEventListener('click', (e) => {
        if (this.isMinimized && e.target.closest('.wdc-minimized-icon')) {
          this.toggleMinimize();
        }
      });
    }

    /**
     * Setup dragging functionality
     */
    setupDragging() {
      const header = this.shadow.querySelector('.wdc-header');
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

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    /**
     * Toggle minimize state
     */
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      this.containerElement.classList.toggle('minimized', this.isMinimized);
    }

    /**
     * Toggle expand state
     */
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.containerElement.classList.toggle('expanded', this.isExpanded);
    }

    /**
     * Close the console
     */
    close() {
      this.observers.forEach(observer => observer.disconnect());
      this.container.remove();
      window.__WEBFLOW_DEBUG_CONSOLE__ = false;
    }

    /**
     * Switch active tab
     */
    switchTab(tabName) {
      this.activeTab = tabName;

      // Update tab buttons
      this.shadow.querySelectorAll('.wdc-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
      });

      // Render tab content
      this.renderTabContent(tabName);
    }

    /**
     * Render content for active tab
     */
    renderTabContent(tabName) {
      const content = this.shadow.querySelector('.wdc-content');

      switch(tabName) {
        case 'overview':
          content.innerHTML = this.renderOverview();
          break;
        case 'performance':
          content.innerHTML = this.renderPerformance();
          break;
        case 'errors':
          content.innerHTML = this.renderErrors();
          break;
        case 'accessibility':
          content.innerHTML = this.renderAccessibility();
          break;
        case 'seo':
          content.innerHTML = this.renderSEO();
          break;
        case 'network':
          content.innerHTML = this.renderNetwork();
          break;
        case 'webflow':
          content.innerHTML = this.renderWebflow();
          break;
      }

      // Setup click handlers for issues
      this.setupIssueHandlers();
    }

    /**
     * Render overview tab
     */
    renderOverview() {
      const totalIssues = this.data.errors.length + this.data.accessibility.length + this.data.seo.length;
      const criticalIssues = this.data.errors.filter(e => e.severity === 'error').length;
      const performanceScore = this.calculatePerformanceScore();

      return `
        <div class="wdc-overview-grid">
          <div class="wdc-card">
            <div class="wdc-card-header">
              <span class="wdc-card-title">Total Issues</span>
              <span class="wdc-card-icon">⚠️</span>
            </div>
            <div class="wdc-card-value ${totalIssues > 0 ? 'wdc-text-error' : 'wdc-text-success'}">${totalIssues}</div>
            <div class="wdc-card-label">${criticalIssues} critical</div>
          </div>

          <div class="wdc-card">
            <div class="wdc-card-header">
              <span class="wdc-card-title">Performance Score</span>
              <span class="wdc-card-icon">⚡</span>
            </div>
            <div class="wdc-card-value wdc-card-gradient">${performanceScore}</div>
            <div class="wdc-card-label">out of 100</div>
          </div>

          <div class="wdc-card">
            <div class="wdc-card-header">
              <span class="wdc-card-title">Page Load Time</span>
              <span class="wdc-card-icon">⏱️</span>
            </div>
            <div class="wdc-card-value">${this.data.performance.pageLoadTime || 0}<span style="font-size: 18px;">ms</span></div>
            <div class="wdc-card-label">Time to interactive</div>
          </div>

          <div class="wdc-card">
            <div class="wdc-card-header">
              <span class="wdc-card-title">Resources</span>
              <span class="wdc-card-icon">📦</span>
            </div>
            <div class="wdc-card-value">${this.data.network.length}</div>
            <div class="wdc-card-label">HTTP requests</div>
          </div>
        </div>

        <div class="wdc-card">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Performance Score Breakdown</span>
          </div>
          <div class="wdc-score-ring">
            <svg class="wdc-score-circle" width="120" height="120">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366F1" />
                  <stop offset="100%" style="stop-color:#3B82F6" />
                </linearGradient>
              </defs>
              <circle class="wdc-score-bg" cx="60" cy="60" r="52" />
              <circle class="wdc-score-progress" cx="60" cy="60" r="52"
                stroke-dasharray="${2 * Math.PI * 52}"
                stroke-dashoffset="${2 * Math.PI * 52 * (1 - performanceScore / 100)}" />
            </svg>
            <div class="wdc-score-text">${performanceScore}</div>
          </div>
          <div class="wdc-chart">
            ${this.renderPerformanceMetricBar('LCP', this.data.performance.lcp, 2500)}
            ${this.renderPerformanceMetricBar('FID', this.data.performance.fid, 100)}
            ${this.renderPerformanceMetricBar('CLS', this.data.performance.cls, 0.1, true)}
          </div>
        </div>

        ${totalIssues > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Recent Issues</span>
          </div>
          <div class="wdc-issue-list">
            ${this.renderTopIssues(5)}
          </div>
        </div>
        ` : `
        <div class="wdc-empty wdc-mt-4">
          <div class="wdc-empty-icon">✅</div>
          <div class="wdc-empty-title">No Issues Found</div>
          <div class="wdc-empty-text">Your site is looking great!</div>
        </div>
        `}
      `;
    }

    /**
     * Render performance metric bar
     */
    renderPerformanceMetricBar(label, value, threshold, isScore = false) {
      value = value || 0;
      const percentage = isScore ? (1 - value / threshold) * 100 : Math.min((value / threshold) * 100, 100);
      const displayValue = isScore ? value.toFixed(3) : Math.round(value) + 'ms';

      return `
        <div class="wdc-chart-bar">
          <div class="wdc-chart-label">${label}</div>
          <div class="wdc-chart-track">
            <div class="wdc-chart-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="wdc-chart-value">${displayValue}</div>
        </div>
      `;
    }

    /**
     * Render top issues
     */
    renderTopIssues(limit) {
      const allIssues = [
        ...this.data.errors.map(e => ({...e, type: 'error'})),
        ...this.data.accessibility.map(e => ({...e, type: 'accessibility'})),
        ...this.data.seo.map(e => ({...e, type: 'seo'}))
      ];

      return allIssues.slice(0, limit).map(issue => this.renderIssue(issue)).join('');
    }

    /**
     * Render single issue
     */
    renderIssue(issue) {
      return `
        <div class="wdc-issue ${issue.severity}" data-element="${issue.selector || ''}">
          <div class="wdc-issue-header">
            <div class="wdc-issue-title">${issue.title || issue.message}</div>
            <div class="wdc-issue-severity ${issue.severity}">${issue.severity}</div>
          </div>
          ${issue.description ? `<div class="wdc-issue-description">${issue.description}</div>` : ''}
          ${issue.selector ? `<div class="wdc-issue-location">${issue.selector}</div>` : ''}
          ${issue.stack ? `<div class="wdc-issue-location">${this.escapeHtml(issue.stack)}</div>` : ''}
        </div>
      `;
    }

    /**
     * Render performance tab
     */
    renderPerformance() {
      const perf = this.data.performance;

      return `
        <div class="wdc-card">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Core Web Vitals</span>
          </div>
          <div class="wdc-chart">
            ${this.renderPerformanceMetricBar('Largest Contentful Paint', perf.lcp, 2500)}
            ${this.renderPerformanceMetricBar('First Input Delay', perf.fid, 100)}
            ${this.renderPerformanceMetricBar('Cumulative Layout Shift', perf.cls, 0.1, true)}
            ${this.renderPerformanceMetricBar('Time to First Byte', perf.ttfb, 600)}
            ${this.renderPerformanceMetricBar('First Contentful Paint', perf.fcp, 1800)}
          </div>
        </div>

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Resource Breakdown</span>
          </div>
          <div class="wdc-chart">
            ${this.renderPerformanceMetricBar('JavaScript', perf.jsSize || 0, 1000000)}
            ${this.renderPerformanceMetricBar('CSS', perf.cssSize || 0, 500000)}
            ${this.renderPerformanceMetricBar('Images', perf.imageSize || 0, 2000000)}
            ${this.renderPerformanceMetricBar('Fonts', perf.fontSize || 0, 300000)}
          </div>
        </div>

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Detailed Metrics</span>
          </div>
          <table class="wdc-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DOM Content Loaded</td>
                <td><code>${perf.domContentLoaded || 0}ms</code></td>
                <td><span class="wdc-text-success">✓ Good</span></td>
              </tr>
              <tr>
                <td>Load Event</td>
                <td><code>${perf.loadEvent || 0}ms</code></td>
                <td><span class="wdc-text-success">✓ Good</span></td>
              </tr>
              <tr>
                <td>Total Page Size</td>
                <td><code>${this.formatBytes(perf.totalSize || 0)}</code></td>
                <td>${perf.totalSize > 3000000 ? '<span class="wdc-text-warning">⚠ Large</span>' : '<span class="wdc-text-success">✓ Good</span>'}</td>
              </tr>
              <tr>
                <td>HTTP Requests</td>
                <td><code>${this.data.network.length}</code></td>
                <td>${this.data.network.length > 100 ? '<span class="wdc-text-warning">⚠ Many</span>' : '<span class="wdc-text-success">✓ Good</span>'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    /**
     * Render errors tab
     */
    renderErrors() {
      if (this.data.errors.length === 0) {
        return `
          <div class="wdc-empty">
            <div class="wdc-empty-icon">✅</div>
            <div class="wdc-empty-title">No Errors Detected</div>
            <div class="wdc-empty-text">All JavaScript is running smoothly</div>
          </div>
        `;
      }

      return `
        <input type="text" class="wdc-search" placeholder="Search errors..." />
        <div class="wdc-issue-list">
          ${this.data.errors.map(error => this.renderIssue(error)).join('')}
        </div>
      `;
    }

    /**
     * Render accessibility tab
     */
    renderAccessibility() {
      if (this.data.accessibility.length === 0) {
        return `
          <div class="wdc-empty">
            <div class="wdc-empty-icon">♿</div>
            <div class="wdc-empty-title">No Accessibility Issues</div>
            <div class="wdc-empty-text">Your site is accessible</div>
          </div>
        `;
      }

      return `
        <input type="text" class="wdc-search" placeholder="Search accessibility issues..." />
        <div class="wdc-issue-list">
          ${this.data.accessibility.map(issue => this.renderIssue(issue)).join('')}
        </div>
      `;
    }

    /**
     * Render SEO tab
     */
    renderSEO() {
      if (this.data.seo.length === 0) {
        return `
          <div class="wdc-empty">
            <div class="wdc-empty-icon">🔍</div>
            <div class="wdc-empty-title">No SEO Issues</div>
            <div class="wdc-empty-text">Your SEO looks good</div>
          </div>
        `;
      }

      return `
        <input type="text" class="wdc-search" placeholder="Search SEO issues..." />
        <div class="wdc-issue-list">
          ${this.data.seo.map(issue => this.renderIssue(issue)).join('')}
        </div>
      `;
    }

    /**
     * Render network tab
     */
    renderNetwork() {
      const failedRequests = this.data.network.filter(r => r.status >= 400);
      const slowRequests = this.data.network.filter(r => r.duration > 3000);

      return `
        <div class="wdc-card">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Network Summary</span>
          </div>
          <div class="wdc-overview-grid">
            <div>
              <div class="wdc-card-value">${this.data.network.length}</div>
              <div class="wdc-card-label">Total Requests</div>
            </div>
            <div>
              <div class="wdc-card-value wdc-text-error">${failedRequests.length}</div>
              <div class="wdc-card-label">Failed Requests</div>
            </div>
            <div>
              <div class="wdc-card-value wdc-text-warning">${slowRequests.length}</div>
              <div class="wdc-card-label">Slow Requests (&gt;3s)</div>
            </div>
          </div>
        </div>

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">All Requests</span>
          </div>
          <input type="text" class="wdc-search" placeholder="Search requests..." />
          <table class="wdc-table">
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
                  <td><code>${this.truncate(req.name, 60)}</code></td>
                  <td>${req.type}</td>
                  <td>${this.formatBytes(req.size || 0)}</td>
                  <td>${Math.round(req.duration || 0)}ms</td>
                  <td><span class="${req.status >= 400 ? 'wdc-text-error' : 'wdc-text-success'}">${req.status || 'pending'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    /**
     * Render Webflow config tab
     */
    renderWebflow() {
      const wf = this.data.webflow;

      return `
        <div class="wdc-card">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Site Information</span>
          </div>
          <table class="wdc-table">
            <tbody>
              <tr>
                <td>Site ID</td>
                <td><code>${wf.siteId || 'Not detected'}</code></td>
              </tr>
              <tr>
                <td>Environment</td>
                <td><code>${wf.environment || 'Unknown'}</code></td>
              </tr>
              <tr>
                <td>Current Breakpoint</td>
                <td><code>${wf.breakpoint || 'desktop'}</code></td>
              </tr>
              <tr>
                <td>Webflow.js Version</td>
                <td><code>${wf.webflowVersion || 'Not found'}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        ${wf.libraries && wf.libraries.length > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">JavaScript Libraries</span>
          </div>
          <table class="wdc-table">
            <thead>
              <tr>
                <th>Library</th>
                <th>Version</th>
                <th>Global</th>
              </tr>
            </thead>
            <tbody>
              ${wf.libraries.map(lib => `
                <tr>
                  <td>${lib.name}</td>
                  <td><code>${lib.version}</code></td>
                  <td><code>${lib.global}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${wf.integrations && wf.integrations.length > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Third-Party Integrations</span>
          </div>
          <div class="wdc-overview-grid">
            ${wf.integrations.map(integration => `
              <div>
                <div class="wdc-card-value wdc-text-success">✓</div>
                <div class="wdc-card-label">${integration.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Interactions</span>
          </div>
          ${wf.interactions && wf.interactions.length > 0 ? `
            <table class="wdc-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Trigger</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                ${wf.interactions.map(interaction => `
                  <tr>
                    <td>${interaction.type}</td>
                    <td><code>${interaction.trigger}</code></td>
                    <td><code>${interaction.target}</code></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div class="wdc-empty-text">No interactions detected</div>
          `}
        </div>

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">CMS Collections</span>
          </div>
          ${wf.cmsCollections && wf.cmsCollections.length > 0 ? `
            <table class="wdc-table">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Items Count</th>
                </tr>
              </thead>
              <tbody>
                ${wf.cmsCollections.map(collection => `
                  <tr>
                    <td><code>${collection.name}</code></td>
                    <td>${collection.count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div class="wdc-empty-text">No CMS collections detected</div>
          `}
        </div>

        ${wf.cmsFields && wf.cmsFields.length > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">CMS Fields (${wf.cmsFields.length})</span>
          </div>
          <table class="wdc-table">
            <thead>
              <tr>
                <th>Binding</th>
                <th>Element</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${wf.cmsFields.slice(0, 10).map(field => `
                <tr>
                  <td><code>${field.binding}</code></td>
                  <td><code>${field.element}</code></td>
                  <td>${field.type}</td>
                </tr>
              `).join('')}
              ${wf.cmsFields.length > 10 ? `
                <tr>
                  <td colspan="3" style="text-align: center; color: #94A3B8; font-style: italic;">
                    ... and ${wf.cmsFields.length - 10} more fields
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${wf.forms && wf.forms.length > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Forms</span>
          </div>
          <table class="wdc-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Fields</th>
                <th>Required</th>
                <th>Redirect</th>
              </tr>
            </thead>
            <tbody>
              ${wf.forms.map(form => `
                <tr>
                  <td>${form.name}</td>
                  <td>${form.totalFields}</td>
                  <td>${form.requiredFields}</td>
                  <td>${form.hasRedirect ? `<code>${form.redirect || 'Yes'}</code>` : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${wf.ecommerce && wf.ecommerce.enabled ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">E-commerce</span>
          </div>
          <div class="wdc-overview-grid">
            <div>
              <div class="wdc-card-value wdc-text-success">✓</div>
              <div class="wdc-card-label">E-commerce Enabled</div>
            </div>
            <div>
              <div class="wdc-card-value">${wf.ecommerce.products}</div>
              <div class="wdc-card-label">Products</div>
            </div>
            <div>
              <div class="wdc-card-value ${wf.ecommerce.cartEnabled ? 'wdc-text-success' : 'wdc-text-error'}">${wf.ecommerce.cartEnabled ? '✓' : '✗'}</div>
              <div class="wdc-card-label">Cart</div>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Custom Code Blocks</span>
          </div>
          <div class="wdc-overview-grid">
            <div>
              <div class="wdc-card-value">${wf.customCodeBlocks?.head || 0}</div>
              <div class="wdc-card-label">In &lt;head&gt;</div>
            </div>
            <div>
              <div class="wdc-card-value">${wf.customCodeBlocks?.body || 0}</div>
              <div class="wdc-card-label">Before &lt;/body&gt;</div>
            </div>
            <div>
              <div class="wdc-card-value">${wf.customCodeBlocks?.embed || 0}</div>
              <div class="wdc-card-label">Embed Elements</div>
            </div>
          </div>
        </div>

        ${wf.customCodeAnalysis && wf.customCodeAnalysis.length > 0 ? `
        <div class="wdc-card wdc-mt-4">
          <div class="wdc-card-header">
            <span class="wdc-card-title">Custom Code Analysis</span>
          </div>
          <div class="wdc-issue-list">
            ${wf.customCodeAnalysis.map(issue => `
              <div class="wdc-issue ${issue.type}">
                <div class="wdc-issue-header">
                  <div class="wdc-issue-title">${issue.message}</div>
                  <div class="wdc-issue-severity ${issue.type}">${issue.type}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      `;
    }

    /**
     * Setup issue click handlers
     */
    setupIssueHandlers() {
      this.shadow.querySelectorAll('.wdc-issue').forEach(issue => {
        issue.addEventListener('click', () => {
          issue.classList.toggle('expanded');

          const selector = issue.dataset.element;
          if (selector) {
            this.highlightElement(selector);
          }
        });
      });

      // Setup search handlers
      const searchInput = this.shadow.querySelector('.wdc-search');
      if (searchInput) {
        searchInput.addEventListener('input', this.debounce((e) => {
          this.searchTerm = e.target.value.toLowerCase();
          this.filterContent();
        }, 300));
      }
    }

    /**
     * Filter content based on search term
     */
    filterContent() {
      const issues = this.shadow.querySelectorAll('.wdc-issue');
      const rows = this.shadow.querySelectorAll('.wdc-table tbody tr');

      issues.forEach(issue => {
        const text = issue.textContent.toLowerCase();
        issue.style.display = text.includes(this.searchTerm) ? '' : 'none';
      });

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(this.searchTerm) ? '' : 'none';
      });
    }

    /**
     * Highlight element on page
     */
    highlightElement(selector) {
      try {
        const element = document.querySelector(selector);
        if (!element) return;

        // Remove existing highlights
        document.querySelectorAll('.wdc-highlight').forEach(h => h.remove());

        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'wdc-highlight';
        highlight.style.cssText = `
          position: absolute;
          top: ${rect.top + window.scrollY}px;
          left: ${rect.left + window.scrollX}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          background: rgba(99, 102, 241, 0.2);
          border: 2px solid #6366F1;
          pointer-events: none;
          z-index: 999998;
        `;
        document.body.appendChild(highlight);

        // Scroll to element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove highlight after 3 seconds
        setTimeout(() => highlight.remove(), 3000);
      } catch (e) {
        console.error('Error highlighting element:', e);
      }
    }

    /**
     * Run all audits
     */
    async runAllAudits() {
      await Promise.all([
        this.auditWebflow(),
        this.auditPerformance(),
        this.auditAccessibility(),
        this.auditSEO(),
        this.auditCSS(),
        this.auditNetwork()
      ]);

      // Update UI
      this.updateBadges();
      this.renderTabContent(this.activeTab);
    }

    /**
     * Audit Webflow-specific features
     */
    async auditWebflow() {
      const webflow = {};

      // Detect Webflow
      webflow.isWebflow = !!window.Webflow;

      // Get site ID from meta tag
      const metaTag = document.querySelector('meta[name="webflow-site-id"]');
      webflow.siteId = metaTag ? metaTag.content : null;

      // Get environment
      webflow.environment = window.location.hostname.includes('webflow.io') ? 'staging' : 'production';

      // Get breakpoint
      webflow.breakpoint = this.getCurrentBreakpoint();

      // Get Webflow.js version
      if (window.Webflow) {
        webflow.webflowVersion = window.Webflow.version || 'Unknown';
      }

      // Detect interactions
      webflow.interactions = this.detectInteractions();

      // Detect CMS collections
      webflow.cmsCollections = this.detectCMSCollections();

      // Detect CMS fields
      webflow.cmsFields = this.detectCMSFields();

      // Detect Forms
      webflow.forms = this.detectForms();

      // Detect E-commerce
      webflow.ecommerce = this.detectEcommerce();

      // Detect third-party integrations
      webflow.integrations = this.detectThirdPartyIntegrations();

      // Detect libraries
      webflow.libraries = this.detectLibraries();

      // Count custom code blocks
      webflow.customCodeBlocks = {
        head: document.querySelectorAll('head script:not([src])').length,
        body: document.querySelectorAll('body > script:not([src])').length,
        embed: document.querySelectorAll('[data-w-type="Embed"]').length
      };

      // Analyze custom code
      webflow.customCodeAnalysis = this.analyzeCustomCode();

      this.data.webflow = webflow;
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width >= 992) return 'desktop';
      if (width >= 768) return 'tablet';
      if (width >= 480) return 'mobile-landscape';
      return 'mobile';
    }

    /**
     * Detect Webflow interactions
     */
    detectInteractions() {
      const interactions = [];

      // Look for interaction attributes
      document.querySelectorAll('[data-w-id]').forEach(el => {
        const interactionType = el.dataset.wId ? 'element-interaction' : 'unknown';
        interactions.push({
          type: interactionType,
          trigger: 'click', // This would need more detection logic
          target: el.tagName.toLowerCase()
        });
      });

      return interactions.slice(0, 10); // Limit to 10 for performance
    }

    /**
     * Detect CMS collections
     */
    detectCMSCollections() {
      const collections = [];

      // Look for CMS list elements
      document.querySelectorAll('[data-w-type="List"]').forEach(list => {
        const items = list.querySelectorAll('[role="listitem"]');
        collections.push({
          name: list.className || 'Collection',
          count: items.length
        });
      });

      return collections;
    }

    /**
     * Detect CMS fields (data-w-bind)
     */
    detectCMSFields() {
      const fields = [];
      const seen = new Set();

      document.querySelectorAll('[data-w-bind]').forEach(el => {
        const binding = el.getAttribute('data-w-bind');
        if (!seen.has(binding)) {
          seen.add(binding);
          fields.push({
            binding: binding,
            element: this.getSelector(el),
            type: el.tagName.toLowerCase()
          });
        }
      });

      return fields;
    }

    /**
     * Detect Webflow Forms
     */
    detectForms() {
      const forms = [];

      document.querySelectorAll('form[data-name]').forEach(form => {
        const formData = {
          name: form.getAttribute('data-name'),
          id: form.id,
          hasRedirect: form.hasAttribute('data-redirect'),
          redirect: form.getAttribute('data-redirect') || null,
          method: form.method || 'POST',
          requiredFields: form.querySelectorAll('[required]').length,
          totalFields: form.querySelectorAll('input, textarea, select').length
        };
        forms.push(formData);
      });

      return forms;
    }

    /**
     * Detect Webflow E-commerce
     */
    detectEcommerce() {
      const ecommerce = {
        enabled: false,
        products: 0,
        cartEnabled: false
      };

      // Check for e-commerce elements
      const ecommerceElements = document.querySelectorAll('[data-wf-cart-type], [data-wf-product-type]');
      if (ecommerceElements.length > 0) {
        ecommerce.enabled = true;
      }

      // Count products
      ecommerce.products = document.querySelectorAll('[data-wf-product-type="product"]').length;

      // Check for cart
      ecommerce.cartEnabled = document.querySelector('[data-wf-cart-type="cart"]') !== null;

      return ecommerce;
    }

    /**
     * Detect third-party integrations
     */
    detectThirdPartyIntegrations() {
      const integrations = [];

      // Google Analytics
      if (window.ga || window.gtag || window.dataLayer) {
        integrations.push({ name: 'Google Analytics', detected: true });
      }

      // Google Tag Manager
      if (window.google_tag_manager) {
        integrations.push({ name: 'Google Tag Manager', detected: true });
      }

      // Facebook Pixel
      if (window.fbq) {
        integrations.push({ name: 'Facebook Pixel', detected: true });
      }

      // Hotjar
      if (window.hj) {
        integrations.push({ name: 'Hotjar', detected: true });
      }

      // Intercom
      if (window.Intercom) {
        integrations.push({ name: 'Intercom', detected: true });
      }

      // Segment
      if (window.analytics) {
        integrations.push({ name: 'Segment', detected: true });
      }

      // Google Fonts
      if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
        integrations.push({ name: 'Google Fonts', detected: true });
      }

      // Adobe Fonts
      if (document.querySelector('link[href*="use.typekit.net"]') || document.querySelector('link[href*="typekit.com"]')) {
        integrations.push({ name: 'Adobe Fonts', detected: true });
      }

      return integrations;
    }

    /**
     * Detect JavaScript libraries
     */
    detectLibraries() {
      const libraries = [];

      // jQuery
      if (window.jQuery) {
        libraries.push({
          name: 'jQuery',
          version: window.jQuery.fn.jquery || 'Unknown',
          global: 'jQuery'
        });
      }

      // GSAP
      if (window.gsap) {
        libraries.push({
          name: 'GSAP',
          version: window.gsap.version || 'Unknown',
          global: 'gsap'
        });
      }

      // Swiper
      if (window.Swiper) {
        libraries.push({
          name: 'Swiper',
          version: window.Swiper.version || 'Unknown',
          global: 'Swiper'
        });
      }

      // Slick
      if (window.jQuery && window.jQuery.fn.slick) {
        libraries.push({
          name: 'Slick Slider',
          version: 'Unknown',
          global: '$.fn.slick'
        });
      }

      // Vimeo Player
      if (window.Vimeo) {
        libraries.push({
          name: 'Vimeo Player',
          version: 'Unknown',
          global: 'Vimeo'
        });
      }

      // YouTube API
      if (window.YT) {
        libraries.push({
          name: 'YouTube API',
          version: 'Unknown',
          global: 'YT'
        });
      }

      return libraries;
    }

    /**
     * Analyze custom code for issues
     */
    analyzeCustomCode() {
      const issues = [];

      // Check for document.write
      const scripts = Array.from(document.querySelectorAll('script:not([src])'));
      scripts.forEach(script => {
        if (script.textContent.includes('document.write')) {
          issues.push({
            type: 'warning',
            message: 'document.write() detected - can block page rendering'
          });
        }

        // Check for inline event handlers in script content
        if (script.textContent.match(/onclick\s*=|onload\s*=|onerror\s*=/i)) {
          issues.push({
            type: 'info',
            message: 'Inline event handlers detected in script'
          });
        }
      });

      // Check for inline event handlers in HTML
      const elementsWithInlineEvents = document.querySelectorAll('[onclick], [onload], [onerror], [onmouseover]');
      if (elementsWithInlineEvents.length > 0) {
        issues.push({
          type: 'warning',
          message: `${elementsWithInlineEvents.length} elements with inline event handlers (security risk)`
        });
      }

      // Check for global variable pollution
      const globalVars = Object.keys(window).filter(key => {
        return !key.startsWith('webkit') &&
               !key.startsWith('chrome') &&
               typeof window[key] !== 'function' &&
               !['Webflow', 'jQuery', '$', 'gsap', 'dataLayer'].includes(key);
      });

      if (globalVars.length > 50) {
        issues.push({
          type: 'info',
          message: `${globalVars.length} global variables detected - consider using modules`
        });
      }

      return issues;
    }

    /**
     * Audit performance metrics
     */
    async auditPerformance() {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      this.data.performance = {
        pageLoadTime: perf ? Math.round(perf.loadEventEnd - perf.fetchStart) : 0,
        domContentLoaded: perf ? Math.round(perf.domContentLoadedEventEnd - perf.fetchStart) : 0,
        loadEvent: perf ? Math.round(perf.loadEventEnd - perf.fetchStart) : 0,
        ttfb: perf ? Math.round(perf.responseStart - perf.requestStart) : 0,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        lcp: 0, // Will be updated by observer
        fid: 0, // Will be updated by observer
        cls: 0  // Will be updated by observer
      };

      // Calculate resource sizes
      const resources = performance.getEntriesByType('resource');
      this.data.performance.jsSize = resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.cssSize = resources.filter(r => r.name.includes('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.imageSize = resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.fontSize = resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0);
      this.data.performance.totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

      // Observe LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.data.performance.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          this.observers.push(lcpObserver);
        } catch (e) {
          console.warn('LCP observer failed:', e);
        }

        // Observe FID
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              this.data.performance.fid = Math.round(entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          this.observers.push(fidObserver);
        } catch (e) {
          console.warn('FID observer failed:', e);
        }

        // Observe CLS
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
        } catch (e) {
          console.warn('CLS observer failed:', e);
        }
      }
    }

    /**
     * Audit accessibility issues
     */
    auditAccessibility() {
      const issues = [];

      // Missing alt tags
      document.querySelectorAll('img:not([alt])').forEach(img => {
        issues.push({
          title: 'Image missing alt attribute',
          description: 'All images should have descriptive alt text for screen readers',
          severity: 'warning',
          selector: this.getSelector(img)
        });
      });

      // Empty alt tags on non-decorative images
      document.querySelectorAll('img[alt=""]').forEach(img => {
        if (!img.hasAttribute('role') || img.getAttribute('role') !== 'presentation') {
          issues.push({
            title: 'Image has empty alt attribute',
            description: 'Alt text should describe the image content',
            severity: 'warning',
            selector: this.getSelector(img)
          });
        }
      });

      // Alt text too long
      document.querySelectorAll('img[alt]').forEach(img => {
        const alt = img.getAttribute('alt');
        if (alt && alt.length > 125) {
          issues.push({
            title: 'Alt text too long',
            description: `Alt text is ${alt.length} characters. Keep it under 125 characters.`,
            severity: 'info',
            selector: this.getSelector(img)
          });
        }
      });

      // Missing form labels
      document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])').forEach(input => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel) {
          issues.push({
            title: 'Form input missing label',
            description: 'All form inputs should have associated labels',
            severity: 'error',
            selector: this.getSelector(input)
          });
        }
      });

      // Missing aria-label on buttons with only icons
      document.querySelectorAll('button, a[role="button"]').forEach(btn => {
        const text = btn.textContent.trim();
        const hasAriaLabel = btn.hasAttribute('aria-label') || btn.hasAttribute('aria-labelledby');

        if (!text && !hasAriaLabel) {
          issues.push({
            title: 'Button missing accessible label',
            description: 'Buttons should have text or aria-label',
            severity: 'error',
            selector: this.getSelector(btn)
          });
        }
      });

      // Check for heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const levels = headings.map(h => parseInt(h.tagName.substring(1)));

      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i-1] > 1) {
          issues.push({
            title: 'Skipped heading level',
            description: `Heading levels should not be skipped (found ${levels[i-1]} followed by ${levels[i]})`,
            severity: 'warning',
            selector: this.getSelector(headings[i])
          });
        }
      }

      // Missing landmarks
      const hasMain = document.querySelector('main') !== null;
      const hasNav = document.querySelector('nav') !== null;

      if (!hasMain) {
        issues.push({
          title: 'Missing main landmark',
          description: 'Page should have a <main> element for the main content',
          severity: 'warning'
        });
      }

      if (!hasNav) {
        issues.push({
          title: 'Missing nav landmark',
          description: 'Consider adding a <nav> element for navigation',
          severity: 'info'
        });
      }

      // Links without href or empty text
      document.querySelectorAll('a').forEach(link => {
        if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
          issues.push({
            title: 'Link without proper href',
            description: 'Links should have meaningful href attributes',
            severity: 'warning',
            selector: this.getSelector(link)
          });
        }

        if (!link.textContent.trim() && !link.hasAttribute('aria-label')) {
          issues.push({
            title: 'Link without text',
            description: 'Links should have text or aria-label',
            severity: 'error',
            selector: this.getSelector(link)
          });
        }
      });

      this.data.accessibility = issues;
    }

    /**
     * Audit SEO issues
     */
    auditSEO() {
      const issues = [];

      // Check meta title
      const title = document.querySelector('title');
      if (!title || !title.textContent.trim()) {
        issues.push({
          title: 'Missing page title',
          description: 'Every page should have a descriptive title tag',
          severity: 'error'
        });
      } else if (title.textContent.length < 30) {
        issues.push({
          title: 'Page title too short',
          description: `Title is ${title.textContent.length} characters. Aim for 30-60 characters.`,
          severity: 'info'
        });
      } else if (title.textContent.length > 60) {
        issues.push({
          title: 'Page title too long',
          description: `Title is ${title.textContent.length} characters. Keep it under 60 for best results.`,
          severity: 'warning'
        });
      }

      // Check meta description
      const description = document.querySelector('meta[name="description"]');
      if (!description || !description.content.trim()) {
        issues.push({
          title: 'Missing meta description',
          description: 'Add a meta description to improve search results',
          severity: 'warning'
        });
      } else if (description.content.length < 120) {
        issues.push({
          title: 'Meta description too short',
          description: `Description is ${description.content.length} characters. Aim for 120-160 characters.`,
          severity: 'info'
        });
      } else if (description.content.length > 160) {
        issues.push({
          title: 'Meta description too long',
          description: `Description is ${description.content.length} characters. Keep it under 160.`,
          severity: 'info'
        });
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        issues.push({
          title: 'Missing canonical URL',
          description: 'Add a canonical URL to prevent duplicate content issues',
          severity: 'info'
        });
      }

      // Check Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      if (!ogTitle) {
        issues.push({
          title: 'Missing Open Graph title',
          description: 'Add og:title for better social media sharing',
          severity: 'info'
        });
      }

      if (!ogDescription) {
        issues.push({
          title: 'Missing Open Graph description',
          description: 'Add og:description for better social media sharing',
          severity: 'info'
        });
      }

      if (!ogImage) {
        issues.push({
          title: 'Missing Open Graph image',
          description: 'Add og:image for better social media sharing',
          severity: 'info'
        });
      }

      // Check Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        issues.push({
          title: 'Missing Twitter Card',
          description: 'Add Twitter Card meta tags for better Twitter sharing',
          severity: 'info'
        });
      }

      // Check H1 tags
      const h1Tags = document.querySelectorAll('h1');
      if (h1Tags.length === 0) {
        issues.push({
          title: 'No H1 tag found',
          description: 'Every page should have exactly one H1 tag',
          severity: 'error'
        });
      } else if (h1Tags.length > 1) {
        issues.push({
          title: 'Multiple H1 tags found',
          description: `Found ${h1Tags.length} H1 tags. Use only one per page.`,
          severity: 'warning'
        });
      }

      // Check robots meta
      const robots = document.querySelector('meta[name="robots"]');
      if (robots && robots.content.includes('noindex')) {
        issues.push({
          title: 'Page is set to noindex',
          description: 'This page will not be indexed by search engines',
          severity: 'warning'
        });
      }

      // Check for language attribute
      const htmlLang = document.documentElement.getAttribute('lang');
      if (!htmlLang) {
        issues.push({
          title: 'Missing language attribute',
          description: 'Add lang attribute to <html> tag for better accessibility and SEO',
          severity: 'warning'
        });
      }

      // Check mobile viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        issues.push({
          title: 'Missing viewport meta tag',
          description: 'Add viewport meta tag for mobile optimization',
          severity: 'error'
        });
      }

      // Check favicon
      const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      if (!favicon) {
        issues.push({
          title: 'Missing favicon',
          description: 'Add a favicon for better branding',
          severity: 'info'
        });
      }

      // Check for broken images
      document.querySelectorAll('img').forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          issues.push({
            title: 'Broken image detected',
            description: `Image failed to load: ${img.src}`,
            severity: 'error',
            selector: this.getSelector(img)
          });
        }
      });

      // Check for images that could be optimized
      document.querySelectorAll('img').forEach(img => {
        if (img.naturalWidth > img.clientWidth * 2) {
          issues.push({
            title: 'Image could be optimized',
            description: `Image is ${img.naturalWidth}px but displayed at ${img.clientWidth}px`,
            severity: 'info',
            selector: this.getSelector(img)
          });
        }
      });

      // Check for HTTPS
      if (window.location.protocol !== 'https:') {
        issues.push({
          title: 'Site not using HTTPS',
          description: 'Use HTTPS for better security and SEO',
          severity: 'warning'
        });
      }

      this.data.seo = issues;
    }

    /**
     * Audit CSS and layout issues
     */
    auditCSS() {
      const issues = [];

      // Check for horizontal overflow
      const bodyWidth = document.body.clientWidth;
      document.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > bodyWidth + 5) { // 5px tolerance
          issues.push({
            title: 'Element causing horizontal scroll',
            description: `Element is ${el.scrollWidth}px wide, exceeding viewport`,
            severity: 'warning',
            selector: this.getSelector(el)
          });
        }
      });

      // Detect very high z-index values
      document.querySelectorAll('*').forEach(el => {
        const zIndex = parseInt(window.getComputedStyle(el).zIndex);
        if (zIndex > 10000) {
          issues.push({
            title: 'Extremely high z-index',
            description: `z-index of ${zIndex} detected`,
            severity: 'info',
            selector: this.getSelector(el)
          });
        }
      });

      this.data.cssIssues = issues;
    }

    /**
     * Audit network requests
     */
    auditNetwork() {
      const resources = performance.getEntriesByType('resource');

      this.data.network = resources.map(resource => {
        const url = resource.name;
        let category = 'other';

        // Categorize resources
        if (url.includes('webflow.com') || url.includes('webflow.io')) {
          category = 'webflow-cdn';
        } else if (url.includes('uploads-ssl.webflow.com') || url.includes('assets.website-files.com')) {
          category = 'user-uploads';
        } else if (url.includes('google-analytics.com') || url.includes('googletagmanager.com') ||
                   url.includes('facebook.') || url.includes('hotjar.') || url.includes('segment.')) {
          category = 'analytics';
        } else if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com') ||
                   url.includes('use.typekit.net')) {
          category = 'fonts';
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
          category = 'images';
        } else if (url.match(/\.css/i)) {
          category = 'stylesheets';
        } else if (url.match(/\.js/i)) {
          category = 'scripts';
        } else if (!url.startsWith(window.location.origin)) {
          category = 'third-party';
        }

        return {
          name: resource.name,
          type: resource.initiatorType,
          size: resource.transferSize || 0,
          duration: resource.duration,
          status: resource.responseStatus || 200,
          category: category
        };
      });
    }

    /**
     * Intercept console errors
     */
    interceptConsole() {
      const originalError = console.error;
      console.error = (...args) => {
        this.data.errors.push({
          message: args.join(' '),
          severity: 'error',
          timestamp: Date.now(),
          stack: new Error().stack
        });
        this.updateBadges();
        this.showToast('Error Detected', args[0]);
        originalError.apply(console, args);
      };

      // Listen for uncaught errors
      window.addEventListener('error', (e) => {
        this.data.errors.push({
          message: e.message,
          severity: 'error',
          timestamp: Date.now(),
          stack: e.error?.stack,
          selector: e.filename + ':' + e.lineno
        });
        this.updateBadges();
      });

      // Listen for unhandled promise rejections
      window.addEventListener('unhandledrejection', (e) => {
        this.data.errors.push({
          message: e.reason,
          severity: 'error',
          timestamp: Date.now(),
          stack: e.reason?.stack
        });
        this.updateBadges();
      });
    }

    /**
     * Start monitoring for changes
     */
    startMonitoring() {
      // Monitor DOM changes
      const observer = new MutationObserver(this.debounce(() => {
        this.auditAccessibility();
        this.auditSEO();
        this.auditCSS();
        this.updateBadges();

        if (this.activeTab !== 'overview') {
          this.renderTabContent(this.activeTab);
        }
      }, 1000));

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      this.observers.push(observer);
    }

    /**
     * Update tab badges
     */
    updateBadges() {
      const tabs = this.shadow.querySelectorAll('.wdc-tab');

      tabs.forEach(tab => {
        const badge = tab.querySelector('.wdc-tab-badge');
        if (!badge) return;

        let count = 0;
        switch(tab.dataset.tab) {
          case 'errors':
            count = this.data.errors.length;
            badge.className = 'wdc-tab-badge';
            break;
          case 'accessibility':
            count = this.data.accessibility.length;
            badge.className = 'wdc-tab-badge warning';
            break;
          case 'seo':
            count = this.data.seo.length;
            badge.className = 'wdc-tab-badge warning';
            break;
        }

        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      });
    }

    /**
     * Show toast notification
     */
    showToast(title, message) {
      const toast = document.createElement('div');
      toast.className = 'wdc-toast';
      toast.innerHTML = `
        <div class="wdc-toast-title">${title}</div>
        <div class="wdc-toast-message">${this.truncate(message, 100)}</div>
      `;

      this.shadow.appendChild(toast);

      setTimeout(() => toast.remove(), 4000);
    }

    /**
     * Calculate overall performance score
     */
    calculatePerformanceScore() {
      const perf = this.data.performance;
      let score = 100;

      // Deduct points for poor metrics
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
      const report = this.generateHTMLReport();
      const blob = new Blob([report], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webflow-debug-report-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);

      this.showToast('Report Exported', 'Your debug report has been downloaded');
    }

    /**
     * Generate HTML report
     */
    generateHTMLReport() {
      const performanceScore = this.calculatePerformanceScore();
      const timestamp = new Date().toISOString();

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webflow Debug Report - ${document.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0F172A;
      color: #E2E8F0;
      padding: 40px 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 32px; margin-bottom: 8px; color: #F1F5F9; }
    .subtitle { color: #94A3B8; margin-bottom: 40px; }
    .card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    h2 { font-size: 24px; margin-bottom: 16px; color: #F1F5F9; }
    .score {
      font-size: 72px;
      font-weight: 700;
      background: linear-gradient(135deg, #6366F1 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin: 20px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .metric {
      background: rgba(30, 41, 59, 0.4);
      padding: 20px;
      border-radius: 8px;
    }
    .metric-label { font-size: 12px; color: #94A3B8; text-transform: uppercase; margin-bottom: 8px; }
    .metric-value { font-size: 32px; font-weight: 700; color: #F1F5F9; }
    .issue {
      background: rgba(30, 41, 59, 0.4);
      border-left: 3px solid #EF4444;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .issue.warning { border-left-color: #F59E0B; }
    .issue.info { border-left-color: #3B82F6; }
    .issue-title { font-weight: 600; margin-bottom: 4px; }
    .issue-desc { font-size: 14px; color: #94A3B8; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; padding: 12px; background: rgba(30, 41, 59, 0.6); color: #94A3B8; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid rgba(99, 102, 241, 0.1); }
    code { background: rgba(15, 23, 42, 0.6); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #10B981; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Webflow Debug Report</h1>
    <div class="subtitle">Generated on ${timestamp} for ${window.location.href}</div>

    <div class="card">
      <h2>Executive Summary</h2>
      <div class="score">${performanceScore}</div>
      <div style="text-align: center; color: #94A3B8; margin-bottom: 24px;">Overall Performance Score</div>

      <div class="grid">
        <div class="metric">
          <div class="metric-label">Total Issues</div>
          <div class="metric-value">${this.data.errors.length + this.data.accessibility.length + this.data.seo.length}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Page Load Time</div>
          <div class="metric-value">${this.data.performance.pageLoadTime}ms</div>
        </div>
        <div class="metric">
          <div class="metric-label">Resources</div>
          <div class="metric-value">${this.data.network.length}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total Size</div>
          <div class="metric-value">${this.formatBytes(this.data.performance.totalSize || 0)}</div>
        </div>
      </div>
    </div>

    ${this.data.errors.length > 0 ? `
    <div class="card">
      <h2>JavaScript Errors (${this.data.errors.length})</h2>
      ${this.data.errors.map(error => `
        <div class="issue error">
          <div class="issue-title">${this.escapeHtml(error.message)}</div>
          ${error.stack ? `<div class="issue-desc"><code>${this.escapeHtml(this.truncate(error.stack, 200))}</code></div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${this.data.accessibility.length > 0 ? `
    <div class="card">
      <h2>Accessibility Issues (${this.data.accessibility.length})</h2>
      ${this.data.accessibility.map(issue => `
        <div class="issue ${issue.severity}">
          <div class="issue-title">${issue.title}</div>
          <div class="issue-desc">${issue.description}</div>
          ${issue.selector ? `<div class="issue-desc"><code>${issue.selector}</code></div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${this.data.seo.length > 0 ? `
    <div class="card">
      <h2>SEO Issues (${this.data.seo.length})</h2>
      ${this.data.seo.map(issue => `
        <div class="issue ${issue.severity}">
          <div class="issue-title">${issue.title}</div>
          <div class="issue-desc">${issue.description}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="card">
      <h2>Performance Metrics</h2>
      <table>
        <tr>
          <td>Largest Contentful Paint (LCP)</td>
          <td><code>${this.data.performance.lcp}ms</code></td>
        </tr>
        <tr>
          <td>First Input Delay (FID)</td>
          <td><code>${this.data.performance.fid}ms</code></td>
        </tr>
        <tr>
          <td>Cumulative Layout Shift (CLS)</td>
          <td><code>${this.data.performance.cls}</code></td>
        </tr>
        <tr>
          <td>Time to First Byte (TTFB)</td>
          <td><code>${this.data.performance.ttfb}ms</code></td>
        </tr>
        <tr>
          <td>First Contentful Paint (FCP)</td>
          <td><code>${Math.round(this.data.performance.fcp)}ms</code></td>
        </tr>
      </table>
    </div>

    <div class="card">
      <h2>Recommendations</h2>
      <div class="issue info">
        <div class="issue-title">Optimize Images</div>
        <div class="issue-desc">Use WebP format and properly sized images to reduce page weight.</div>
      </div>
      <div class="issue info">
        <div class="issue-title">Minimize JavaScript</div>
        <div class="issue-desc">Remove unused code and defer non-critical scripts.</div>
      </div>
      <div class="issue info">
        <div class="issue-title">Fix Accessibility Issues</div>
        <div class="issue-desc">Add proper alt text, labels, and ARIA attributes to improve accessibility.</div>
      </div>
    </div>
  </div>
</body>
</html>
      `;
    }

    /**
     * Utility: Get CSS selector for element
     */
    getSelector(el) {
      if (el.id) return `#${el.id}`;
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) return `${el.tagName.toLowerCase()}.${classes[0]}`;
      }
      return el.tagName.toLowerCase();
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    /**
     * Utility: Format bytes
     */
    formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Utility: Truncate string
     */
    truncate(str, length) {
      if (!str) return '';
      str = String(str);
      return str.length > length ? str.substring(0, length) + '...' : str;
    }

    /**
     * Utility: Escape HTML
     */
    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize the console
  new WebflowDebugConsole();
})();
