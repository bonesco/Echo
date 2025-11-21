# Webflow Debug Console (Echo)

A sophisticated, production-ready debugging tool for Webflow websites with a modern, high-end UI inspired by Linear and Raycast.

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 What's New in v3.0 (The Ultimate Release!)

### ⚙️ Settings Panel
- **Customizable Audits**: Toggle individual audits on/off (Performance, Accessibility, SEO, Errors, Network, Webflow, CSS)
- **Custom Performance Thresholds**: Set your own thresholds for LCP, FID, CLS, TTFB, and FCP
- **Performance History Tracking**: Track performance over time with automatic snapshots
- **Persistent Settings**: Your preferences are saved in localStorage

### 🎭 Deep IX2 Analysis
- **Interactions 2.0 Parsing**: Full IX2 engine state analysis
- **Event Detection**: Capture all IX2 events with triggers and actions
- **Action Lists**: Parse action item groups and animation sequences
- **Engine Identification**: Distinguish between IX2, IX1 (Legacy), and Native animations
- **Performance Impact**: See which interactions are affecting page performance

### 📊 Performance History
- **Historical Tracking**: Automatic performance snapshots over time
- **Trend Analysis**: View performance improvements or regressions
- **Score Evolution**: Track your performance score changes
- **Up to 50 Snapshots**: Stored locally with timestamps and URLs

### 🎨 WCAG Color Contrast Analyzer
- **Automatic Contrast Checking**: Analyzes text elements against backgrounds
- **WCAG AA Compliance**: Tests against 4.5:1 (normal text) and 3:1 (large text) standards
- **Smart Background Detection**: Walks up DOM tree to find actual background colors
- **Font Size Awareness**: Adjusts requirements based on text size and weight

## 🎉 What's New in v2.0

- **🔍 Advanced Search**: Real-time search across Errors, Accessibility, SEO, and Network tabs
- **⌨️ Enhanced Keyboard Shortcuts**: New shortcuts for Export (Cmd/Ctrl+Shift+E) and Refresh (Cmd/Ctrl+Shift+R)
- **🎨 Webflow Detection Enhancements**:
  - CMS field bindings (data-w-bind) detection
  - Detailed Webflow Forms analysis
  - E-commerce detection (products, cart)
  - Third-party integrations (Google Analytics, Facebook Pixel, Hotjar, Intercom, Segment)
  - JavaScript library detection (jQuery, GSAP, Swiper, Slick, Vimeo, YouTube)
- **🔒 Custom Code Analysis**: Security issue detection (inline event handlers, document.write, global pollution)
- **♿ Enhanced Accessibility**: Heading hierarchy checks, landmark detection, alt text validation
- **🔎 Comprehensive SEO**: Open Graph, Twitter Cards, canonical URLs, robots meta, HTTPS validation
- **🌐 Smart Network Categorization**: Automatic categorization of Webflow CDN, user uploads, analytics, and third-party resources

## Features

### 🎨 Modern UI/UX
- **Glassmorphic Design**: Frosted glass backgrounds with backdrop-filter blur
- **Dark Theme**: Deep navy/charcoal backgrounds with purple-to-blue gradients
- **Smooth Animations**: 200-300ms cubic-bezier transitions for all interactions
- **Draggable Interface**: Move the console anywhere on screen
- **Minimizable**: Collapse to a floating button in the bottom-right
- **Expandable**: Full-screen view for detailed analysis
- **⚙️ Settings Panel**: Customize audits, thresholds, and options (NEW in v3.0)
- **Keyboard Shortcuts**: `Cmd/Ctrl + Shift + D` to toggle

### 🔍 Webflow-Specific Debugging
- Site ID and environment detection
- Current breakpoint tracking (desktop/tablet/mobile/landscape)
- **🎭 Deep IX2 Analysis**: Full Interactions 2.0 engine parsing (v3.0)
- Active interactions and triggers (IX2, IX1 Legacy, Native animations)
- CMS collection bindings and item counts
- CMS field detection (data-w-bind attributes)
- Webflow Forms analysis (fields, redirects, required fields)
- E-commerce detection (products, cart configuration)
- Third-party integrations (Google Analytics, Facebook Pixel, Hotjar, etc.)
- JavaScript library detection (jQuery, GSAP, Swiper, Vimeo, YouTube)
- Custom code analysis (security issues, performance anti-patterns)
- Custom code block detection (head/body/embed)
- Webflow.js version identification

