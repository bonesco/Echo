// Webflow Monitor Pro - Premium Enhanced Loader
// This loads Monitor Pro with premium UI enhancements applied directly to the source

(async function() {
  console.log('⏳ Loading Monitor Pro with Premium enhancements...');

  try {
    // Fetch the Monitor Pro source code
    const response = await fetch('https://raw.githubusercontent.com/bonesco/Echo/claude/webflow-debug-console-011CUuh6cWPCKN5y4QMb9NnZ/webflow-monitor-pro.js');
    let code = await response.text();

    // Enhance the CSS with premium styling
    code = code.replace(
      /\.wm-container\s*\{[^}]*\}/,
      `.wm-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 700px;
          background: linear-gradient(135deg,
            rgba(10, 15, 30, 0.98) 0%,
            rgba(20, 25, 45, 0.98) 50%,
            rgba(15, 20, 40, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.03),
            0 24px 48px -12px rgba(0, 0, 0, 0.6),
            0 0 100px -20px rgba(99, 102, 241, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          z-index: 999999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }`
    );

    // Enhance primary button with premium gradient
    code = code.replace(
      /\.wm-btn-primary\s*\{[^}]*\}/,
      `.wm-btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }`
    );

    // Enhance button hover effects
    code = code.replace(
      /\.wm-btn-primary:hover\s*\{[^}]*\}/,
      `.wm-btn-primary:hover {
          background: linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #C026D3 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
        }`
    );

    // Enhance header with better glassmorphism
    code = code.replace(
      /\.wm-header\s*\{[^}]*\}/,
      `.wm-header {
          background: linear-gradient(135deg,
            rgba(30, 41, 59, 0.4) 0%,
            rgba(51, 65, 85, 0.3) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03);
        }`
    );

    // Enhance logo with shimmer effect
    code = code.replace(
      /\.wm-logo\s*\{[^}]*\}/,
      `.wm-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          margin-right: 12px;
          box-shadow:
            0 4px 12px rgba(99, 102, 241, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .wm-logo::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }`
    );

    // Enhance tabs with better hover states
    code = code.replace(
      /\.wm-tab:hover\s*\{[^}]*\}/,
      `.wm-tab:hover {
          background: rgba(99, 102, 241, 0.1);
          border-bottom: 2px solid rgba(99, 102, 241, 0.5);
          color: #A5B4FC;
          transform: translateY(-1px);
        }`
    );

    // Enhance active tab
    code = code.replace(
      /\.wm-tab\.active\s*\{[^}]*\}/,
      `.wm-tab.active {
          background: rgba(99, 102, 241, 0.15);
          border-bottom: 2px solid #6366F1;
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
        }`
    );

    // Enhance metric cards
    code = code.replace(
      /\.wm-metric-card\s*\{[^}]*\}/,
      `.wm-metric-card {
          background: linear-gradient(135deg,
            rgba(30, 41, 59, 0.5) 0%,
            rgba(51, 65, 85, 0.3) 100%);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .wm-metric-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }`
    );

    // Inject the enhanced code
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);

    console.log('✨ Monitor Pro loaded with Premium UI!');
    console.log('💡 Press Cmd/Ctrl+Shift+D to open');

    // Auto-export after 3 seconds
    setTimeout(() => {
      if (window.webflowMonitor) {
        console.log('📊 Auto-exporting report...');
        window.webflowMonitor.exportReport();
      }
    }, 3000);

  } catch (error) {
    console.error('❌ Failed to load:', error);
  }
})();
