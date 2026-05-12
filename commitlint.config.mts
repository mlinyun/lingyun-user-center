import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const Configuration: UserConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        // Type 类型枚举
        "type-enum": [
            RuleConfigSeverity.Error,
            "always",
            [
                "feat", // 用于新增功能 (feature)
                "fix", // 用于修复缺陷 (bug)
                "docs", // 用于修改文档，例如修改 README 文件、API 文档等
                "style", // 用于修改代码的样式，例如调整缩进、空格、空行等
                "refactor", // 用于重构代码，例如修改代码结构、变量名、函数名等但不修改功能逻辑
                "perf", // 用于优化性能，例如提升代码的性能、减少内存占用等
                "test", // 用于修改测试用例，例如添加、删除、修改代码的测试用例等
                "chore", // 用于对非业务性代码进行修改，例如修改构建流程或者工具配置等
                "build", // 用于修改项目构建系统，例如修改依赖库、外部接口或者升级 Node 版本等
                "ci", // 用于修改持续集成流程，例如修改 Travis、Jenkins 等工作流配置
                "revert", // 用于回滚之前的 commit，例如撤销之前的某次提交等
                "wip", // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
            ],
        ],

        // Scope 范围（可选）
        "scope-enum": [
            RuleConfigSeverity.Error,
            "always",
            [
                "frontend", // 前端相关
                "backend", // 后端相关
                "api", // API 相关
                "ui", // UI 组件
                "database", // 数据库相关
                "config", // 配置文件
                "deps", // 依赖更新
                "release", // 发布相关
                "docs", // 文档相关
                "tests", // 测试相关
            ],
        ],

        // Scope 可以为空
        "scope-empty": [RuleConfigSeverity.Warning, "never"],

        // Subject 不能为空
        "subject-empty": [RuleConfigSeverity.Error, "never"],

        // Subject 最小长度
        "subject-min-length": [RuleConfigSeverity.Error, "always", 6],

        // Subject 大小写（关闭检查，允许任何格式）
        "subject-case": [RuleConfigSeverity.Disabled],

        // Subject 结尾不加句号
        "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],

        // Header 最大长度
        "header-max-length": [RuleConfigSeverity.Error, "always", 100],

        // Body 前必须有空行
        "body-leading-blank": [RuleConfigSeverity.Error, "always"],

        // Body 最大行长度
        "body-max-line-length": [RuleConfigSeverity.Error, "always", 300],

        // Footer 前必须有空行
        "footer-leading-blank": [RuleConfigSeverity.Error, "always"],

        // Footer 最大行长度
        "footer-max-line-length": [RuleConfigSeverity.Error, "always", 200],

        // Type 必须小写
        "type-case": [RuleConfigSeverity.Error, "always", "lower-case"],

        // Type 不能为空
        "type-empty": [RuleConfigSeverity.Error, "never"],
    },
};

export default Configuration;
