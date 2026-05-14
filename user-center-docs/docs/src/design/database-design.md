# 凌云用户中心 · 数据库设计

::: tip 提示
文档目标：描述 `user_center` 数据库的逻辑 / 物理结构、字段约束、索引策略与运维注意事项，保证前后端团队在开发、联调、部署与扩展中对数据层有统一认知
:::

## 1. 总览

| 项目要素   | 内容                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| 数据库实例 | MySQL 8.0+，字符集 `utf8mb4`、排序规则 `utf8mb4_unicode_ci`，存储引擎默认 InnoDB                        |
| 账号与权限 | 业务专用账号 `user_center_user`，拥有对 `user_center` 库的全部权限（参见 `sql/user-center-schema.sql`） |
| 命名规范   | 表名、列名采用下划线风格；实体属性使用驼峰，通过 MyBatis-Plus 自动映射或 `@TableField` 指定             |
| ID 策略    | 使用 MyBatis-Plus 分配的雪花算法 (`IdType.ASSIGN_ID`)，保证全局唯一 64 bit 整型                         |
| 会话依赖   | 后端 `User` 实体与 `user` 表一一对应，`@TableLogic` 配合 `is_delete` 字段实现软删除                     |

> ⚠️ 注意：`application.yml` 中 `mybatis-plus.global-config.db-config.logic-delete-field` 需与实体字段 `isDelete`/
> `is_delete` 保持一致，避免逻辑删除配置失效

---

## 2. 数据库与账号脚本

```sql
-- 数据库与账号初始化
CREATE DATABASE IF NOT EXISTS `user_center` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'user_center_user'@'%' IDENTIFIED BY 'StrongPassword..1024';
GRANT ALL PRIVILEGES ON `user_center`.* TO 'user_center_user'@'%';
FLUSH PRIVILEGES;
```

> 部署时请根据环境改写密码，并结合安全策略限制可访问 IP

---

## 3. 逻辑模型（ER 概述）

当前版本仅包含一张核心业务表：

```text
[user]
  ├─ 账号信息：user_account / user_password / planet_code
  ├─ 资料信息：user_name / user_avatar / user_profile / user_gender
  ├─ 联系方式：user_phone / user_email
  ├─ 权限状态：user_role / user_status
  └─ 审计字段：create_time / update_time / edit_time / is_delete
```

未来可扩展的关联表（建议）：

- `role` / `permission`：实现 RBAC 多角色、多权限模型
- `user_meta`：存储可配置的 KV 扩展字段，避免 `user` 表不断加列
- `user_audit_log`：记录注册、登录、封禁、资料修改等关键信息，满足安全与合规要求
- `file_asset`：抽象文件存储（头像、附件），统一管理存储路径、大小、状态

---

## 4. 物理模型：`user` 表

```sql
CREATE TABLE IF NOT EXISTS `user`
(
    id            BIGINT UNSIGNED PRIMARY KEY COMMENT '用户主键ID（雪花算法生成）',
    user_account  VARCHAR(128)                         NOT NULL COMMENT '登录账号（唯一）',
    user_password VARCHAR(60)                          NOT NULL COMMENT '登录密码（BCrypt 哈希）',
    user_name     VARCHAR(64)           DEFAULT NULL COMMENT '用户昵称',
    user_avatar   VARCHAR(512)          DEFAULT NULL COMMENT '用户头像 URL',
    user_profile  VARCHAR(512)          DEFAULT NULL COMMENT '用户简介',
    user_role     ENUM ('user','admin') DEFAULT 'user' NOT NULL COMMENT '用户角色',
    user_gender   TINYINT UNSIGNED      DEFAULT 2 COMMENT '性别（0: 女 1: 男 2: 未知）',
    user_phone    VARCHAR(32)           DEFAULT NULL COMMENT '手机号',
    user_email    VARCHAR(128)          DEFAULT NULL COMMENT '邮箱地址',
    user_status   TINYINT UNSIGNED      DEFAULT 0      NOT NULL COMMENT '状态（0: 正常 1: 封禁）',
    planet_code   VARCHAR(64)           DEFAULT NULL COMMENT '星球编号',
    edit_time     DATETIME              DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
    create_time   DATETIME              DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_delete     BIGINT UNSIGNED       DEFAULT 0      NOT NULL COMMENT '逻辑删除（0: 未删 1: UNIX_TIMESTAMP()）',
    UNIQUE KEY uk_user_account (user_account, is_delete),
    UNIQUE KEY uk_planet_code (planet_code, is_delete),
    INDEX idx_user_name (user_name),
    INDEX idx_user_phone (user_phone),
    INDEX idx_user_email (user_email),
    INDEX idx_create_time (create_time),
    INDEX idx_user_status (user_status, is_delete)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='用户信息表';
```

