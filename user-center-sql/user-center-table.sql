-- 请使用 user_center_user 用户执行下面的 SQL 脚本

-- 使用 user_center 数据库
USE `user_center`;

-- 删除旧的应用表（如果存在）
DROP TABLE IF EXISTS `user`;
-- 创建用户表
CREATE TABLE IF NOT EXISTS `user`
(
    id            BIGINT UNSIGNED PRIMARY KEY COMMENT '用户主键 ID（雪花算法生成）',
    userAccount   VARCHAR(128)                          NOT NULL COMMENT '登录账号（唯一）',
    userPassword  VARCHAR(60)                           NOT NULL COMMENT '登录密码（加密存储）',
    userName      VARCHAR(64)            DEFAULT NULL COMMENT '用户昵称',
    userAvatar    VARCHAR(512)           DEFAULT NULL COMMENT '用户头像 URL',
    userProfile   VARCHAR(512)           DEFAULT NULL COMMENT '用户简介',
    userRole      ENUM ('user', 'admin') DEFAULT 'user' NOT NULL COMMENT '用户角色',
    userGender    TINYINT UNSIGNED       DEFAULT 2 COMMENT '性别（0: 女 1: 男 2: 未知）',
    userPhone     VARCHAR(32)            DEFAULT NULL COMMENT '手机号',
    userEmail     VARCHAR(128)           DEFAULT NULL COMMENT '邮箱地址',
    phoneVerified TINYINT UNSIGNED                      NOT NULL DEFAULT 0 COMMENT '手机号是否已验证（0: 未验证 1: 已验证）',
    emailVerified TINYINT UNSIGNED                      NOT NULL DEFAULT 0 COMMENT '邮箱是否已验证（0: 未验证 1: 已验证）',
    userStatus    TINYINT UNSIGNED       DEFAULT 0      NOT NULL COMMENT '状态（0: 正常 1: 封禁）',
    editTime      DATETIME               DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
    createTime    DATETIME               DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime    DATETIME               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    isDelete      BIGINT                 DEFAULT 0      NOT NULL COMMENT '逻辑删除（0: 未删除, 时间戳: 删除时间）',
    -- 唯一索引: 确保登录账号、手机号、邮箱地址的唯一性
    UNIQUE KEY uk_userAccount (userAccount, isDelete) COMMENT '登录账号和删除状态复合唯一索引',
    UNIQUE KEY uk_userPhone (userPhone, isDelete) COMMENT '手机号和删除状态复合唯一索引',
    UNIQUE KEY uk_userEmail (userEmail, isDelete) COMMENT '邮箱地址和删除状态复合唯一索引',
    -- 普通索引: 优化查询性能
    INDEX idx_userName (userName) COMMENT '用户昵称索引'
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci
    COMMENT = '用户信息表';

-- 删除旧的验证码发送日志表（如果存在）
DROP TABLE IF EXISTS `captcha_log`;
-- 创建验证码发送日志表
CREATE TABLE IF NOT EXISTS `captcha_log`
(
    id            BIGINT UNSIGNED PRIMARY KEY COMMENT '主键 ID（雪花算法生成）',
    target        VARCHAR(128)                                           NOT NULL COMMENT '发送目标（邮箱地址或手机号）',
    captchaType   ENUM ('EMAIL', 'SMS')                                  NOT NULL COMMENT '验证码类型（EMAIL: 邮箱, SMS: 短信）',
    captchaScene  ENUM ('REGISTER', 'LOGIN', 'RESET_PWD', 'BIND_CHANGE') NOT NULL COMMENT '验证码场景（REGISTER: 注册, LOGIN: 登录, RESET_PWD: 重置密码, BIND_CHANGE: 绑定/换绑）',
    captchaStatus TINYINT UNSIGNED DEFAULT 0                             NOT NULL COMMENT '验证码状态（0: 已发送 1: 已验证 2: 已过期）',
    ipAddress     VARCHAR(64)      DEFAULT NULL COMMENT '请求 IP 地址',
    sendTime      DATETIME         DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
    verifyTime    DATETIME         DEFAULT NULL COMMENT '验证时间',
    createTime    DATETIME         DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime    DATETIME         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    isDelete      BIGINT           DEFAULT 0                             NOT NULL COMMENT '逻辑删除（0: 未删除, 时间戳: 删除时间）',
    -- 普通索引: 优化查询性能
    INDEX idx_target (target) COMMENT '发送目标索引',
    INDEX idx_captchaType (captchaType) COMMENT '验证码类型索引',
    INDEX idx_sendTime (sendTime) COMMENT '发送时间索引'
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci
    COMMENT = '验证码发送日志表';
