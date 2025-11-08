/**
 * QUICK LOADER for Webflow Monitor Pro
 *
 * This script loads Monitor Pro and fixes the export issue
 *
 * PASTE THIS INTO YOUR CONSOLE:
 */

(async function() {
  console.log('%c🚀 Loading Webflow Monitor Pro...', 'color: #6366F1; font-size: 16px; font-weight: bold');

  // Remove existing instance if any
  const existing = document.getElementById('webflow-monitor-pro-host');
  if (existing) {
    existing.remove();
    window.__WEBFLOW_MONITOR_PRO__ = false;
    console.log('Removed existing instance');
  }

  try {
    // Load the main script
    const response = await fetch('https://raw.githubusercontent.com/bonesco/Echo/claude/webflow-debug-console-011CUuh6cWPCKN5y4QMb9NnZ/webflow-monitor-pro.js');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    let code = await response.text();
    console.log('✅ Script downloaded');

    // PATCH: Fix the export function before executing
    code = code.replace(
      /exportReport\(\)\s*{[\s\S]*?console\.log\('%c✅ Report exported successfully'/,
      `exportReport() {
      try {
        console.log('%c📊 Generating report...', 'color: #6366F1; font-weight: bold');

        // Create clean data without DOM elements
        const cleanData = (obj) => {
          if (!obj) return obj;
          if (Array.isArray(obj)) {
            return obj.map(item => {
              if (item instanceof Element || item instanceof Node) return null;
              if (typeof item === 'object') return cleanData(item);
              return item;
            }).filter(x => x !== null);
          }
          if (typeof obj === 'object') {
            const cleaned = {};
            for (const key in obj) {
              if (obj[key] instanceof Element || obj[key] instanceof Node) continue;
              if (key === 'element' || key === 'timeline') continue;
              if (typeof obj[key] === 'object') {
                cleaned[key] = cleanData(obj[key]);
              } else {
                cleaned[key] = obj[key];
              }
            }
            return cleaned;
          }
          return obj;
        };

        const report = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          environment: this.config.environment,
          performanceScore: this.calculatePerformanceScore(),
          data: cleanData(this.data)
        };

        const jsonStr = JSON.stringify(report, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`webflow-monitor-\${Date.now()}.json\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('%c✅ Report exported successfully'`
    );

    console.log('✅ Export function patched');

    // Execute the code
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);

    console.log('✅ Monitor Pro loaded');

    // Wait for initialization
    setTimeout(() => {
      if (window.__WEBFLOW_MONITOR_PRO__) {
        console.log('%c🎉 Monitor Pro is ready!', 'color: #10B981; font-size: 16px; font-weight: bold');
        console.log('%cKeyboard shortcuts:', 'color: #94A3B8; font-weight: bold');
        console.log('  Cmd/Ctrl + Shift + D → Toggle console');
        console.log('  Cmd/Ctrl + Shift + F → Toggle FPS overlay');
        console.log('\n%cExport now works! Click "Export Report" button.', 'color: #10B981; font-weight: bold');
      } else {
        console.error('❌ Monitor Pro failed to initialize. Check for errors above.');
      }
    }, 1000);

  } catch (error) {
    console.error('%c❌ Failed to load Monitor Pro:', 'color: #EF4444; font-weight: bold', error);
    console.log('\n%cTroubleshooting:', 'color: #F59E0B; font-weight: bold');
    console.log('1. Check your internet connection');
    console.log('2. Make sure you can access GitHub');
    console.log('3. Try refreshing the page and running again');
  }
})();
