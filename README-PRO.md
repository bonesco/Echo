# Webflow Monitor Pro 🚀

**Advanced monitoring and debugging tool for professional Webflow development**

An enterprise-grade monitoring solution that extends the base Webflow Debug Console with advanced features for performance tracking, GSAP monitoring, video optimization, user behavior analytics, and memory leak detection.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🆕 What's New in Pro

### Professional Features

✨ **GSAP Animation Monitoring**
- Track all GSAP timelines and their states
- Monitor ScrollTrigger instances in real-time
- Detect plugin usage and conflicts
- Animation performance metrics with FPS tracking

🎬 **Video Performance Tracking**
- Vimeo and YouTube player detection
- Load time monitoring
- Player API availability
- Multi-video performance impact analysis

🖱️ **User Behavior Analytics**
- **Click Rage Detection**: Identifies user frustration from rapid repeated clicks
- **Dead Clicks**: Finds clicks on non-interactive elements
- **Scroll Depth**: Tracks how far users actually scroll
- **Viewport Intersection**: Measures visibility of key elements

💾 **Memory & Performance**
- Real-time memory usage tracking
- Memory leak detection
- FPS counter with visual graph
- Animation jank detection (dropped frames)

📊 **Advanced DOM Analysis**
- Track querySelector usage (find expensive queries)
- Monitor DOM mutations in real-time
- DOM size and depth analysis
- Detect excessive reflows/repaints

🔧 **Script Intelligence**
- Detect duplicate script loading
- Global variable pollution tracking
- Console hijacking detection
- Third-party script impact analysis
- Script load timing and size analysis

---

## 🎯 Feature Comparison

| Feature | Basic Console | Monitor Pro |
|---------|--------------|-------------|
| Performance Metrics (Core Web Vitals) | ✅ | ✅ |
| Error Tracking | ✅ | ✅✨ Enhanced |
| Accessibility Audit | ✅ | ✅ |
| SEO Analysis | ✅ | ✅ |
| Network Monitoring | ✅ | ✅✨ Enhanced |
| **FPS Counter** | ❌ | ✅ Real-time overlay |
| **GSAP Monitoring** | ❌ | ✅ Full tracking |
| **Video Tracking** | ❌ | ✅ Vimeo/YouTube |
| **Click Analytics** | ❌ | ✅ Rage & dead clicks |
| **Scroll Depth** | ❌ | ✅ Full tracking |
| **Memory Monitoring** | ❌ | ✅ With leak detection |
| **DOM Performance** | ❌ | ✅ Query tracking |
| **Script Analysis** | ❌ | ✅ Duplicates & pollution |
| **Console Hijack Detection** | ❌ | ✅ |
| **Environment Detection** | ❌ | ✅ Dev/Staging/Prod |
| **Color-Coded Console** | ❌ | ✅ |

---

## 📥 Installation

### Quick Start (Browser Console)

```javascript
// Paste this into your browser console
fetch('https://your-cdn.com/webflow-monitor-pro.js')
  .then(r => r.text())
  .then(code => {
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);
  });
```

### Bookmarklet

```javascript
javascript:(function(){if(window.__WEBFLOW_MONITOR_PRO__){alert('Already active!');return;}fetch('https://your-cdn.com/webflow-monitor-pro.js').then(r=>r.text()).then(code=>{const script=document.createElement('script');script.textContent=code;document.head.appendChild(script);});})();
```

### With Configuration

```javascript
// Custom configuration
fetch('webflow-monitor-pro.js')
  .then(r => r.text())
  .then(code => {
    // Inject with custom config
    const config = {
      enableLogging: true,
      logLevel: 'all',
      trackGSAP: true,
      trackVideos: true,
      trackClicks: true,
      trackScroll: true,
      trackMemory: true,
      showFPS: true
    };

    const script = document.createElement('script');
    script.textContent = code.replace(
      'new WebflowMonitorPro()',
      `new WebflowMonitorPro(${JSON.stringify(config)})`
    );
    document.head.appendChild(script);
  });
```

---

## ⌨️ Keyboard Shortcuts

- **`Cmd/Ctrl + Shift + D`**: Toggle main console
- **`Cmd/Ctrl + Shift + F`**: Toggle FPS overlay

---

## 🎨 UI Tabs Overview

### 1. **Overview** 📊
- Performance score (0-100)
- Current FPS
- Error count
- DOM size
- Memory usage
- Script count
- Quick summary of GSAP, videos, clicks

### 2. **Performance** ⚡
- Core Web Vitals (LCP, FID, CLS, TTFB, FCP)
- Resource breakdown (JS, CSS, Images, Fonts)
- Performance scores with color coding