### ⚡ Performance Monitoring
- **📊 Performance History**: Track metrics over time with automatic snapshots (v3.0)
- **⚙️ Custom Thresholds**: Set your own performance goals (v3.0)
- **Core Web Vitals**:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
- **Load Metrics**:
  - Page load time
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
  - DOM Content Loaded
- **Resource Analysis**:
  - Total page weight
  - Asset breakdown (JS/CSS/images/fonts)
  - HTTP request count
  - Visual performance graphs

### 🐛 Error Tracking
- Real-time JavaScript error capture
- Console error monitoring
- Uncaught exception handling
- Unhandled promise rejection tracking
- Stack trace display
- Toast notifications for new errors

### ♿ Accessibility Auditing
- **🎨 WCAG Color Contrast Analyzer**: Automatic contrast ratio checking (v3.0)
- Missing alt tags on images
- Empty alt attributes
- Alt text length validation (max 125 chars)
- Missing form labels
- Missing ARIA labels on buttons
- Heading hierarchy validation (no skipped levels)
- Missing landmark elements (main, nav)
- Links without href or empty text
- Form input accessibility checks

### 🔎 SEO Analysis
- Meta title presence and length validation (30-60 chars)
- Meta description optimization (120-160 chars)
- **NEW:** Canonical URL validation
- **NEW:** Open Graph tags (og:title, og:description, og:image)
- **NEW:** Twitter Card tags
- **NEW:** Robots meta tag detection
- **NEW:** Language attribute validation
- **NEW:** Viewport meta tag check
- **NEW:** Favicon presence
- **NEW:** HTTPS usage validation
- H1 tag usage (should be exactly one)
- Broken image detection
- Image optimization opportunities

### 🌐 Network Monitoring
- All HTTP requests tracking
- Failed requests (404s, 500s)
- Slow-loading assets (>3s)
- Resource size and duration
- **NEW:** Smart resource categorization:
  - Webflow CDN resources
  - User-uploaded assets
  - Third-party scripts
  - Analytics/tracking
  - Fonts and icons
  - Images, stylesheets, scripts
- **NEW:** Search functionality on network requests

### 🎯 CSS/Layout Issue Detection
- Horizontal overflow detection
- Z-index conflict identification
- Element positioning issues

### 📊 Export Functionality
- Comprehensive HTML reports
- Executive summary with charts
- Issue categorization by severity
- Recommendations with priority levels
- Downloadable reports with timestamp

## Installation

### Method 1: Bookmarklet (Recommended)

1. **Create a bookmarklet**:
   - Copy the code from `bookmarklet.js`
   - Create a new bookmark in your browser
   - Name it "Webflow Debug"
   - Paste the code as the URL

2. **Use it**:
   - Navigate to any Webflow website
   - Click the bookmarklet
   - The debug console will appear

### Method 2: Browser Console Injection

1. **Copy the script**:
   - Open `webflow-debug-console.js`
   - Copy the entire content

2. **Inject it**:
   - Open your browser's Developer Tools (F12)
   - Go to the Console tab
   - Paste the code and press Enter

### Method 3: Script Tag Injection

Add this to your Webflow site's custom code (for development only):

```html
<script src="https://your-cdn.com/webflow-debug-console.js"></script>
```

## Usage

### Keyboard Shortcuts

- **`Cmd/Ctrl + Shift + D`**: Toggle minimize/maximize console
- **`Cmd/Ctrl + Shift + E`**: Export report (NEW)
- **`Cmd/Ctrl + Shift + R`**: Refresh all audits (NEW)
- **Click issues**: Highlights the element on the page
- **Scroll to element**: Automatically scrolls to problematic elements

### Navigation

The console features a tabbed interface:

