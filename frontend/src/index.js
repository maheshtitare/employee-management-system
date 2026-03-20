import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// Entry point - renders App component into the <div id="root"> in index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
