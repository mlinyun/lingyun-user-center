import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv, ProxyOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
    // 项目根目录
    const root = process.cwd();
    // 读取根目录下的环境变量文件
    const env = loadEnv(mode, root);
    // 解构环境变量
    const {
        VITE_APP_NAME,
        VITE_APP_VERSION,
        VITE_APP_PORT,
        VITE_APP_BASE_PATH,
        VITE_API_BASE_URL,
        VITE_API_PROXY_URL,
    } = env;
    // 项目源码路径
    const srcPath = fileURLToPath(new URL("./src", import.meta.url));
    // 打印应用信息
    console.log(`✨ Starting ${VITE_APP_NAME} ...`);
    console.log(`📦 Version: ${VITE_APP_VERSION}`);
    console.log(`📡 API_BASE_URL: ${VITE_API_BASE_URL}`);
    console.log(`📂 Source Path: ${srcPath}`);
    return defineConfig({
        define: {
            __APP_VERSION__: JSON.stringify(VITE_APP_VERSION),
        },
        base: VITE_APP_BASE_PATH || "/",
        plugins: [
            vue(),
            ...(mode === "development" ? [vueDevTools()] : []),
            AutoImport({
                // 自动导入 Vue 相关函数，如 ref, reactive, toRef 等
                imports: ["vue", "vue-router", "pinia"],
                // 生成自动导入的 TypeScript 声明文件
                dts: srcPath + "/types/import/auto-imports.d.ts",
                // 生成 ESLint 全局变量配置
                eslintrc: {
                    enabled: true,
                    filepath: "./.eslintrc-auto-import.json",
                    globalsPropValue: true,
                },
            }),
            Components({
                // 自动注册 src/components 目录下的组件
                dirs: [fileURLToPath(new URL("./src/components", import.meta.url))],
                // 生成自动注册的 TypeScript 声明文件
                dts: srcPath + "/types/import/components.d.ts",
            }),
        ],
        resolve: {
            // 路径别名
            alias: {
                "@": srcPath,
                "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
                "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
                "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
            },
        },
        server: {
            host: true, // 允许使用网络地址访问
            open: true, // 启动时自动打开浏览器
            port: Number(VITE_APP_PORT) || 8080,
            proxy: {
                "/api": {
                    target: VITE_API_PROXY_URL || "http://127.0.0.1:8100/api",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                } as ProxyOptions,
            },
        },
    });
};
