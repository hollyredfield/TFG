import { useEffect, useRef } from 'react';

// Enhanced performance monitoring
const performanceMetrics = {
  componentRenders: new Map(),
  stateChanges: new Map(),
  apiCalls: new Map(),
  visualGlitches: [],
  blackScreens: [],
  errors: [],
  componentTree: new Map(),
  renderTimes: new Map(),
  networkRequests: [],
  resourceLoading: new Map(),
  memoryUsage: [],
  fps: [],
};

// Prevent infinite recursion
let isLogging = false;
const MAX_ERROR_DEPTH = 3;
let errorDepth = 0;

// Advanced component state tracker with dependency graph
const componentStates = new Map();
const componentDependencyGraph = new Map();
const stateChangeHistory = new Map();

// Enhanced error tracking with cascade detection
const errorMap = new Map();
const errorCascades = new Map();
const errorPatterns = new Set();

// Utility functions
const captureScreenshot = () => {
  // Implement screenshot capture logic here if needed
  return 'Screenshot capture not implemented';
};

const captureDOMState = () => {
  return {
    elementCount: document.getElementsByTagName('*').length,
    visibility: document.visibilityState,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    focusedElement: document.activeElement?.tagName
  };
};

const analyzeVisualGlitch = (issueInfo) => {
  // Analyze the visual glitch
  return {
    type: issueInfo.type,
    frequency: issueInfo.analysis?.frequency || 0,
    affectedElements: issueInfo.analysis?.affectedElements || [],
    possibleCauses: []
  };
};

// Core logging functions
const safeConsoleError = console.error;

export const logError = (type, error, context = {}) => {
  if (isLogging || errorDepth >= MAX_ERROR_DEPTH) {
    safeConsoleError('[SmartLogger] Prevented recursive error:', { type, error });
    return null;
  }
  
  try {
    isLogging = true;
    errorDepth++;
    
    const errorInfo = {
      timestamp: new Date(),
      type,
      message: error.message,
      stack: error.stack,
      context,
      analysis: findTrueErrorSource(error, errorDepth)
    };
    
    errorMap.set(error.message, errorInfo);
    safeConsoleError('[SmartLogger] Error:', {
      ...errorInfo,
      recommendations: generateErrorRecommendations(errorInfo)
    });
    
    return errorInfo;
  } finally {
    isLogging = false;
    errorDepth--;
  }
};

export const logVisualIssue = (type, error, analysis = {}) => {
  if (isLogging) return null;
  
  try {
    isLogging = true;
    
    const issueInfo = {
      timestamp: new Date(),
      type,
      message: error.message,
      screenshot: captureScreenshot(),
      domState: captureDOMState(),
      analysis
    };
    
    if (type === 'black-screen') {
      performanceMetrics.blackScreens.push(issueInfo);
    } else {
      performanceMetrics.visualGlitches.push(issueInfo);
      analyzeVisualGlitch(issueInfo);
    }
    
    safeConsoleError('[SmartLogger] Visual Issue:', issueInfo);
    return issueInfo;
  } finally {
    isLogging = false;
  }
};

export const logComponentState = (componentName, state) => {
  if (isLogging) return;
  
  try {
    isLogging = true;
    componentStates.set(componentName, {
      timestamp: new Date(),
      state,
      renderCount: (componentStates.get(componentName)?.renderCount || 0) + 1
    });
  } finally {
    isLogging = false;
  }
};

// Visual monitoring with advanced detection
const visualMonitor = {
  previousFrames: [],
  frameAnalysis: new Map(),
  
  checkBlackScreen: () => {
    if (isLogging) return;
    
    const body = document.body;
    const html = document.documentElement;
    
    try {
      const domSnapshot = {
        structure: captureDOMStructure(),
        styles: captureComputedStyles(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        }
      };

      // Enhanced black screen detection
      const isBlack = window.getComputedStyle(body).backgroundColor === 'rgb(0, 0, 0)' ||
                     window.getComputedStyle(html).backgroundColor === 'rgb(0, 0, 0)';
                      
      const hasContent = body.children.length > 0;
      const hasVisibleElements = Array.from(document.getElementsByTagName('*'))
        .some(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 style.opacity !== '0' &&
                 rect.width > 0 &&
                 rect.height > 0 &&
                 style.backgroundColor !== 'rgb(0, 0, 0)';
        });
      
      if (isBlack || !hasContent || !hasVisibleElements) {
        const error = new Error('Black screen detected');
        const analysis = analyzeBlackScreenCause(domSnapshot);
        
        logVisualIssue('black-screen', error, {
          ...analysis,
          timestamp: Date.now(),
          visibleElements: hasVisibleElements,
          totalElements: document.getElementsByTagName('*').length,
          documentState: {
            readyState: document.readyState,
            loadingResources: performanceMetrics.resourceLoading.size > 0
          }
        });

        // Auto-attempt fixes
        attemptBlackScreenFixes(analysis);
      }
    } catch (e) {
      console.warn('[SmartLogger] Error during black screen check:', e);
    }
  },
  
  // ...rest of visualMonitor methods...
};

