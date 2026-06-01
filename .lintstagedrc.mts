import type { Configuration } from "lint-staged";
import * as path from "node:path";

// vue 前端项目的根目录路径
const vuefrontendRoot: string = "./user-center-vue-frontend";
// React 前端项目的根目录路径
const reactfrontendRoot: string = "./user-center-react-frontend";
// 文档项目的根目录路径
const docsRoot: string = "./user-center-docs";

/**
 * 将文件路径转换为相对于指定根目录的路径，并过滤掉不在该目录内的文件。
 *
 * 该函数会先通过 `path.relative(root, file)` 计算相对路径，
 * 再移除空路径以及以 `..` 开头（表示位于根目录之外）的路径。
 *
 * @param files lint-staged 传入的文件绝对路径或相对路径数组
 * @param root 作为基准的根目录路径（如前端项目根目录或文档项目根目录）
 * @returns 仅包含位于 `root` 目录内的相对路径数组
 */
const toRelative = (files: readonly string[], root: string): string[] => {
    return files
        .map((file) => path.relative(root, file))
        .filter((file) => file && !file.startsWith(".."));
};

/**
 * 将文件路径数组转换为适合在 shell 命令中使用的字符串
 *
 * @param files 文件路径数组
 * @return 适合在 shell 命令中使用的文件路径字符串
 */
const toShellArgs = (files: readonly string[]): string => {
    return files.map((file) => JSON.stringify(file)).join(" ");
};

/**
 * lint-staged 的配置对象，定义了在提交代码时需要执行的检查和格式化命令
 * 根据文件类型不同，使用不同的工具进行检查和格式化
 */
const config: Configuration = {
    /**
     * 匹配前端项目中的 JavaScript、TypeScript 和 Vue 文件，使用 ESLint、Oxlint 和 Oxfmt 进行检查和格式化
     *
     * @param files lint-staged 传入的文件路径数组
     * @returns 需要执行的命令数组，如果没有需要 lint 的文件则返回空数组
     */
    [`${vuefrontendRoot}/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue}`]: (
        files: readonly string[],
    ) => {
        // 将文件路径转换为相对于前端项目根目录的路径，并过滤掉不在前端项目中的文件
        const frontendFiles = toRelative(files, vuefrontendRoot);
        if (frontendFiles.length === 0) {
            return []; // 没有需要 lint 的文件，跳过本次检查
        }
        // 将文件路径转换为适合在 shell 命令中使用的字符串
        const args = toShellArgs(frontendFiles);
        return [
            // 使用 ESLint 进行代码检查，--fix 自动修复，--cache 启用缓存加速
            `pnpm --dir ${vuefrontendRoot} exec eslint --fix --cache ${args}`,
            // 使用 Oxlint 进行代码检查，--fix 自动修复
            `pnpm --dir ${vuefrontendRoot} exec oxlint --fix ${args}`,
            // 使用 Oxfmt 进行代码格式化
            `pnpm --dir ${vuefrontendRoot} exec oxfmt ${args}`,
        ];
    },
    /**
     * 匹配前端项目中的样式文件，使用 Stylelint 进行检查和修复
     *
     * @param files lint-staged 传入的文件路径数组
     * @returns 需要执行的命令数组，如果没有需要 lint 的文件则返回空数组
     */
    [`${vuefrontendRoot}/**/*.{vue,css,scss,sass,less,styl}`]: (
        files: readonly string[],
    ) => {
        const frontendFiles = toRelative(files, vuefrontendRoot);
        if (frontendFiles.length === 0) {
            return [];
        }
        const args = toShellArgs(frontendFiles);
        return [
            // 使用 Stylelint 进行样式检查和修复
            `pnpm --dir ${vuefrontendRoot} exec stylelint --fix --custom-syntax postcss-html ${args}`,
        ];
    },
    /**
     * 匹配文档项目中的 Markdown、TypeScript、CSS 文件，使用 ESLint 和 Prettier 进行检查和格式化
     *
     * @param files lint-staged 传入的文件路径数组
     * @returns 需要执行的命令数组，如果没有需要 lint 的文件则返回空数组
     */
    [`${docsRoot}/**/*.{md,mdx,ts,css}`]: (files: readonly string[]) => {
        const docsFiles = toRelative(files, docsRoot);
        if (docsFiles.length === 0) {
            return [];
        }
        const args = toShellArgs(docsFiles);
        return [
            // 使用 ESLint 进行代码检查，--fix 自动修复，--cache 启用缓存加速
            `pnpm --dir ${docsRoot} exec eslint --fix --cache ${args}`,
            // 使用 Prettier 进行代码格式化
            `pnpm --dir ${docsRoot} exec prettier --write ${args}`,
        ];
    },
    [`${reactfrontendRoot}/**/*.{js,jsx,tsx,ts,css,less,md}`]: (files: readonly string[]) => {
        const reactFrontendFiles = toRelative(files, reactfrontendRoot);
        if (reactFrontendFiles.length === 0) {
            return [];
        }
        const args = toShellArgs(reactFrontendFiles);
        return [`pnpm --dir ${reactfrontendRoot} exec biome check --write ${args}`];
    },
};

export default config;
