import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import setupLocatorUI from "@locator/runtime";

setupLocatorUI();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
