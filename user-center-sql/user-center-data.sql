-- 请使用 user_center_user 用户执行下面的 SQL 脚本

-- -- 使用 user_center 数据库
USE `user_center`;

-- 插入管理员账号（密码：Password..1234）
INSERT INTO `user` (`id`, `userAccount`, `userPassword`, `userName`, `userAvatar`, `userProfile`, `userRole`,
                    `userGender`, `userPhone`, `userEmail`, `phoneVerified`, `emailVerified`, `userStatus`, `editTime`,
                    `createTime`, `updateTime`, `isDelete`)
VALUES (2056034535312846850, 'LingYun000', '$2a$12$pHP6ZIDcmUuMeo1Pq/yJqO93GxTkr23STut.ScATA0UaNnZiYIzj2', '凌云',
        'https://static.mlinyun.com/user-center/avatar/default/avatar.png', '系统管理员，负责用户管理与平台维护。',
        'admin', 1, '15600000000', 'lingyun000@gmail.com', 1, 1, 0, '2026-05-18 16:53:11', '2026-05-17 23:30:07',
        '2026-05-18 16:53:11', 0);

-- 插入普通用户账号（密码：Password..1234）
INSERT INTO `user` (`id`, `userAccount`, `userPassword`, `userName`, `userAvatar`, `userProfile`, `userRole`,
                    `userGender`, `userPhone`, `userEmail`, `phoneVerified`, `emailVerified`, `userStatus`, `editTime`,
                    `createTime`, `updateTime`, `isDelete`)
VALUES (2056222492040679425, 'LingYun001', '$2a$12$F7TvzN9xjVwQm/imo14iS.bhZJ5z0.HU/64Rb6BXqXGIN/EzmLEyW', 'LingYun001',
        'https://static.mlinyun.com/user-center/avatar/default/avatar.png', '这个人很懒，什么都没有留下~', 'user', 0,
        '15600000001', 'lingyun001@qq.com', 1, 1, 0, '2026-05-18 13:09:06', '2026-05-18 11:56:59', '2026-05-18 15:41:44',
        0);
