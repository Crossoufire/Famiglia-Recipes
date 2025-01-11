import "./index.css";
import "./i18n/i18n";
import App from "@/app";
import {createRoot} from "react-dom/client";


const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(<App/>);
}
