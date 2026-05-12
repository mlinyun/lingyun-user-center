/** @type {import("stylelint").Config} */
export default {
    extends: ["stylelint-config-standard", "stylelint-config-recommended-vue", "stylelint-config-recess-order"],
    plugins: ["stylelint-order"],
    rules: {
        // Add overrides and additional rules here
        "no-empty-source": null, // 允许空的样式源
    },
    ignoreFiles: ["**/dist/**", "**/node_modules/**", "**/*.js", "**/*.ts"],
};
