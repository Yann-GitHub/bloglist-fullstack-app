import { useState } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(true);

  // Conditional styling
  const hideIfVisible = { display: visible ? "none" : "" };
  const visibleBehavior = { display: visible ? "" : "none" };

  // Toggle visibility
  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      <div style={visibleBehavior}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={hideIfVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Close</button>
      </div>
    </div>
  );
};

export default Togglable;
