# 凌云用户中心 · API 参考手册

::: tip 提示
本文为凌云用户中心后端 REST API 官方参考文档，覆盖用户鉴权、资料、文件上传及管理员运营接口。前端（React / Vue）与第三方系统均应以此为准。

版本：v1.0.0｜最后更新：2025-11-16｜维护人：@mlinyun  
:::

## 1. 基本信息

| 项目要素 | 描述                                                            |
| -------- | --------------------------------------------------------------- |
| 基础 URL | `https://<domain>/api`（本地调试：`http://localhost:8100/api`） |
| 接口风格 | RESTful + JSON                                                  |
| 编码格式 | UTF-8                                                           |
| 认证方式 | HttpSession（基于 Cookie）；管理员接口需 `admin` 角色           |
| 速率限制 | 通过 `@RateLimit` 注解控制（详见对应接口）                      |
| 文档形式 | Markdown（本手册） + Knife4j 在线文档 `/doc.html`               |

### 1.1 公共请求要求

| 项             | 说明                                                           |
| -------------- | -------------------------------------------------------------- |
| `Content-Type` | JSON 接口：`application/json`；上传接口：`multipart/form-data` |
| `Cookie`       | 登录后必须携带 `JSESSIONID` 才能访问受限接口                   |
| 字符编码       | 所有文本字段均为 UTF-8                                         |

### 1.2 统一响应格式 `BaseResponse<T>`

| 字段      | 类型    | 说明                                 |
| --------- | ------- | ------------------------------------ |
| `success` | boolean | 业务是否成功                         |
| `code`    | int     | 状态码，参见错误码表                 |
| `message` | string  | 描述信息                             |
| `data`    | T       | 具体数据载荷，可为对象/数组/原始类型 |

```json
{
  "success": true,
  "code": 20000,
  "message": "操作成功",
  "data": {}
}
```

### 1.3 错误码（`ResultCodeEnum`）

| Code  | Message          | 场景                        |
| ----- | ---------------- | --------------------------- |
| 20000 | 成功             | 请求成功                    |
| 40000 | 请求参数错误     | DTO 校验失败、格式不合法    |
| 40100 | 未登录           | Session 失效或未携带 Cookie |
| 40101 | 无权限           | 非管理员访问管理端接口      |
| 40300 | 禁止访问         | 账号被封禁等场景            |
| 40400 | 请求的资源不存在 | ID 未命中、路由不存在       |
| 50000 | 服务器内部错误   | 未捕获异常                  |
| 50001 | 操作失败         | 业务执行失败（通用）        |

---

## 2. 系统健康

### 2.1 健康检查

| 项       | 说明           |
| -------- | -------------- |
| **URL**  | `GET /health`  |
| **鉴权** | 无             |
| **用途** | 监控探针、自检 |

**响应示例**

```json
{
  "success": true,
  "code": 20000,
  "message": "成功",
  "data": "OK"
}
```

---

## 3. 用户鉴权与会话

> 限流：注册（同 IP 300s 内 ≤3 次）、登录（同 IP 60s 内 ≤5 次）、密码修改（同用户 300s 内 ≤3 次）。

### 3.1 用户注册

| 项         | 说明                  |
| ---------- | --------------------- |
| **URL**    | `POST /user/register` |
| **鉴权**   | 无                    |
| **请求体** | `application/json`    |

| 字段            | 类型   | 必填 | 说明                                    |
| --------------- | ------ | ---- | --------------------------------------- |
| `userAccount`   | string | ✅   | 4-16 位字母/数字/下划线，唯一           |
| `userPassword`  | string | ✅   | 8-20 位，需包含大小写 + 数字 + 特殊字符 |
| `checkPassword` | string | ✅   | 与 `userPassword` 一致                  |
| `planetCode`    | string | ✅   | 长度 ≤6，唯一                           |

**响应**：`Long`（新用户 ID）。

**请求示例**

```json
{
  "userAccount": "LingYun01",
  "userPassword": "Password..1024",
  "checkPassword": "Password..1024",
  "planetCode": "00001"
}
```

### 3.2 用户登录