### 3. **GSAP** ✨ *(New)*
- GSAP version and plugins
- Active timelines with progress
- ScrollTrigger instances and states
- Animation performance metrics

### 4. **Videos** 🎬 *(New)*
- Vimeo/YouTube player detection
- Load times
- Player status
- Performance impact

### 5. **Errors** 🔴
- All JavaScript errors
- Stack traces
- Timestamp
- Color-coded by severity

### 6. **DOM** 🌳 *(New)*
- DOM size and depth
- Mutation count
- Most queried selectors
- Performance insights

### 7. **Clicks** 🖱️ *(New)*
- Click rage events (user frustration indicator)
- Dead clicks (non-interactive elements)
- Detailed analytics

### 8. **Scroll** 📜 *(New)*
- Current scroll position
- Maximum scroll depth percentage
- Scroll depth visualization

### 9. **Memory** 💾 *(New)*
- Current memory usage
- Memory snapshots over time
- Potential leak detection
- Timeline visualization

### 10. **Scripts** 📦 *(New)*
- All loaded scripts
- Duplicate detection
- Global variable pollution
- Script sizes and types

### 11. **Network** 🌐
- All HTTP requests
- Failed requests
- Slow assets (>3s)
- Resource details

### 12. **Console** 💬 *(New)*
- Real-time console output
- Color-coded messages
- Log/Warn/Error/Info separation

---

## 🎯 Advanced Features Explained

### Click Rage Detection

Detects when users rapidly click the same element (5+ clicks within 1 second), indicating frustration. This often means:
- Button not working
- Form not submitting
- Loading state not showing
- Broken interaction

**Example Output:**
```
🔥 Click rage detected on: button.submit-btn
Clicks: 7 in 0.8s
```

### Dead Click Detection

Identifies clicks on elements that have no event listeners or functionality. Suggests:
- Users expect something to be clickable
- UI/UX confusion
- Missing interaction states

### Scroll Depth Tracking

Measures how far users scroll:
- **0-25%**: Above the fold only
- **25-50%**: Moderate engagement
- **50-75%**: Good engagement
- **75-100%**: Full page read

### Memory Leak Detection

Monitors heap size over time and alerts when memory grows >10MB without GC:
```
⚠️ Potential memory leak detected
Growth: 15.3 MB over 50 seconds
```

### GSAP Performance Tracking

Monitors GSAP-specific metrics:
- Timeline progress and state
- ScrollTrigger positions
- Animation FPS during playback
- Plugin conflicts

### FPS Counter

Real-time frame rate monitoring:
- **Green**: 55-60 FPS (smooth)
- **Orange**: 30-54 FPS (acceptable)
- **Red**: <30 FPS (janky)

Includes visual graph showing last 60 frames.

---

## 📊 Performance Scoring

The Pro version uses an enhanced algorithm:

```
Starting Score: 100

Deductions:
- LCP > 2500ms: -20 points
- FID > 100ms: -15 points
- CLS > 0.1: -15 points
- FCP > 1800ms: -10 points
- TTFB > 600ms: -10 points
- Page size > 3MB: -10 points
- Requests > 100: -10 points
- Load time > 3s: -10 points

Final Score: 0-100
```

**Score Interpretation:**
- **90-100**: 🟢 Excellent - Production ready
- **70-89**: 🟡 Good - Minor optimizations needed
- **50-69**: 🟠 Needs Improvement - Optimization required
- **0-49**: 🔴 Poor - Critical issues

---

## 🚀 Usage Examples

### Example 1: Debug GSAP Animations

```javascript
// Monitor shows:
- GSAP 3.12.2 loaded
- 5 active timelines
- 3 ScrollTrigger instances
- Average 58 FPS during animations
- ScrollTrigger #1: .hero-section, progress 45%
```

### Example 2: Detect User Frustration

```javascript
// After detecting click rage:
Click Rage Event: button.cta-button
Count: 6 clicks in 0.9s
→ Check if button is actually working
→ Add loading state
→ Improve feedback
```

### Example 3: Find Performance Bottlenecks

```javascript
// DOM tab shows:
Most Queried Selectors:
1. .card-item - 847 queries
2. #main-nav - 623 queries
3. .product-grid - 412 queries

→ Cache these selectors
→ Reduce DOM queries in loops
```

### Example 4: Optimize Video Loading

```javascript
// Videos tab shows:
Vimeo Player #1: 2.3s load time
Vimeo Player #2: 2.1s load time
YouTube Player #1: 1.8s load time

→ Total 6.2s for video players
→ Consider lazy loading
→ Load on interaction instead of page load
```

