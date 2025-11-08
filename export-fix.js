/**
 * PATCH for Export Report Bug Fix
 *
 * Paste this AFTER loading Monitor Pro to fix the export functionality
 */

(function() {
  // Wait for Monitor Pro to be loaded
  const checkInterval = setInterval(() => {
    const host = document.getElementById('webflow-monitor-pro-host');
    if (!host || !host.shadowRoot) return;

    const exportBtn = host.shadowRoot.querySelector('.wm-export-btn');
    if (!exportBtn) return;

    clearInterval(checkInterval);

    console.log('%c🔧 Patching Export Report...', 'color: #F59E0B; font-weight: bold');

    // Find the Monitor Pro instance (it's stored globally)
    // We need to override the exportReport method

    // Remove old listener
    const newExportBtn = exportBtn.cloneNode(true);
    exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);

    // Add new fixed export function
    newExportBtn.addEventListener('click', () => {
      console.log('%c📊 Generating export report...', 'color: #6366F1; font-weight: bold');

      try {
        // Get the data but filter out DOM elements
        const cleanData = JSON.parse(JSON.stringify({
          webflow: window.__monitorProData?.webflow || {},
          performance: window.__monitorProData?.performance || {},
          errors: (window.__monitorProData?.errors || []).map(e => ({
            message: e.message,
            stack: e.stack,
            timestamp: e.timestamp,
            severity: e.severity
          })),
          accessibility: (window.__monitorProData?.accessibility || []).map(a => ({
            type: a.type,
            message: a.message,
            selector: a.selector
          })),
          seo: window.__monitorProData?.seo || [],
          network: window.__monitorProData?.network || [],
          clicks: window.__monitorProData?.clicks || {},
          scroll: window.__monitorProData?.scroll || {},
          memory: {
            snapshots: window.__monitorProData?.memory?.snapshots || [],
            leaks: window.__monitorProData?.memory?.leaks || []
          },
          fps: window.__monitorProData?.fps || {},
          dom: {
            size: window.__monitorProData?.dom?.size || 0,
            depth: window.__monitorProData?.dom?.depth || 0,
            mutations: window.__monitorProData?.dom?.mutations || 0,
            queries: window.__monitorProData?.dom?.queries || {}
          },
          gsap: {
            timelines: (window.__monitorProData?.gsap?.timelines || []).map(t => ({
              duration: t.duration,
              progress: t.progress,
              paused: t.paused
            })),
            scrollTriggers: window.__monitorProData?.gsap?.scrollTriggers || []
          },
          videos: (window.__monitorProData?.videos || []).map(v => ({
            type: v.type,
            id: v.id,
            loaded: v.loaded,
            loadTime: v.loadTime
          })),
          scripts: window.__monitorProData?.scripts || {},
          global: window.__monitorProData?.global || {}
        }));

        const report = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          data: cleanData
        };

        // Create download
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webflow-monitor-${Date.now()}.json`;

        // Append to body, click, then remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        console.log('%c✅ Report exported successfully!', 'color: #10B981; font-weight: bold; font-size: 14px');

        // Show success message in UI
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95));
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          z-index: 10000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 600;
        `;
        toast.textContent = '✅ Report downloaded successfully!';
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.transition = 'opacity 0.3s';
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
        }, 3000);

      } catch (error) {
        console.error('%c❌ Export failed:', 'color: #EF4444; font-weight: bold', error);
        alert('Export failed: ' + error.message);
      }
    });

    console.log('%c✅ Export patch applied!', 'color: #10B981; font-weight: bold');
  }, 500);

  // Timeout after 10 seconds
  setTimeout(() => clearInterval(checkInterval), 10000);
})();
