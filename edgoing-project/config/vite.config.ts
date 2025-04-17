import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import http from 'http';
import dotenv from 'dotenv';
import tailwindcss from "tailwindcss";

// 加载.env文件
dotenv.config();

// 函数：获取代理服务器运行的端口
async function getProxyServerPort() {
  // 尝试连接到API服务器，获取正在使用的端口
  return new Promise<number>((resolve) => {
    // 首先尝试检查默认端口
    const defaultPort = 3001;
    const req = http.get(`http://localhost:${defaultPort}/`, (res) => {
      // 如果能成功连接，说明服务器运行在这个端口
      resolve(defaultPort);
      if (res.socket) res.socket.destroy();
    });

    req.on('error', () => {
      // 如果默认端口连接失败，尝试从3002到3100查找可能的端口
      let checkedPorts = 0;
      let foundPort = false;
      const maxPort = 3100;
      const minPort = 3002;
      const totalPortsToCheck = maxPort - minPort + 1;

      for (let port = minPort; port <= maxPort; port++) {
        const checkReq = http.get(`http://localhost:${port}/`, (res) => {
          if (!foundPort) {
            foundPort = true;
            resolve(port);
            if (res.socket) res.socket.destroy();
          }
          checkReq.destroy();
        }).on('error', () => {
          checkedPorts++;
          // 如果所有可能的端口都检查完，但没有找到，则使用默认值
          if (checkedPorts >= totalPortsToCheck && !foundPort) {
            console.warn('无法检测到可用的代理服务器端口，将使用默认端口 3001');
            resolve(defaultPort);
          }
        });
        checkReq.setTimeout(50, () => {
           if(!checkReq.destroyed) checkReq.destroy();
        });
      }
    });

    // 设置总体检查超时
    req.setTimeout(2000, () => {
      if (!req.destroyed) {
        req.destroy();
        console.warn('检测代理服务器端口超时，将使用默认端口 3001');
        resolve(defaultPort);
      }
    });
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', req.url, proxyRes.statusCode);
          });
        }
      }
    }
  }
});
