/**
 * SIMPLE EXPORT - Works Every Time
 *
 * Just paste this in your console and it will download a report
 */

(function() {
  console.log('%c📊 Generating Simple Report...', 'color: #6366F1; font-size: 14px; font-weight: bold');

  try {
    // Gather basic performance data
    const perf = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    // Gather DOM info
    const images = Array.from(document.querySelectorAll('img'));
    const scripts = Array.from(document.querySelectorAll('script'));

    // Build a simple, clean report
    const report = {
      // Metadata
      generatedAt: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },

      // Performance
      performance: {
        pageLoadTime: perf ? Math.round(perf.loadEventEnd - perf.fetchStart) : null,
        domContentLoaded: perf ? Math.round(perf.domContentLoadedEventEnd - perf.fetchStart) : null,
        ttfb: perf ? Math.round(perf.responseStart - perf.requestStart) : null,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
        totalResources: resources.length,
        resourceSizes: {
          total: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
          js: resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
          css: resources.filter(r => r.name.includes('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0),
          images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)).reduce((sum, r) => sum + (r.transferSize || 0), 0)
        }
      },

      // DOM Stats
      dom: {
        totalElements: document.querySelectorAll('*').length,
        images: images.length,
        imagesWithoutAlt: images.filter(img => !img.alt).length,
        scripts: scripts.length,
        inlineScripts: scripts.filter(s => !s.src).length,
        externalScripts: scripts.filter(s => s.src).length,
        stylesheets: document.styleSheets.length,
        h1Tags: document.querySelectorAll('h1').length
      },

      // Basic SEO
      seo: {
        title: document.title,
        titleLength: document.title.length,
        metaDescription: document.querySelector('meta[name="description"]')?.content || null,
        metaDescriptionLength: document.querySelector('meta[name="description"]')?.content?.length || 0,
        canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || null,
        ogImage: document.querySelector('meta[property="og:image"]')?.content || null
      },

      // Webflow Detection
      webflow: {
        detected: !!window.Webflow || !!document.querySelector('[data-wf-page]'),
        siteId: document.querySelector('meta[name="webflow-site-id"]')?.content || null,
        hasWebflowScript: !!Array.from(scripts).find(s => s.src?.includes('webflow'))
      },

      // Resource List (top 20)
      topResources: resources
        .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
        .slice(0, 20)
        .map(r => ({
          name: r.name.split('/').pop(),
          type: r.initiatorType,
          size: r.transferSize || 0,
          duration: Math.round(r.duration)
        }))
    };

    // Convert to JSON
    const jsonString = JSON.stringify(report, null, 2);

    // Create downloadable file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webflow-report-${Date.now()}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('%c✅ Report downloaded successfully!', 'color: #10B981; font-weight: bold; font-size: 14px');
    console.log('Check your Downloads folder for: webflow-report-[timestamp].json');
    console.log('\nReport summary:');
    console.log('- Page load time:', report.performance.pageLoadTime + 'ms');
    console.log('- Total resources:', report.performance.totalResources);
    console.log('- Total page size:', Math.round(report.performance.resourceSizes.total / 1024) + 'KB');
    console.log('- DOM elements:', report.dom.totalElements);

    return report;

  } catch (error) {
    console.error('%c❌ Export failed!', 'color: #EF4444; font-weight: bold');
    console.error('Error:', error.message);
    console.error('Full error:', error);

    console.log('\n%cError details:', 'color: #F59E0B; font-weight: bold');
    console.log('Type:', error.name);
    console.log('Message:', error.message);

    return null;
  }
})();
