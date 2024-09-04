import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(true);

  // Conditional styling
  const hideIfVisible = { display: visible ? "none" : "" };
  const visibleBehavior = { display: visible ? "" : "none" };

  // Toggle visibility
  const toggleVisibility = () => setVisible(!visible);

  // Expose the toggleVisibility function to the parent component
  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={visibleBehavior}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={hideIfVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Close</button>
      </div>
      <br />
    </div>
  );
});

export default Togglable;
