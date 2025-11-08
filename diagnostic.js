/**
 * Quick Diagnostic Script
 * Paste this into your browser console to check if Monitor Pro loaded
 */

console.log('%c=== Webflow Monitor Diagnostic ===', 'color: #6366F1; font-size: 16px; font-weight: bold');

// Check if scripts are loaded
console.log('1. Checking for loaded monitors...');
console.log('   Basic Console loaded:', !!window.__WEBFLOW_DEBUG_CONSOLE__);
console.log('   Monitor Pro loaded:', !!window.__WEBFLOW_MONITOR_PRO__);

// Check for any errors
console.log('\n2. Checking for script errors...');
const errors = window.console.error || [];
console.log('   Check above for any red error messages');

// Check if Shadow DOM is supported
console.log('\n3. Browser compatibility check...');
console.log('   Shadow DOM supported:', !!Element.prototype.attachShadow);
console.log('   Performance API available:', !!window.performance);

// Check for existing console elements
console.log('\n4. Looking for console elements...');
const basicHost = document.getElementById('webflow-debug-console-host');
const proHost = document.getElementById('webflow-monitor-pro-host');
console.log('   Basic console element found:', !!basicHost);
console.log('   Pro console element found:', !!proHost);

if (proHost || basicHost) {
  const host = proHost || basicHost;
  console.log('   Element details:', host);
  console.log('   Shadow root attached:', !!host.shadowRoot);
}

// Try to manually trigger
console.log('\n5. Attempting to show console...');
if (proHost && proHost.shadowRoot) {
  const container = proHost.shadowRoot.querySelector('.wm-container');
  if (container) {
    console.log('   Found Pro container, checking visibility...');
    console.log('   Container classes:', container.className);
    console.log('   Is minimized:', container.classList.contains('minimized'));

    // Try to show it
    container.classList.remove('minimized');
    console.log('   ✅ Attempted to show Pro console');
  }
} else if (basicHost && basicHost.shadowRoot) {
  const container = basicHost.shadowRoot.querySelector('.wdc-container');
  if (container) {
    console.log('   Found Basic container, checking visibility...');
    console.log('   Container classes:', container.className);
    console.log('   Is minimized:', container.classList.contains('minimized'));

    // Try to show it
    container.classList.remove('minimized');
    console.log('   ✅ Attempted to show Basic console');
  }
}

console.log('\n%c=== Diagnostic Complete ===', 'color: #10B981; font-size: 14px; font-weight: bold');
console.log('If you see errors above, copy them and share them.');
console.log('If nothing is loaded, the script may not have executed.');
