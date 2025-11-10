/**
 * Webflow Monitor Premium - Part 2: Functionality
 * This contains all the methods and premium features
 */

// Add these methods to the WebflowMonitorPremium class:

setupEventListeners() {
  // Tab switching
  this.shadow.querySelectorAll('.wmp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      this.switchTab(tab.dataset.tab);
    });
  });

  // Header buttons
  this.shadow.querySelector('.wmp-minimize-btn').addEventListener('click', () => this.toggleMinimize());
  this.shadow.querySelector('.wmp-expand-btn').addEventListener('click', () => this.toggleExpand());
  this.shadow.querySelector('.wmp-close-btn').addEventListener('click', () => this.close());
  this.shadow.querySelector('.wmp-export-btn').addEventListener('click', () => this.exportReport());
  this.shadow.querySelector('.wmp-command-btn')?.addEventListener('click', () => this.toggleCommandPalette());
  this.shadow.querySelector('.wmp-snapshot-btn').addEventListener('click', () => {
    this.takeSnapshot('manual');
    this.showToast('Snapshot Taken', 'Current performance data captured');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Command palette: Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.toggleCommandPalette();
    }

    // Toggle console: Cmd/Ctrl + Shift + D
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      this.toggleMinimize();
    }

    // Toggle FPS: Cmd/Ctrl + Shift + F
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      if (this.fpsOverlay) {
        this.fpsOverlay.style.display = this.fpsOverlay.style.display === 'none' ? 'block' : 'none';
      }
    }

    // Escape to close command palette
    if (e.key === 'Escape' && this.commandPaletteOpen) {
      this.toggleCommandPalette();
    }

    // Navigate command palette
    if (this.commandPaletteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedCommand = Math.min(this.selectedCommand + 1, this.getFilteredCommands().length - 1);
        this.updateCommandPalette();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedCommand = Math.max(this.selectedCommand - 1, 0);
        this.updateCommandPalette();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCommand(this.getFilteredCommands()[this.selectedCommand]);
      }
    }
  });

  // Dragging
  this.setupDragging();

  // Click on minimized icon
  this.containerElement.addEventListener('click', (e) => {
    if (this.isMinimized && e.target.closest('.wmp-minimized-icon')) {
      this.toggleMinimize();
    }
  });
}

setupDragging() {
  const header = this.shadow.querySelector('.wmp-header');
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

setupCommandPalette() {
  if (!this.commandPaletteElement) return;

  const input = this.commandPaletteElement.querySelector('.wmp-command-input');
  input.addEventListener('input', (e) => {
    this.searchQuery = e.target.value;
    this.selectedCommand = 0;
    this.updateCommandPalette();
  });

  this.updateCommandPalette();
}

getCommands() {
  return [
    { icon: '🎯', name: 'Take Snapshot', desc: 'Capture current performance state', action: () => this.takeSnapshot('command') },
    { icon: '📊', name: 'Export Report', desc: 'Download comprehensive report', action: () => this.exportReport() },
    { icon: '🔄', name: 'Compare Snapshots', desc: 'View performance comparison', action: () => this.switchTab('comparison') },
    { icon: '💡', name: 'View Recommendations', desc: 'See optimization suggestions', action: () => this.switchTab('recommendations') },
    { icon: '⚡', name: 'Performance Overview', desc: 'Core Web Vitals dashboard', action: () => this.switchTab('performance') },
    { icon: '🐛', name: 'View Errors', desc: 'JavaScript error log', action: () => this.switchTab('errors') },
    { icon: '♿', name: 'Accessibility Audit', desc: 'Check accessibility issues', action: () => this.switchTab('accessibility') },
    { icon: '🔍', name: 'SEO Analysis', desc: 'SEO optimization audit', action: () => this.switchTab('seo') },
    { icon: '🌐', name: 'Network Activity', desc: 'HTTP requests and resources', action: () => this.switchTab('network') },
    { icon: '📸', name: 'Capture Screenshot', desc: 'Take screenshot of issues', action: () => this.captureScreenshot() },
    { icon: '🔁', name: 'Refresh Analysis', desc: 'Re-run all audits', action: () => this.runAllAudits() },
    { icon: '⏸️', name: 'Minimize', desc: 'Minimize to corner', action: () => this.toggleMinimize() },
    { icon: '❌', name: 'Close Monitor', desc: 'Exit and cleanup', action: () => this.close() }
  ];
}

getFilteredCommands() {
  if (!this.searchQuery) return this.getCommands();
  const query = this.searchQuery.toLowerCase();
  return this.getCommands().filter(cmd =>
    cmd.name.toLowerCase().includes(query) ||
    cmd.desc.toLowerCase().includes(query)
  );
}

updateCommandPalette() {
  if (!this.commandPaletteElement) return;

  const list = this.commandPaletteElement.querySelector('.wmp-command-list');
  const commands = this.getFilteredCommands();

  list.innerHTML = commands.map((cmd, index) => `
    <div class="wmp-command-item ${index === this.selectedCommand ? 'selected' : ''}" data-index="${index}">
      <div class="wmp-command-icon">${cmd.icon}</div>
      <div class="wmp-command-info">
        <div class="wmp-command-name">${cmd.name}</div>
        <div class="wmp-command-desc">${cmd.desc}</div>
      </div>
    </div>
  `).join('');

  // Add click handlers
  list.querySelectorAll('.wmp-command-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      this.executeCommand(commands[index]);
    });
  });
}