### 4.1 字段字典

| 字段            | 类型         | 默认值            | 说明 / 业务规则                                                        |
| --------------- | ------------ | ----------------- | ---------------------------------------------------------------------- |
| `id`            | BIGINT       | AUTO              | 雪花算法生成，保持跨表唯一，可用于日志追踪                             |
| `user_account`  | VARCHAR(128) | -                 | 登录账号，4-16 位（字母 / 数字 / 下划线），结合 `is_delete` 做唯一约束 |
| `user_password` | VARCHAR(60)  | -                 | BCrypt 哈希（60 字符），严禁明文或 MD5，后端 `PasswordUtil` 负责加密   |
| `user_name`     | VARCHAR(64)  | NULL              | 显示昵称，可为空，默认与账号同名                                       |
| `user_avatar`   | VARCHAR(512) | NULL              | 头像 URL，上传后由 `FileService` 返回访问路径                          |
| `user_profile`  | VARCHAR(512) | NULL              | 个人简介；默认值位于 `UserConstant.USER_PROFILE_DEFAULT`               |
| `user_role`     | ENUM         | `user`            | 仅 `user`/`admin`，与 `UserRoleEnum`、`@AuthCheck` 联动                |
| `user_gender`   | TINYINT      | 2                 | 0 女 / 1 男 / 2 未知                                                   |
| `user_phone`    | VARCHAR(32)  | NULL              | 预留，暂未唯一约束；如需唯一性可添加联合索引                           |
| `user_email`    | VARCHAR(128) | NULL              | 预留邮箱；同上                                                         |
| `user_status`   | TINYINT      | 0                 | 0 正常 / 1 封禁；登录前校验该字段                                      |
| `planet_code`   | VARCHAR(64)  | NULL              | 项目专属编号，≤6 位；通过联合唯一键确保活跃用户唯一                    |
| `edit_time`     | DATETIME     | CURRENT_TIMESTAMP | 业务层可写，用于记录资料变动时间                                       |
| `create_time`   | DATETIME     | CURRENT_TIMESTAMP | 自动生成，插入时间                                                     |
| `update_time`   | DATETIME     | CURRENT_TIMESTAMP | 自动更新，最后修改时间                                                 |
| `is_delete`     | BIGINT       | 0                 | 逻辑删除标志，0 未删，非 0 存储 UNIX 时间戳；MyBatis-Plus 自动过滤     |

### 4.2 索引与约束

- `uk_user_account(user_account, is_delete)`：保证未删除账号唯一，同时允许软删除后复用账号
- `uk_planet_code(planet_code, is_delete)`：确保星球编号唯一，可供前端校验提示
- `idx_user_status(user_status, is_delete)`：管理员分页筛选常用条件，结合逻辑删除字段命中索引
- 其他普通索引用于模糊搜索（`user_name`）、联系方式定位（`user_phone`/`user_email`）与时间排序（`create_time`）

> 如需支持手机号 / 邮箱唯一登录，请新增唯一索引并在 `UserServiceImpl` 中增加约束逻辑

---

## 5. 数据生命周期

| 阶段 | 说明                                                                                        | 相关代码                                                 |
| ---- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 创建 | 注册、管理员添加时写入；填充默认头像/简介/角色，密码由 `PasswordUtil.encrypt` 生成          | `UserServiceImpl#userRegister`, `#adminAddUser`          |
| 查询 | 大部分查询自动过滤 `is_delete != 0`；如需查看历史数据，可自定义 `QueryWrapper` 关闭逻辑删除 | `@TableLogic` 全局配置                                   |
| 更新 | 用户资料、管理员更新走 `updateById`，仅允许白名单字段，防止覆盖 `user_password` 等敏感字段  | `UserServiceImpl#updateUserInfo`, `#adminUpdateUserInfo` |
| 删除 | 采用逻辑删除：`is_delete = UNIX_TIMESTAMP()`；账号可在软删除后重建                          | `UserServiceImpl#adminDeleteUserById`                    |
| 封禁 | 切换 `user_status`，禁止登录但保留数据；与逻辑删除独立                                      | `UserServiceImpl#adminBanOrUnbanUser`                    |