| 项         | 说明                          |
| ---------- | ----------------------------- |
| **URL**    | `POST /user/login`            |
| **鉴权**   | 无                            |
| **请求体** | `application/json`            |
| **响应**   | `UserLoginVO`（脱敏用户信息） |

| 字段           | 类型   | 必填 | 说明     |
| -------------- | ------ | ---- | -------- |
| `userAccount`  | string | ✅   | 登录账号 |
| `userPassword` | string | ✅   | 登录密码 |

```json
{
  "userAccount": "Admin01",
  "userPassword": "Admin..1024"
}
```

### 3.3 获取当前登录用户

| 项       | 说明                      |
| -------- | ------------------------- |
| **URL**  | `GET /user/loginUserInfo` |
| **鉴权** | 已登录用户                |
| **响应** | `UserLoginVO`             |

### 3.4 用户注销

| 项       | 说明                |
| -------- | ------------------- |
| **URL**  | `POST /user/logout` |
| **鉴权** | 已登录用户          |
| **响应** | `Boolean`           |

### 3.5 修改密码

| 项         | 说明                        |
| ---------- | --------------------------- |
| **URL**    | `POST /user/updatePassword` |
| **鉴权**   | 已登录用户                  |
| **请求体** | `application/json`          |

| 字段            | 类型   | 必填 | 说明                      |
| --------------- | ------ | ---- | ------------------------- |
| `id`            | long   | ✅   | 当前用户 ID（服务端校验） |
| `rawPassword`   | string | ✅   | 原始密码                  |
| `newPassword`   | string | ✅   | 新密码（同注册校验）      |
| `checkPassword` | string | ✅   | 与 `newPassword` 一致     |

**响应**：`Boolean`。

---

## 4. 用户资料与文件

### 4.1 更新个人资料

| 项         | 说明                        |
| ---------- | --------------------------- |
| **URL**    | `POST /user/updateUserInfo` |
| **鉴权**   | 已登录用户                  |
| **请求体** | `application/json`          |

| 字段          | 类型   | 必填 | 说明                           |
| ------------- | ------ | ---- | ------------------------------ |
| `id`          | long   | ✅   | 当前用户 ID                    |
| `userName`    | string |      | 昵称                           |
| `userAvatar`  | string |      | 头像 URL（通常由上传接口生成） |
| `userProfile` | string |      | 个人简介                       |
| `userGender`  | int    |      | 0/1/2                          |
| `userPhone`   | string |      | 手机号                         |
| `userEmail`   | string |      | 邮箱                           |

**响应**：`Boolean`。

### 4.2 上传头像

| 项         | 说明                                           |
| ---------- | ---------------------------------------------- |
| **URL**    | `POST /file/upload/avatar`                     |
| **鉴权**   | 已登录用户                                     |
| **请求体** | `multipart/form-data`，字段 `file`             |
| **限制**   | JPG / JPEG / PNG / GIF；≤2MB；魔数校验、防伪造 |
| **响应**   | `String`（可访问的头像 URL）                   |

### 4.3 管理员重置用户密码

| 项         | 说明                                |
| ---------- | ----------------------------------- |
| **URL**    | `POST /user/adminResetUserPassword` |
| **鉴权**   | 管理员                              |
| **请求体** | `application/json`                  |

| 字段          | 类型   | 必填 | 说明                       |
| ------------- | ------ | ---- | -------------------------- |
| `id`          | long   | ✅   | 目标用户 ID                |
| `newPassword` | string | ✅   | 新密码（会重新加密后写入） |

**响应**：`Boolean`。

---

## 5. 管理员用户运营接口

> 所有接口需管理员登录态，且通过 `@AuthCheck(mustRole = admin)` 及限流保护（60s 内 10~30 次不等）。

### 5.1 分页检索用户

| 项         | 说明                                |
| ---------- | ----------------------------------- |
| **URL**    | `POST /user/adminGetUserInfoByPage` |
| **请求体** | `AdminQueryUserRequest`             |
| **响应**   | `Page&lt;UserVO&gt;`                |

关键参数：

