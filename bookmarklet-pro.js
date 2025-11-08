/**
 * BOOKMARKLET - Webflow Monitor Pro (Working Version)
 *
 * CREATE A BOOKMARK WITH THIS AS THE URL:
 */

javascript:(function(){if(window.__WEBFLOW_MONITOR_PRO__){const h=document.getElementById('webflow-monitor-pro-host');if(h?.shadowRoot){const c=h.shadowRoot.querySelector('.wm-container');c?.classList.toggle('minimized');}return;}console.log('Loading Monitor Pro...');fetch('https://raw.githubusercontent.com/bonesco/Echo/claude/webflow-debug-console-011CUuh6cWPCKN5y4QMb9NnZ/webflow-monitor-pro.js').then(r=>r.text()).then(code=>{code=code.replace(/exportReport\(\)\s*{[\s\S]*?console\.log\('%c✅ Report exported successfully'/,`exportReport(){try{const cleanData=obj=>{if(!obj)return obj;if(Array.isArray(obj))return obj.map(item=>{if(item instanceof Element||item instanceof Node)return null;if(typeof item==='object')return cleanData(item);return item;}).filter(x=>x!==null);if(typeof obj==='object'){const cleaned={};for(const key in obj){if(obj[key]instanceof Element||obj[key]instanceof Node)continue;if(key==='element'||key==='timeline')continue;if(typeof obj[key]==='object'){cleaned[key]=cleanData(obj[key]);}else{cleaned[key]=obj[key];}}return cleaned;}return obj;};const report={timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,viewport:{width:window.innerWidth,height:window.innerHeight},environment:this.config.environment,performanceScore:this.calculatePerformanceScore(),data:cleanData(this.data)};const jsonStr=JSON.stringify(report,null,2);const blob=new Blob([jsonStr],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=\`webflow-monitor-\${Date.now()}.json\`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);console.log('%c✅ Report exported successfully'`);const s=document.createElement('script');s.textContent=code;document.head.appendChild(s);console.log('Monitor Pro loaded!');}).catch(e=>alert('Failed to load: '+e.message));})();

/**
 * USAGE:
 * 1. Create a new bookmark in your browser
 * 2. Name it: "Webflow Monitor Pro"
 * 3. Copy EVERYTHING above starting with "javascript:(function()..." up to and including the final "})();"
 * 4. Paste it as the bookmark URL
 * 5. Click the bookmark on any Webflow site
 *
 * The bookmarklet will:
 * - Load Monitor Pro from GitHub
 * - Fix the export functionality
 * - Toggle if already loaded
 */