// Enhanced black screen detection and analysis
const analyzeBlackScreenCause = (domSnapshot) => {
  const causes = [];
  const criticalElements = new Set(['#root', '.app-container', 'main', '.content']);
  
  try {
    // Check React root
    const rootElement = document.getElementById('root');
    if (!rootElement || !rootElement.children.length) {
      causes.push({
        type: 'react-mount',
        severity: 'critical',
        message: 'React root element is empty or not mounted',
        location: 'root mounting point'
      });
    }

    // Check content visibility
    criticalElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        const styles = window.getComputedStyle(element);
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' && 
                         styles.opacity !== '0';
        const hasSize = element.offsetWidth > 0 && element.offsetHeight > 0;
        
        if (!isVisible || !hasSize) {
          causes.push({
            type: 'visibility',
            severity: 'high',
            message: `Element ${selector} is not visible`,
            element: {
              selector,
              styles: {
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                width: element.offsetWidth,
                height: element.offsetHeight
              }
            }
          });
        }
      }
    });

    // Check CSS loading
    const styleSheets = Array.from(document.styleSheets);
    const cssLoadingIssues = styleSheets.filter(sheet => {
      try {
        return !sheet.cssRules;
      } catch (e) {
        return true;
      }
    });

    if (cssLoadingIssues.length > 0) {
      causes.push({
        type: 'css-loading',
        severity: 'high',
        message: 'CSS files failed to load properly',
        details: cssLoadingIssues.map(sheet => sheet.href)
      });
    }

    // Check for rendering errors
    const errorElements = document.querySelectorAll('[data-error], .error, .error-boundary');
    if (errorElements.length > 0) {
      causes.push({
        type: 'render-error',
        severity: 'critical',
        message: 'Found error elements in the DOM',
        elements: Array.from(errorElements).map(el => ({
          className: el.className,
          id: el.id,
          text: el.textContent
        }))
      });
    }

    // Check z-index stacking
    const elementsByZIndex = new Map();
    document.querySelectorAll('*').forEach(el => {
      const zIndex = window.getComputedStyle(el).zIndex;
      if (zIndex !== 'auto') {
        const zValue = parseInt(zIndex);
        if (!elementsByZIndex.has(zValue)) {
          elementsByZIndex.set(zValue, []);
        }
        elementsByZIndex.get(zValue).push({
          selector: el.tagName.toLowerCase() + 
                   (el.id ? `#${el.id}` : '') + 
                   (el.className ? `.${el.className.split(' ').join('.')}` : ''),
          styles: {
            position: window.getComputedStyle(el).position,
            background: window.getComputedStyle(el).background
          }
        });
      }
    });

    // Check for blocking overlays
    const highZIndexElements = Array.from(elementsByZIndex.entries())
      .filter(([z, elements]) => z > 1000)
      .map(([z, elements]) => elements)
      .flat();

    if (highZIndexElements.length > 0) {
      causes.push({
        type: 'overlay',
        severity: 'medium',
        message: 'Found potential blocking overlays',
        elements: highZIndexElements
      });
    }

    return {
      causes,
      recommendations: generateBlackScreenRecommendations(causes),
      domSnapshot
    };
  } catch (e) {
    console.warn('[SmartLogger] Error analyzing black screen:', e);
    return { causes: [], error: e };
  }
};

