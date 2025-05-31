import React, { useState, useEffect } from 'react';
import { SmartLogger } from '../utils/smartLogger';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState({
    errors: [],
    visualIssues: [],
    components: []
  });
  
  useEffect(() => {
    const updateMetrics = () => {
      const perfMetrics = SmartLogger.getPerformanceMetrics();
      const componentStates = SmartLogger.getComponentStates();
      const errorMap = SmartLogger.getErrorMap();
      
      setMetrics({
        errors: Array.from(errorMap.values()),
        visualIssues: [
          ...perfMetrics.blackScreens,
          ...perfMetrics.visualGlitches
        ],
        components: Array.from(componentStates.entries()).map(([name, state]) => ({
          name,
          ...state
        }))
      });
    };
    
    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="monitoring-dashboard">
      <h2>Application Monitoring</h2>
      
      <section className="error-section">
        <h3>Errors ({metrics.errors.length})</h3>
        <div className="error-list">
          {metrics.errors.map((error, i) => (
            <div key={i} className="error-item">
              <strong>{error.type}</strong>
              <p>{error.message}</p>
              <small>
                {new Date(error.timestamp).toLocaleString()}
                {error.sources && error.sources.length > 0 && (
                  <span> - Source: {error.sources[0].file}:{error.sources[0].line}</span>
                )}
              </small>
            </div>
          ))}
        </div>
      </section>
      
      <section className="visual-issues">
        <h3>Visual Issues ({metrics.visualIssues.length})</h3>
        <div className="issue-list">
          {metrics.visualIssues.map((issue, i) => (
            <div key={i} className="issue-item">
              <strong>{issue.type}</strong>
              <p>{issue.message}</p>
              <div className="dom-state">
                <small>Elements: {issue.domState.elementCount}</small>
                <small>Viewport: {issue.domState.viewport.width}x{issue.domState.viewport.height}</small>
              </div>
              <small>{new Date(issue.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
      
      <section className="component-states">
        <h3>Component States ({metrics.components.length})</h3>
        <div className="component-list">
          {metrics.components.map((comp, i) => (
            <div key={i} className="component-item">
              <strong>{comp.name}</strong>
              <p>Render count: {comp.renderCount}</p>
              <small>Last updated: {new Date(comp.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
      
      <style jsx>{`
        .monitoring-dashboard {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        section {
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .error-item, .issue-item, .component-item {
          margin: 10px 0;
          padding: 10px;
          border-left: 3px solid #ff4444;
          background: #fff;
        }
        
        .issue-item {
          border-left-color: #ffbb33;
        }
        
        .component-item {
          border-left-color: #00C851;
        }
        
        small {
          color: #666;
          display: block;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default MonitoringDashboard;
