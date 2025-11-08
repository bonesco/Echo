/**
 * Webflow Debug Console - Bookmarklet Version
 *
 * To use as a bookmarklet:
 * 1. Copy the minified code below
 * 2. Create a new bookmark in your browser
 * 3. Paste the code as the bookmark URL
 * 4. Click the bookmark on any Webflow site to activate the debug console
 */

javascript:(function(){if(window.__WEBFLOW_DEBUG_CONSOLE__){console.log('Webflow Debug Console already active');return;}const script=document.createElement('script');script.src='https://your-domain.com/webflow-debug-console.js';document.head.appendChild(script);})();

/**
 * For local development/testing, you can load from a local file:
 *
 * javascript:(function(){if(window.__WEBFLOW_DEBUG_CONSOLE__){console.log('Webflow Debug Console already active');return;}fetch('http://localhost:8000/webflow-debug-console.js').then(r=>r.text()).then(code=>{const script=document.createElement('script');script.textContent=code;document.head.appendChild(script);});})();
 *
 * Or embed the entire script inline (recommended for bookmarklet):
 * Copy the entire content of webflow-debug-console.js and wrap it in:
 * javascript:(function(){YOUR_CODE_HERE})();
 */
