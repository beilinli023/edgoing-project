import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 导入API回退适配器 - 生产环境启用静态数据回退
import '@/services/api/fallback-adapter';

createRoot(document.getElementById("root")!).render(<App />);