const generateBlackScreenRecommendations = (causes) => {
  const recommendations = [];

  causes.forEach(cause => {
    switch (cause.type) {
      case 'react-mount':
        recommendations.push({
          action: 'Check React initialization',
          steps: [
            'Verify main.jsx is properly importing App component',
            'Check for errors in React.StrictMode',
            'Verify root element exists in index.html'
          ]
        });
        break;
      
      case 'visibility':
        recommendations.push({
          action: 'Fix visibility issues',
          steps: [
            `Check CSS for "${cause.element.selector}"`,
            'Verify z-index stacking',
            'Check parent elements visibility'
          ]
        });
        break;
      
      case 'css-loading':
        recommendations.push({
          action: 'Fix CSS loading',
          steps: [
            'Verify CSS file paths',
            'Check for CSS syntax errors',
            'Verify bundler configuration'
          ]
        });
        break;
      
      case 'render-error':
        recommendations.push({
          action: 'Fix rendering errors',
          steps: [
            'Check error boundaries',
            'Verify component props',
            'Check for null/undefined values'
          ]
        });
        break;
    }
  });

  return recommendations;
};

// Advanced error source mapping
const findTrueErrorSource = (error, depth = 0) => {
  if (depth >= MAX_ERROR_DEPTH) return null;
  
  const stack = error.stack?.split('\n') || [];
  const sources = new Set();
  const relatedComponents = new Set();
  
  try {
    // Enhanced stack analysis
    stack.forEach(line => {
      const match = line.match(/(?:\((.*?):(\d+):(\d+)\))|(?:at\s+(?:.*?\s+)?\(?([^)]*):(\d+):(\d+)\)?)/);
      if (match) {
        const [_, file1, line1, col1, file2, line2, col2] = match;
        const file = file1 || file2;
        const line = parseInt(line1 || line2);
        const column = parseInt(col1 || col2);
        
        if (file && !file.includes('node_modules')) {
          sources.add({ file, line, column });
        }
      }
    });
    
    return {
      sources: Array.from(sources),
      relatedComponents: Array.from(relatedComponents)
    };
  } catch (e) {
    console.warn('[SmartLogger] Error analyzing stack trace:', e);
    return null;
  }
};

// React Hook for component monitoring
export const useComponentMonitor = (componentName) => {
  const componentRef = useRef(null);
  
  useEffect(() => {
    const handleRender = () => {
      if (componentRef.current) {
        const { props, state } = componentRef.current;
        logComponentState(componentName, {
          props: JSON.stringify(props),
          state: JSON.stringify(state),
          renderTime: performance.now()
        });
      }
    };
    
    // Monitor component updates
    const unsubscribe = () => {
      // Unsubscribe logic if needed
    };
    
    return () => {
      unsubscribe();
    };
  }, [componentName]);
  
  return componentRef;
};

// Restore original console.error with safe wrapping
const origConsoleError = console.error;
console.error = (...args) => {
  if (!isLogging) {
    const error = args[0] instanceof Error ? args[0] : new Error(args.join(' '));
    logError('console-error', error);
  }
  origConsoleError.apply(console, args);
};

// Helper functions for analysis
const generateErrorRecommendations = (errorInfo) => {
  // Simple recommendations for now
  return ['Check component lifecycle', 'Verify data dependencies'];
};

const analyzePerformanceMetrics = () => {
  return {
    summary: 'Performance analysis summary',
    details: performanceMetrics
  };
};

const analyzeComponentStates = () => {
  return {
    summary: 'Component states analysis',
    details: Array.from(componentStates.entries())
  };
};

const analyzeErrorPatterns = () => {
  return {
    summary: 'Error patterns analysis',
    patterns: Array.from(errorPatterns)
  };
};

const generateSystemDiagnostics = () => {
  return {
    performance: analyzePerformanceMetrics(),
    components: analyzeComponentStates(),
    errors: analyzeErrorPatterns()
  };
};

// Export monitoring functions with advanced features
export const SmartLogger = {
  logError,
  logVisualIssue,
  logComponentState,
  useComponentMonitor,
  getPerformanceMetrics: () => ({
    ...performanceMetrics,
    analysis: analyzePerformanceMetrics()
  }),
  getComponentStates: () => ({
    states: componentStates,
    dependencies: componentDependencyGraph,
    analysis: analyzeComponentStates()
  }),
  getErrorMap: () => ({
    errors: errorMap,
    cascades: errorCascades,
    patterns: Array.from(errorPatterns),
    analysis: analyzeErrorPatterns()
  }),
  getDiagnostics: () => generateSystemDiagnostics()
};
