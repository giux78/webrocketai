import React from "react";


const BlockUI = props => {
  if (!props.blocking) {
    return "";
  } else {
    return (
      <div className="block-ui-container">
        <div className="block-ui-overlay" />
        <div className="block-ui-message-container">
          <div className="block-ui-message">
            <h4>Loading it takes about 1 minute</h4>
            <div className="loading-indicator">
              <svg id="indicator" viewBox="0 0 100 100">
                <circle id="circle" cx="50" cy="50" r="45" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
 
BlockUI.defaultProps = {
  blocking: false,
  title: "Loading"
};
 
export default BlockUI;