1. **Overview**: Dashboard with key metrics and performance score
2. **Performance**: Detailed performance metrics with visual graphs
3. **Errors**: JavaScript errors with stack traces
4. **Accessibility**: Accessibility issues and recommendations
5. **SEO**: SEO audit results
6. **Network**: All network requests and failed loads
7. **Webflow Config**: Webflow-specific configuration and settings

### Actions

- **Minimize**: Click the minimize button (−) to collapse to a small floating button
- **Expand**: Click the expand button (⛶) for full-screen view
- **Export Report**: Generate and download a comprehensive HTML report
- **Close**: Click the × button to remove the console

### Working with Issues

1. **Click on any issue** to expand details
2. **See the element selector** for CSS/layout issues
3. **View stack traces** for JavaScript errors
4. **Automatically scroll** to problematic elements

## Technical Details

### Architecture

- **Pure JavaScript (ES6+)**: No external dependencies
- **Shadow DOM**: Isolated styles prevent conflicts with host page
- **Native Browser APIs**:
  - Performance API for metrics
  - MutationObserver for DOM changes
  - PerformanceObserver for Core Web Vitals

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Score Calculation

The overall performance score (0-100) is calculated based on:

- **LCP** (Largest Contentful Paint): -20 points if > 2500ms
- **FID** (First Input Delay): -15 points if > 100ms
- **CLS** (Cumulative Layout Shift): -15 points if > 0.1
- **FCP** (First Contentful Paint): -10 points if > 1800ms
- **TTFB** (Time to First Byte): -10 points if > 600ms
- **Total Size**: -10 points if > 3MB
- **Request Count**: -10 points if > 100 requests
- **Page Load Time**: -10 points if > 3000ms

### Score Interpretation

- **90-100**: Excellent performance
- **70-89**: Good performance
- **50-69**: Needs improvement
- **0-49**: Poor performance

## Issue Severity Levels

### Error (Red)
Critical issues that must be fixed:
- Missing page title
- Missing form labels
- JavaScript errors
- Broken images

### Warning (Amber)
Important issues that should be addressed:
- Multiple H1 tags
- Missing alt tags
- Title/description too long
- Horizontal overflow

### Info (Blue)
Optimization opportunities:
- Image optimization
- Z-index values
- Performance suggestions

## Export Reports

The exported HTML report includes:

1. **Executive Summary**:
   - Overall performance score with visual ring chart
   - Key metrics in summary cards
   - Total issue count

2. **Categorized Issues**:
   - JavaScript errors with stack traces
   - Accessibility violations
   - SEO problems
   - Performance metrics

3. **Recommendations**:
   - Prioritized action items
   - Best practices
   - Optimization tips

4. **Metadata**:
   - Timestamp
   - URL
   - Environment information

## Quick Start Example

```javascript
// Open browser console on any Webflow site and paste:
// (Copy the entire content of webflow-debug-console.js)

// Or use the bookmarklet:
// 1. Create a new bookmark
// 2. Set the URL to the code in bookmarklet.js
// 3. Click the bookmark on any Webflow page
```

## Best Practices

### When to Use

✅ **Good Use Cases**:
- Debugging Webflow sites during development
- Performing site audits
- Identifying performance bottlenecks
- Checking accessibility compliance
- SEO optimization
- Client site reviews

❌ **Not Recommended**:
- Production sites (remove before publishing)
- Sites with sensitive data
- As a permanent monitoring solution

### Privacy & Security

- The console runs entirely in the browser
- No data is sent to external servers
- All analysis is performed client-side
- Reports are generated locally

## Troubleshooting

### Console doesn't appear

1. Check the browser console for errors
2. Ensure JavaScript is enabled
3. Verify the script loaded successfully
4. Try refreshing the page

### Performance metrics show 0

- Metrics may take a few seconds to populate
- Some metrics require user interaction (FID)
- Refresh the page with the console active

### Issues not detected

- Some audits require page interaction
- DOM mutations may take time to process
- Try switching tabs to force a re-render

## License

MIT License - feel free to use in your projects!

## Credits

Created with ❤️ for the Webflow community

Inspired by:
- Linear's design system
- Raycast's UI patterns
- Chrome DevTools
- Lighthouse audits

---

**Made for Webflow Developers** | **No External Dependencies** | **Privacy-First** 
