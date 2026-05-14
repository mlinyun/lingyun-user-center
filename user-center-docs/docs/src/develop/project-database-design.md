# 项目数据库设计

## 删除测试用户表

在进行数据库设计之前，我们首先需要将之前测试时创建的 `user` 表删除，在进行接下来的操作

```sql
USE `user_center`;
DROP TABLE IF EXISTS `user`;
```

在删除表之前，需要选中数据库 `user_center`，再执行删除表 `DROP TABLE IF EXISTS user;` 的代码。

![image-20240129173044125](https://static.mlinyun.com/user-center/image-20240129173044125.png)

## 用户表设计

用户表

| 列名         | 类型          | 含义                     | 说明                        |
| ------------ | ------------- | ------------------------ | --------------------------- |
| id           | bigint        | id                       | 主键，自动递增              |
| username     | varchar(256)  | 用户昵称                 |                             |
| userAccount  | varchar(256)  | 用户账号                 |                             |
| avatarUrl    | varchar(1024) | 用户头像                 |                             |
| gender       | tinyint       | 性别                     |                             |
| userPassword | varchar(512)  | 用户密码                 | 非空                        |
| phone        | varchar(128)  | 电话                     |                             |
| email        | varchar(512)  | 邮箱                     |                             |
| userStatus   | int           | 用户状态 0 - 正常        | 非空                        |
| createTime   | datetime      | 创建时间（数据插入时间） | 默认值（CURRENT_TIMESTAMP） |
| updateTime   | datetime      | 更新时间（数据更新时间） | 默认值（CURRENT_TIMESTAMP） |
| isDelete     | tinyint       | 是否删除                 | 1 - 逻辑删除                |
| userRole     | tinyint       | 用户角色                 | 0 - 普通用户 1 - 管理员     |
| planetCode   | varchar(512)  | 星球编号                 | 用于用户校验                |

使用 IDEA 自带的数据库工具创建上诉的 `user` 表，如下图所示：

![image-20240129185433691](https://static.mlinyun.com/user-center/image-20240129185433691.png)

另外也可以编写 SQL 代码，然后在 MySQL 终端执行，代码如下：

```sql
-- auto-generated definition
create table user
(
    id           bigint auto_increment comment 'id'
        primary key,
    username     varchar(256)                       null comment '用户昵称',
    userAccount  varchar(256)                       null comment '用户账号',
    avatarUrl    varchar(1024)                      null comment '用户头像',
    gender       tinyint                            null comment '性别',
    userPassword varchar(512)                       not null comment '用户密码',
    phone        varchar(128)                       null comment '电话',
    email        varchar(512)                       null comment '邮箱',
    userStatus   int      default 0                 not null comment '用户状态 0 - 正常',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint  default 0                 not null comment '是否删除'
)
    comment '用户';
```