---

## 6. 示例数据（`sql/user-center-data.sql`）

```sql
INSERT INTO `user` (id, user_account, user_password, user_name, user_avatar, user_profile, user_role, user_gender,
                    user_phone, user_email, planet_code)
VALUES (1980484882008412161, 'Admin01', '$2a$10$8XpopHZYP3hHpa1dFHX6t.bbTWKD2kCU6qnAC.b397E/kUov3IOZm',
        '管理员', '/default_admin_avatar.png', '系统超级管理员，拥有所有权限', 'admin', 1, 15600000000,
        'admin15600@gmail.com', '00001');

INSERT INTO `user` (id, user_account, user_password, user_name, user_avatar, user_profile, user_role, user_gender,
                    user_phone, user_email, planet_code)
VALUES (1980485882668683265, 'LingYun01', '$2a$10$up2CA1uezo7Wm6rUduRrhOYt46NcWY4zlk9s4GDFUF0oaVyl/4DpS',
        '凌云01', '/default_user_avatar.png', '计算机科学与技术专业大三学生，热爱开发与设计', 'user', 1, 15600000001,
        'lingyun15601@gmail.com', '00002');
```

> 示例密码均为 BCrypt 哈希，如需本地调试可在 README 的“管理员账号”章节获取明文

---

## 7. 运维与性能建议

- **连接与事务**：保持短事务，避免长时间持有行锁；高并发写场景可考虑引入分布式锁或消息队列缓冲
- **索引维护**：定期执行 `ANALYZE TABLE user;`，观察慢查询日志，必要时重建索引
- **备份策略**：生产建议启用主从或定时 `mysqldump`，至少保留每日增量 + 每周全量；上传目录（头像）需同步备份
- **容量规划**：头像 URL 长度 512，若未来使用对象存储可保持足够冗余；`user_profile` 512 字符，若要支持更长简介可拆分至独立表
- **全文检索**：当昵称模糊搜索成为瓶颈时，可考虑 MySQL 8 的全文索引或接入 Elasticsearch

---

## 8. 兼容性与迁移

1. **字段映射**：若新增列，请同步更新 `User` 实体、`UserVO/UserLoginVO`、Mapper XML 以及前端类型文件，避免序列化缺失
2. **密码策略升级**：
   - 新注册/修改密码统一写入 BCrypt；
   - 登录时判断哈希格式（`$2a$` 前缀），若检测到旧格式，在用户成功登录后以 BCrypt 重新加密并回写；
   - 所有用户升级完成后移除旧逻辑
3. **逻辑删除字段**：若需改为 `tinyint(1)` 布尔值，须同步修改：建表 SQL、`User` 实体、`@TableLogic` 配置及历史数据迁移脚本
4. **多环境配置**：`application-dev.yml / application-prod*.yml` 中的数据库 URL、账号、最大连接数需与 DevOps 协同管理，避免提交敏感凭证

---

## 9. 扩展路线图

| 方向          | 动机                                  | 设计要点                                                                          |
| ------------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| 多角色 / 权限 | 细化管理员职责、支持运营 / 审核等角色 | 新增 `role`、`permission`、`user_role_rel` 表，配合 `@AuthCheck`/AOP 做细粒度授权 |
| 用户行为日志  | 追踪登录失败、资料修改、封禁记录      | 追加 `user_audit_log` 表，记录操作人、动作、时间、备注，支持合规审计              |
| 多租户        | SaaS 化，区分不同企业数据             | 增加 `tenant_id` 字段或拆分库表；结合网关或数据权限插件隔离                       |
| 外部身份源    | 支持 OAuth / 企业微信等第三方登录     | 设计 `oauth_account` 表，存储 openId/unionId、绑定关系与刷新 token                |

---

本设计与 `docs/src/design/requirement-analysis.md`、`docs/src/design/api-documentation.md` 协同维护；任何表结构调整请同步更新
SQL 脚本、实体类、Mapper、前端类型定义与部署文档，以确保多端一致性
