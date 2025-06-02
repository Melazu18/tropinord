// Button.jsx
import React from "react";

export default function Button({ children, className = "" }) {
  return (
    <button className={`${className} px-4 py-2 rounded`}>{children}</button>
  );
}
