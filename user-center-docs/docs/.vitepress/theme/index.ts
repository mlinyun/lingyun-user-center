import BaseTheme from "vitepress/theme";
import type { Theme } from "vitepress";
// @ts-expect-error Vite 运行时会处理该 CSS 副作用导入，当前项目没有对应类型声明。
import "./style/vars.css";

export default {
    extends: BaseTheme,
} satisfies Theme;