---

## 🔧 Configuration Options

```javascript
const config = {
  // General
  enableLogging: true,          // Console logging
  logLevel: 'all',              // 'errors', 'warnings', 'all'
  environment: 'auto',          // 'development', 'staging', 'production', 'auto'

  // Feature toggles
  trackPerformance: true,       // Core Web Vitals
  trackGSAP: true,             // GSAP monitoring
  trackVideos: true,           // Video players
  trackClicks: true,           // Click rage & dead clicks
  trackScroll: true,           // Scroll depth
  trackMemory: true,           // Memory usage
  showFPS: true,               // FPS overlay

  // Advanced
  reportingEndpoint: null,      // Send data to your server
  performanceBudget: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600
  }
};
```

---

## 📤 Export & Reporting

### Export JSON Report

Click "Export Report" to download a comprehensive JSON file containing:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "url": "https://yoursite.com",
  "environment": "production",
  "performanceScore": 87,
  "data": {
    "performance": { ... },
    "gsap": { ... },
    "videos": [ ... ],
    "errors": [ ... ],
    "clicks": { ... },
    "memory": { ... },
    // ... all monitoring data
  }
}
```

### Send to Server (Optional)

```javascript
const config = {
  reportingEndpoint: 'https://your-api.com/analytics',
  // Data will be POSTed automatically
};
```

---

## 🎓 Best Practices

### For Development

```javascript
✅ DO:
- Use full monitoring (all features enabled)
- Keep FPS overlay visible
- Monitor click rage during testing
- Check memory after major interactions
- Export reports before deployments

❌ DON'T:
- Ignore click rage events
- Skip memory monitoring
- Disable error tracking
```

### For Staging

```javascript
✅ DO:
- Run full audits before production
- Test with realistic content
- Monitor video performance
- Check script duplicates
- Validate GSAP animations

❌ DON'T:
- Deploy with known errors
- Ignore performance score < 70
- Leave debug code active
```

### For Production

```javascript
✅ DO:
- Remove or disable monitor
- Use lightweight basic console if needed
- Monitor only critical metrics
- Sample data (not every session)

❌ DON'T:
- Leave full Pro monitor active
- Track all clicks in production
- Enable verbose logging
- Collect PII data
```

---

## 🔍 Troubleshooting

### FPS Counter Not Showing

```bash
# Press Cmd/Ctrl+Shift+F to toggle
# Or check config:
showFPS: true
```

### GSAP Not Detected

```bash
# Ensure GSAP loads before the monitor
<script src="gsap.min.js"></script>
<script src="webflow-monitor-pro.js"></script>
```

### High Memory Usage

```bash
# The monitor itself uses ~10-15MB
# Disable features you don't need:
trackMemory: false,
trackScroll: false
```

### Console Errors About Observers

```bash
# Some browsers don't support all APIs
# Errors are caught gracefully
# Check browser compatibility
```

---

## 🌟 Pro Tips

1. **Use Environment Detection**: The monitor auto-detects dev/staging/production and adjusts verbosity

2. **Monitor Click Rage**: This is one of the most valuable UX insights - fix these elements first

3. **Cache Queries**: Check the DOM tab for repeated queries - cache these selectors

4. **Watch FPS During Animations**: If FPS drops below 30 during GSAP animations, optimize

5. **Duplicate Scripts**: Even one duplicate can significantly slow your site

6. **Memory Snapshots**: Look for steady growth over time - indicates memory leaks

7. **Export Reports**: Keep a record before and after optimizations to measure impact

8. **Scroll Depth**: If users aren't scrolling past 25%, your above-fold content needs work

---

## 📝 Changelog

### v2.0.0 (Current)
- ✨ GSAP monitoring
- ✨ Video performance tracking
- ✨ Click rage detection
- ✨ Dead click detection
- ✨ Scroll depth tracking
- ✨ Memory leak detection
- ✨ FPS counter with graph
- ✨ DOM query tracking
- ✨ Script duplicate detection
- ✨ Global variable pollution tracking
- ✨ Console hijacking detection
- ✨ Environment auto-detection
- ✨ Enhanced UI with 12 tabs
- ✨ Color-coded console output
- ✨ JSON export

### v1.0.0
- Initial release with basic features

---

## 🤝 Support

Need help? Found a bug?
- Check the [main README](README.md) for basics
- Review examples in `demo-pro.html`
- Open an issue on GitHub

---

## 📄 License

MIT License - Use freely in your projects!

---

**Webflow Monitor Pro** - Professional monitoring for professional developers.

Made with ❤️ for the Webflow community.