| 字段                                                                                                      | 说明                                  |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `current` / `pageSize`                                                                                    | 分页配置，建议 `pageSize ≤ 50`        |
| `sortField` / `sortOrder`                                                                                 | 排序字段，如 `createTime` + `descend` |
| `userAccount`, `userName`, `userRole`, `userStatus`, `userGender`, `userPhone`, `userEmail`, `planetCode` | 过滤条件                              |
| `createTimeStart`, `createTimeEnd`                                                                        | 时间范围                              |

### 5.2 查看用户详情

| 项         | 说明                             |
| ---------- | -------------------------------- |
| **URL**    | `POST /user/getUserById`         |
| **请求体** | `{ "id": 1899878538809757698 }`  |
| **响应**   | `User`（包含密码哈希，谨慎展示） |

### 5.3 新增用户

| 项         | 说明                                                     |
| ---------- | -------------------------------------------------------- |
| **URL**    | `POST /user/addUser`                                     |
| **请求体** | `AdminAddUserRequest`（与注册字段类似，可设置角色/资料） |
| **响应**   | `Long`（新用户 ID）                                      |

### 5.4 更新用户

| 项         | 说明                             |
| ---------- | -------------------------------- |
| **URL**    | `POST /user/adminUpdateUserInfo` |
| **请求体** | `AdminUpdateUserInfoRequest`     |
| **响应**   | `Boolean`                        |

### 5.5 逻辑删除用户

| 项         | 说明                                      |
| ---------- | ----------------------------------------- |
| **URL**    | `POST /user/deleteUserById`               |
| **请求体** | `{ "id": 1899878538809757698 }`           |
| **响应**   | `Boolean`（设置 `is_delete`，账号可复用） |

### 5.6 封禁 / 解封用户

| 项         | 说明                                                               |
| ---------- | ------------------------------------------------------------------ |
| **URL**    | `POST /user/adminBanOrUnbanUser`                                   |
| **请求体** | `{ "id": 1899878538809757698, "userStatus": 1 }`（1=封禁，0=解封） |
| **响应**   | `Boolean`                                                          |

---

## 6. 数据模型摘要

### 6.1 `UserLoginVO`

| 字段                                     | 类型     | 说明             |
| ---------------------------------------- | -------- | ---------------- |
| `id`                                     | long     | 用户 ID          |
| `userAccount`                            | string   | 登录账号         |
| `userName`                               | string   | 显示昵称         |
| `userAvatar`                             | string   | 头像 URL         |
| `userProfile`                            | string   | 简介             |
| `userRole`                               | string   | `user` / `admin` |
| `userGender`                             | int      | 0/1/2            |
| `userPhone`                              | string   | 手机号           |
| `userEmail`                              | string   | 邮箱             |
| `planetCode`                             | string   | 星球编号         |
| `editTime` / `createTime` / `updateTime` | datetime | 时间字段         |

### 6.2 `UserVO`

在 `UserLoginVO` 基础上增加：`userStatus`、`isDelete`、分页元信息等，供管理员列表使用。

---

## 7. 示例

### 7.1 登录成功

```http
POST /api/user/login HTTP/1.1
Content-Type: application/json

{
  "userAccount": "Admin01",
  "userPassword": "Admin..1024"
}
```

```json
{
  "success": true,
  "code": 20000,
  "message": "操作成功",
  "data": {
    "id": 1980484882008412161,
    "userAccount": "Admin01",
    "userName": "管理员",
    "userRole": "admin",
    "userAvatar": "/default_admin_avatar.png",
    "userProfile": "系统超级管理员，拥有所有权限"
  }
}
```

### 7.2 未登录访问受限接口

```json
{
  "success": false,
  "code": 40100,
  "message": "未登录",
  "data": null
}
```

---

## 8. 变更记录

| 日期       | 版本  | 内容                                        | 作者    |
| ---------- | ----- | ------------------------------------------- | ------- |
| 2025-11-16 | 1.0.0 | 基于 Knife4j 数据重新编排，采用专业文档格式 | ChatGPT |

> 若新增或调整接口，请同步更新 Controller 注释、Knife4j 描述与本手册，保持多端一致性。
