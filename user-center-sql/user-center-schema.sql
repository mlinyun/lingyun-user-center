-- 请使用 root 用户执行下面的 SQL 脚本

-- 删除数据库：user_center
DROP DATABASE IF EXISTS `user_center`;

-- 创建数据库：user_center
CREATE DATABASE IF NOT EXISTS `user_center`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- 创建专属用户：user_center_user
CREATE USER IF NOT EXISTS 'user_center_user'@'%' IDENTIFIED BY 'StrongPassword..1024';

-- 授权专属用户：允许 user_center_user 用户对 user_center 数据库的所有操作权限
GRANT ALL PRIVILEGES ON `user_center`.* TO 'user_center_user'@'%';

-- 刷新权限，使授权生效
FLUSH PRIVILEGES;