toggleCommandPalette() {
  this.commandPaletteOpen = !this.commandPaletteOpen;
  this.commandPaletteElement.classList.toggle('open', this.commandPaletteOpen);

  if (this.commandPaletteOpen) {
    const input = this.commandPaletteElement.querySelector('.wmp-command-input');
    input.value = '';
    this.searchQuery = '';
    this.selectedCommand = 0;
    this.updateCommandPalette();
    setTimeout(() => input.focus(), 100);
  }
}

executeCommand(command) {
  if (!command) return;
  command.action();
  this.toggleCommandPalette();
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
  window.__WEBFLOW_MONITOR_PREMIUM__ = false;
}

cleanup() {
  this.observers.forEach(observer => observer.disconnect());
  this.timers.forEach(timer => clearInterval(timer));
  if (this.fpsCounter) cancelAnimationFrame(this.fpsCounter);
}

switchTab(tabName) {
  this.activeTab = tabName;
  this.shadow.querySelectorAll('.wmp-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  this.renderTabContent(tabName);
}

updateUI() {
  this.updateBadges();
  if (this.activeTab) {
    this.renderTabContent(this.activeTab);
  }
}

updateBadges() {
  const badges = {
    errors: this.data.errors.length,
    recommendations: this.data.recommendations.length
  };

  Object.entries(badges).forEach(([tab, count]) => {
    const tabElement = this.shadow.querySelector(`[data-tab="${tab}"] .wmp-tab-badge`);
    if (tabElement) {
      tabElement.textContent = count;
      tabElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
  });
}

// Rendering methods
renderTabContent(tabName) {
  const content = this.shadow.querySelector('.wmp-content');

  switch(tabName) {
    case 'overview':
      content.innerHTML = this.renderOverview();
      break;
    case 'performance':
      content.innerHTML = this.renderPerformance();
      break;
    case 'recommendations':
      content.innerHTML = this.renderRecommendations();
      break;
    case 'comparison':
      content.innerHTML = this.renderComparison();
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
  }
}

renderOverview() {
  const perfScore = this.calculatePerformanceScore();
  const prevSnapshot = this.snapshots.length > 1 ? this.snapshots[this.snapshots.length - 2] : null;
  const change = prevSnapshot ? perfScore - prevSnapshot.performanceScore : 0;

  return `
    <div class="wmp-grid">
      <div class="wmp-metric">
        <div class="wmp-metric-label">Performance Score</div>
        <div class="wmp-metric-value ${perfScore >= 90 ? 'good' : perfScore >= 70 ? 'warning' : 'error'}">${perfScore}</div>
        ${change !== 0 ? `<div class="wmp-metric-change ${change > 0 ? 'positive' : 'negative'}">${change > 0 ? '↑' : '↓'} ${Math.abs(change)}pts</div>` : ''}
      </div>
      <div class="wmp-metric">
        <div class="wmp-metric-label">Current FPS</div>
        <div class="wmp-metric-value ${this.data.fps.current >= 55 ? 'good' : this.data.fps.current >= 30 ? 'warning' : 'error'}">${Math.round(this.data.fps.current)}</div>
      </div>
      <div class="wmp-metric">
        <div class="wmp-metric-label">Total Issues</div>
        <div class="wmp-metric-value ${this.data.errors.length === 0 ? 'good' : 'error'}">${this.data.errors.length}</div>
      </div>
      <div class="wmp-metric">
        <div class="wmp-metric-label">Page Weight</div>
        <div class="wmp-metric-value">${this.formatBytes(this.data.performance.totalSize || 0)}</div>
      </div>
    </div>

    <div class="wmp-card">
      <div class="wmp-card-title">Performance Score</div>
      <div class="wmp-score-ring">
        <svg class="wmp-score-circle" width="140" height="140">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366F1" />
              <stop offset="50%" style="stop-color:#8B5CF6" />
              <stop offset="100%" style="stop-color:#A855F7" />
            </linearGradient>
          </defs>
          <circle class="wmp-score-bg" cx="70" cy="70" r="60" />
          <circle class="wmp-score-progress" cx="70" cy="70" r="60"
            stroke-dasharray="${2 * Math.PI * 60}"
            stroke-dashoffset="${2 * Math.PI * 60 * (1 - perfScore / 100)}" />
        </svg>
        <div class="wmp-score-text">${perfScore}</div>
      </div>
      <div class="wmp-chart">
        ${this.renderPerformanceMetricBar('LCP', this.data.performance.lcp, 2500)}
        ${this.renderPerformanceMetricBar('FID', this.data.performance.fid, 100)}
        ${this.renderPerformanceMetricBar('CLS', this.data.performance.cls, 0.1, true)}
        ${this.renderPerformanceMetricBar('TTFB', this.data.performance.ttfb, 600)}
      </div>
    </div>

    ${this.data.recommendations.length > 0 ? `
    <div class="wmp-card">
      <div class="wmp-card-title">Top Recommendations</div>
      ${this.data.recommendations.slice(0, 3).map(rec => this.renderRecommendation(rec)).join('')}
      <div style="text-align: center; margin-top: 16px;">
        <span class="wmp-recommendation-action" onclick="this.getRootNode().host.__instance.switchTab('recommendations')">
          View all ${this.data.recommendations.length} recommendations →
        </span>
      </div>
    </div>
    ` : ''}
  `;
}

renderPerformance() {
  const perf = this.data.performance;
  return `
    <div class="wmp-card">
      <div class="wmp-card-title">Core Web Vitals</div>
      <div class="wmp-chart">
        ${this.renderPerformanceMetricBar('Largest Contentful Paint', perf.lcp, 2500)}
        ${this.renderPerformanceMetricBar('First Input Delay', perf.fid, 100)}
        ${this.renderPerformanceMetricBar('Cumulative Layout Shift', perf.cls, 0.1, true)}
        ${this.renderPerformanceMetricBar('Time to First Byte', perf.ttfb, 600)}
        ${this.renderPerformanceMetricBar('First Contentful Paint', perf.fcp, 1800)}
      </div>
    </div>

    <div class="wmp-card wmp-mt-4">
      <div class="wmp-card-title">Resource Breakdown</div>
      <div class="wmp-grid">
        <div class="wmp-metric">
          <div class="wmp-metric-label">JavaScript</div>
          <div class="wmp-metric-value">${this.formatBytes(perf.jsSize || 0)}</div>
        </div>
        <div class="wmp-metric">
          <div class="wmp-metric-label">CSS</div>
          <div class="wmp-metric-value">${this.formatBytes(perf.cssSize || 0)}</div>
        </div>
        <div class="wmp-metric">
          <div class="wmp-metric-label">Images</div>
          <div class="wmp-metric-value">${this.formatBytes(perf.imageSize || 0)}</div>
        </div>
        <div class="wmp-metric">
          <div class="wmp-metric-label">Fonts</div>
          <div class="wmp-metric-value">${this.formatBytes(perf.fontSize || 0)}</div>
        </div>
      </div>
    </div>
  `;
}

renderRecommendations() {
  if (this.data.recommendations.length === 0) {
    return `
      <div class="wmp-empty">
        <div class="wmp-empty-icon">🎉</div>
        <div class="wmp-empty-title">No Recommendations</div>
        <div class="wmp-empty-text">Your site is performing well! Keep monitoring for potential improvements.</div>
      </div>
    `;
  }

  return `
    <div class="wmp-card">
      <div class="wmp-card-title">Optimization Recommendations (${this.data.recommendations.length})</div>
      ${this.data.recommendations.map(rec => this.renderRecommendation(rec)).join('')}
    </div>
  `;
}

renderRecommendation(rec) {
  return `
    <div class="wmp-recommendation">
      <div class="wmp-recommendation-header">
        <div>
          <div class="wmp-recommendation-title">${rec.title}</div>
          <div class="wmp-recommendation-desc">${rec.description}</div>
        </div>
        <div class="wmp-recommendation-priority ${rec.priority}">${rec.priority}</div>
      </div>
      ${rec.action ? `<span class="wmp-recommendation-action">${rec.action}</span>` : ''}
    </div>
  `;
}

renderComparison() {
  if (this.snapshots.length < 2) {
    return `
      <div class="wmp-empty">
        <div class="wmp-empty-icon">📊</div>
        <div class="wmp-empty-title">No Comparisons Available</div>
        <div class="wmp-empty-text">Take multiple snapshots to compare performance over time. Click the camera icon to take a snapshot.</div>
      </div>
    `;
  }

  const current = this.snapshots[this.snapshots.length - 1];
  const previous = this.snapshots[this.snapshots.length - 2];

  const compare = (curr, prev) => {
    const diff = curr - prev;
    const percent = prev === 0 ? 0 : ((diff / prev) * 100).toFixed(1);
    return { diff, percent, improved: diff < 0 };
  };

  return `
    <div class="wmp-card">
      <div class="wmp-card-title">Performance Comparison</div>
      <div style="color: #94A3B8; margin-bottom: 24px;">
        Comparing ${new Date(current.timestamp).toLocaleString()} vs ${new Date(previous.timestamp).toLocaleString()}
      </div>

      <div class="wmp-grid">
        ${this.renderComparisonMetric('Performance Score', current.performanceScore, previous.performanceScore, false)}
        ${this.renderComparisonMetric('LCP', current.data.performance.lcp, previous.data.performance.lcp)}
        ${this.renderComparisonMetric('FID', current.data.performance.fid, previous.data.performance.fid)}
        ${this.renderComparisonMetric('CLS', current.data.performance.cls, previous.data.performance.cls, false)}
        ${this.renderComparisonMetric('Page Size', current.data.performance.totalSize, previous.data.performance.totalSize)}
        ${this.renderComparisonMetric('Errors', current.data.errors.length, previous.data.errors.length)}
      </div>
    </div>

    <div class="wmp-card wmp-mt-4">
      <div class="wmp-card-title">Snapshot History (${this.snapshots.length})</div>
      ${this.snapshots.slice().reverse().map((snap, index) => `
        <div style="padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; margin-bottom: 8px;">
          <div class="wmp-flex wmp-justify-between wmp-items-center">
            <div>
              <div style="font-weight: 600; color: #F1F5F9;">${snap.label}</div>
              <div style="font-size: 12px; color: #64748B;">${new Date(snap.timestamp).toLocaleString()}</div>
            </div>
            <div style="font-size: 24px; font-weight: 800; color: #6366F1;">${snap.performanceScore}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

renderComparisonMetric(label, current, previous, lowerIsBetter = true) {
  const diff = current - previous;
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const percent = previous === 0 ? 0 : Math.abs((diff / previous) * 100).toFixed(1);

  let displayValue = current;
  if (label === 'Page Size') displayValue = this.formatBytes(current);
  else if (!Number.isInteger(current)) displayValue = current.toFixed(2);

  return `
    <div class="wmp-metric">
      <div class="wmp-metric-label">${label}</div>
      <div class="wmp-metric-value">${displayValue}</div>
      ${diff !== 0 ? `
        <div class="wmp-metric-change ${improved ? 'positive' : 'negative'}">
          ${improved ? '↓' : '↑'} ${percent}%
        </div>
      ` : '<div class="wmp-metric-change" style="color: #64748B;">No change</div>'}
    </div>
  `;
}

renderPerformanceMetricBar(label, value, threshold, isScore = false) {
  value = value || 0;
  const percentage = isScore
    ? Math.min((value / threshold) * 100, 100)
    : Math.min((value / threshold) * 100, 100);
  const displayValue = isScore ? value.toFixed(3) : Math.round(value) + 'ms';

  return `
    <div class="wmp-chart-bar">
      <div class="wmp-chart-label">${label}</div>
      <div class="wmp-chart-track">
        <div class="wmp-chart-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="wmp-chart-value">${displayValue}</div>
    </div>
  `;
}

renderErrors() {
  if (this.data.errors.length === 0) {
    return `
      <div class="wmp-empty">
        <div class="wmp-empty-icon">✅</div>
        <div class="wmp-empty-title">No Errors Detected</div>
        <div class="wmp-empty-text">All JavaScript is running smoothly!</div>
      </div>
    `;
  }

  return `
    <div class="wmp-card">
      <div class="wmp-card-title">JavaScript Errors (${this.data.errors.length})</div>
      ${this.data.errors.map(error => `
        <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #EF4444; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
          <div style="font-weight: 700; color: #EF4444; margin-bottom: 8px;">${this.escapeHtml(error.message)}</div>
          ${error.stack ? `<div style="font-family: monospace; font-size: 12px; color: #94A3B8; opacity: 0.7;">${this.escapeHtml(error.stack.split('\n').slice(0, 3).join('\n'))}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

renderAccessibility() {
  return `<div class="wmp-card"><div class="wmp-card-title">Accessibility Report</div><p style="color: #94A3B8;">Coming soon...</p></div>`;
}

renderSEO() {
  return `<div class="wmp-card"><div class="wmp-card-title">SEO Analysis</div><p style="color: #94A3B8;">Coming soon...</p></div>`;
}

renderNetwork() {
  return `<div class="wmp-card"><div class="wmp-card-title">Network Activity</div><p style="color: #94A3B8;">Coming soon...</p></div>`;
}

// Continue with monitoring methods, FPS counter, recommendations engine, etc...
// (All methods from the Pro version, plus new premium features)

// Will add in next part...
