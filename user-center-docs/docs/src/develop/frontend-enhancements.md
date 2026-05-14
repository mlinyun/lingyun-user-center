# 前端页面魔改与功能实现

## 前言

Ant Design Pro 是基于 Ant Design 和 umi
的封装的一整套企业级中后台前端/设计解决方案，已经是很完善的产品了，我们的用户中心项目的前端部分就是基于这个模板来进行的二次开发，既然是二次开发，我们就需要根据自己的项目，把这个前端模板修改成我们想要的样子！！！

## Ant Design Pro 登录页面

这里先给出 Ant Design Pro 默认的登录页面，方便我们与修改之后的页面做对比。

![image-20240131221537209](https://static.mlinyun.com/user-center/image-20240131221537209.png)

我们需要做的就是对该页面进行精简，删除一些我们不需要用到的页面，然后再根据我们的用户中心项目，将登录页面修改成自己心仪的样子。

## 浏览器导航栏上的 favicon.ico 图标和标题

找到心仪的图片，然后将其转换为 `.ico`
类型的文件，大家可以自行搜索转换这个的网站，我这里用的是 [favicon.io](https://favicon.io/) 这个网站，这是它的功能：

![image-20240131225658596](https://static.mlinyun.com/user-center/image-20240131225658596.png)

然后我们将 `public/favicon.ico` 替换为我们自己生成的文件，要注意和 `favicon.ico` 保持同名（推荐），不同名也可以，只是需要我们修改一下代码，找到
`src/pages/document.ejs`文件，对其进行修改：

![image-20240131230611280](https://static.mlinyun.com/user-center/image-20240131230611280.png)

我这里就不修改了，和 `favicon.ico` 保持同名，下图是修改之后的效果：

![image-20240131230833217](https://static.mlinyun.com/user-center/image-20240131230833217.png)

接着我们修改 `Ant Design Pro` 文字，同样，这里也是修改成自己心仪的文字（可以修改成自己项目名），找到
`config/defaultSettings.ts` 文件，修改其中 `title` 值：

![image-20240131231253479](https://static.mlinyun.com/user-center/image-20240131231253479.png)

然后我们再来看看效果：

![image-20240131231354102](https://static.mlinyun.com/user-center/image-20240131231354102.png)

## 修改 Footer 组件

我找到 Footer 组件 `src/components/Footer/index.tsx`，对其进行如下修改：

![image-20240131235405042](https://static.mlinyun.com/user-center/image-20240131235405042.png)

修改完之后的效果如下图所示：

![image-20240131235834451](https://static.mlinyun.com/user-center/image-20240131235834451.png)

## 修改用户登录页面

### 更改 logo 图标

我们设置项目的 logo 有 2 中方式，一种是使用在线的图片（鱼皮的视频教程中使用这种方式），另一种则是使用本地的图片（我使用这种方式）。首先找到我们心仪的
logo ，然后将原来的 logo（`public/logo.svg`
）替换掉就行。我们可以使用阿里妈妈MUX倾力打造的矢量图标管理、交流平台（[iconfont](https://www.iconfont.cn/)）来找到我们心仪的
logo 图片。

### 定义全局常量

logo 在我们的项目中可能会多次用到，所以我们将 logo 的路径定义为一个全局的常量，在 `src` 下新建目录 `/constants`，然后在该目录下新建
`index.tsx` 文件，然后写入下面的代码：

```tsx
export const SYSTEM_LOGO = "/logo.svg";
```

接着在登录页面中使用这个常量，打开 `src/pages/user/Login/index.tsx` 文件，需要先导入这个 `SYSTEM_LOGO` 常量，然后再使用该常量：

```tsx
// 导入 SYSTEM_LOGO 常量
import { SYSTEM_LOGO } from "@/constants";

// 使用 SYSTEM_LOGO 常量
<LoginForm
  logo={<img alt="logo" src={SYSTEM_LOGO} />}
  // 省略其他代码 ......
></LoginForm>;
```

### logo 图标居中

在浏览器查看登录页的效果时，发现 logo 文字没有居中，个人感觉 logo 偏上，不是很好看，如下图所示：

![image-20240201022407169](https://static.mlinyun.com/user-center/image-20240201022407169.png)

检查发现 `vertical-align: middle;` 这个样式在 Chrome 浏览器好像不生效，所以我就给 `img` 标签额外添加了一个类 `.logo`
，并设置了如下的样式：

```less
.logo {
  vertical-align: -webkit-baseline-middle;
}
```

我们将上面的这个样式写入到 `src/pages/user/Login/index.less` 文件中：

![image-20240201023302144](https://static.mlinyun.com/user-center/image-20240201023302144-1706725989555-3.png)

然后我们还需要给 `img` 添加类名 `.logo`，使用 `className` 给标签添加类：

![image-20240201023540121](https://static.mlinyun.com/user-center/image-20240201023540121.png)

完成上面的步骤之后，我们就可以到浏览器查看效果了：

![image-20240201024105675](https://static.mlinyun.com/user-center/image-20240201024105675.png)

### 删除多余的代码

默认的登录页面有许多功能，但是这些在我们的用户中心项目中是不需要用到的（比如其他登录方式，手机号登录），我们直接删除即可。

删除其他登录方式，手机号登录，输出密码的提示信息（删除下面红框中的代码）：

![image-20240201025432053](https://static.mlinyun.com/user-center/image-20240201025432053.png)

![image-20240201032014355](https://static.mlinyun.com/user-center/image-20240201032014355.png)

删除没用到的样式代码，即删除 `icon` 样式类

![image-20240201035148332](https://static.mlinyun.com/user-center/image-20240201035148332.png)

至此，我们的用户登录页面就修改完成了，下面来看看最终的效果：

![image-20240201035601133](https://static.mlinyun.com/user-center/image-20240201035601133.png)

## 前端实现登录功能

### 修改前端登录参数

在发送请求时，我们前端传递的参数要和后端的接口参数一致，所以我们必须修改前端登录时发送的参数。

后端登录接口参数：

![image-20240201040322191](https://static.mlinyun.com/user-center/image-20240201040322191.png)

前端登录参数修改，打开 `src/services/ant-design-pro/typings.d.ts` 文件，做如下修改：

![image-20240201040956446](https://static.mlinyun.com/user-center/image-20240201040956446-1706732317978-5.png)

如果使用的是 win11 的微软拼音输入法，那么在 IDEA 中 Shift + F6
快捷键可能会失效（我的就是这样），解决的方法可以查看这篇文章：[解决win11中快捷键不能使用的问题(shift+F6)](https://blog.csdn.net/tianjiliuhen/article/details/131706669?spm=1001.2014.3001.5502)。

除了进行上面的修改，还需要对表单项中的 `name` 属性进行如下的修改：

![image-20240201131142306](https://static.mlinyun.com/user-center/image-20240201131142306.png)

这样前端传递到后端的参数才保持一致。

### 解决控制台报错

打开调试工具，点击 Console 面板，可以看到 `Tabs.TabPane is deprecated. Please use items directly.` 的报错信息，大致意思是
`Tabs.TabPane` 已弃用，请直接使用 `item`。

![image-20240201124034840](https://static.mlinyun.com/user-center/image-20240201124034840.png)

知道了报错原因，那么我们修改起来就比较容易了，我们直接去官网（[Tabs 标签页](https://ant-design.antgroup.com/components/tabs-cn)
）看看 `item` 是如何使用的：

![image-20240201125604210](https://static.mlinyun.com/user-center/image-20240201125604210.png)

原先的代码如下：

```tsx
<Tabs activeKey={type} onChange={setType}>
  <Tabs.TabPane key="account" tab={"账号密码登录"} />
</Tabs>
```

修改之后的代码：

```tsx
import type { TabsProps } from "antd";

const items: TabsProps["items"] = [{ key: "account", label: "账号密码登录" }];

<Tabs activeKey={type} onChange={setType} items={items}></Tabs>;
```

之后再打开控制台 Console 就不会有 `Tabs.TabPane is deprecated.....` 的报错信息了。

### 全局请求配置

在之前的 Ant Design Pro 项目中 request 定义在 `src/utils/request.ts` 中，但在 V5 中需要用 umi 的 RequestConfig，各项配置需要写在
app.tsx 中进行实现。所以我们打开 `app.tsx` 文件，写入如下的配置：

```ts
/** 全局请求配置 */
export const request: RequestConfig = {
  // 设置请求超时时长 10s
  timeout: 10000,
};
```

关于 `RequsetConfig` 更多的参数配置，建议大家自行查看源码（因为在官方的文档中好像没有介绍）：

![image-20240201141324401](https://static.mlinyun.com/user-center/image-20240201141324401.png)

### 解决跨域问题

解决跨域问题可以在后端实现支持跨域，但是后端支持跨域不安全，所以不是很推荐，也可以在前端配置代理（推荐），我们这里就用这种方式，Ant
Design Pro 就给我提供了代理的功能，我们打开 `config/proxy.ts` 文件，进行如下的配置就行：

![image-20240203135756445](https://static.mlinyun.com/user-center/image-20240203135756445.png)

上述配置表示，将 `/api` 前缀的请求，代理到 `http://localhost:8100`，如请求 `/api/a`
，实际上是请求 `http://localhost:8100/api/a`。

注意：我们之前在使用 Postman 工具对后端的登录注册接口进行测试的时候，我们指定了项目路径前缀为 `api`：

![image-20240201144623383](https://static.mlinyun.com/user-center/image-20240201144623383.png)

那么如果我们没有在后端指定路径前缀呢？答案是在配置代理的时候，将 `/api` 进行重写为空就行，代码如下：

![image-20240201151937187](https://static.mlinyun.com/user-center/image-20240201151937187.png)

这时如果我们请求 `/api/a`，实际上是请求 `http://localhost:8100/a`。

> 注意：我就不配置 `pathRewrice` 了，这里只是为了演示。

### 修改前端登录接口的 URL

在写后端的登录接口时，我们设置的路径是 `/api/user/login`，所以在前端请求的地址也要一致：

![image-20240201153546981](https://static.mlinyun.com/user-center/image-20240201153546981.png)

### 执行登录请求（测试）

在完成上面的步骤之后，我们就可以来测试登录请求了：

![image-20240201155219197](https://static.mlinyun.com/user-center/image-20240201155219197.png)

从上图中可以看到，我们的登录请求已经成功被后端执行了，它会返回脱敏后的用户信息，我们打开查看一下：

![image-20240201160206364](https://static.mlinyun.com/user-center/image-20240201160206364.png)

可以看到，我们已经成功获取到了脱敏的后的用户信息。

### 前端密码长度校验

我们再对密码的长度进行校验，让其不小于 8 位（包含 8 位），这个校验也比较简单，因为 Ant Design Pro 的表单组件已经帮我们实现了，我们在
`rules` 规则添加 `min` 就行：

![image-20240201161229253](https://static.mlinyun.com/user-center/image-20240201161229253.png)

我们测试一下效果：

![image-20240201161354146](https://static.mlinyun.com/user-center/image-20240201161354146.png)

### 修改 handleSubmit 函数

这里我们先简单的修改一下 `handleSubmit` 这个函数：

![image-20240201162341696](https://static.mlinyun.com/user-center/image-20240201162341696.png)

此时我们在执行登录请求，就会弹出登录成功！！！

![image-20240201163619481](https://static.mlinyun.com/user-center/image-20240201163619481.png)

## 前端实现注册功能

### 复制登录页面

这里我们不需要从零开始写注册页面，因为我们的注册页面和登录页面很像，所以我们直接复制登录页面，然后对其进行修改就行，复制登录页面并重命名为
`Register`。

![image-20240201170210784](https://static.mlinyun.com/user-center/image-20240201170210784.png)

### 添加路由规则

打开路由配置文件 `config/routes.ts`，添加如下路由规则：

```ts
routes: [
  { name: "登录", path: "/user/login", component: "./user/Login" },
  { name: "注册", path: "/user/register", component: "./user/Register" },
  { component: "./404" },
];
```

![image-20240201170804554](https://static.mlinyun.com/user-center/image-20240201170804554.png)

此时访问：`http://localhost:8000/user/register` ，发现被强制重定向至登录页面，此时想到 Ant Design Pro
是一个后台管理系统，在未登录情况下想操作其它页面，势必会被强制路由到登录页面，所以需要修改此逻辑：

修改项目入口文件 `src/app.tsx`：

![image-20240201174627423](https://static.mlinyun.com/user-center/image-20240201174627423.png)

然后将注册和登录的路由设置为白名单，跳转到这两个路由的时候不需要重定向到登录页面：

![image-20240201175100763](https://static.mlinyun.com/user-center/image-20240201175100763.png)

### 编写注册页面

我们的注册页面是在登录页面的基础上进行修改的，所以我们需要删除一下不需要用的功能，然后修改成自己心仪的注册页面，最后再实现一下注册的逻辑即可。

增加 `API.RegisterParams` 和 `API.RegisterResult`，打开 `src/services/ant-design-pro/typings.d.ts` 文件，写入以下代码：

```ts
type RegisterParams = {
  userAccount?: string;
  userPassword?: string;
  checkPassword?: string;
  type?: string;
};

type RegisterResult = number;
```

![image-20240202014214778](https://static.mlinyun.com/user-center/image-20240202014214778.png)

编写注册请求接口 `register`，打开 `src/services/ant-design-pro/api.ts` 文件，写入以下代码：

```ts
/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.RegisterResult>("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
```

![image-20240202014520351](https://static.mlinyun.com/user-center/image-20240202014520351.png)

然后接着在 `src/pages/user/Register/index.tsx` 文件写注册页面，还有注册逻辑代码，这里给出最终的代码：

```tsx
import Footer from "@/components/Footer";
import { register } from "@/services/ant-design-pro/api";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import type { TabsProps } from "antd";
import { message, Tabs } from "antd";
import React, { useState } from "react";
import { history } from "umi";
import styles from "./index.less";
import { SYSTEM_LOGO } from "@/constants";

const Register: React.FC = () => {
  const [type, setType] = useState<string>("account");

  const handleSubmit = async (values: API.RegisterParams) => {
    // 获取表单项填写的值
    const { userPassword, checkPassword } = values;
    // 校验
    if (userPassword !== checkPassword) {
      message.error("两次输入的密码不一致");
      return;
    }
    try {
      // 注册
      const id = await register({
        ...values,
        type,
      });
      if (id > 0) {
        const defaultLoginSuccessMessage = "注册成功！";
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname: "/user/login",
          query,
        });
        return;
      } else {
        throw new Error(`register error id = ${id}`);
      }
    } catch (error) {
      const defaultLoginFailureMessage = "注册失败，请重试！";
      message.error(defaultLoginFailureMessage);
    }
  };
  const items: TabsProps["items"] = [{ key: "account", label: "账号密码注册" }];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img className={styles.logo} alt="logo" src={SYSTEM_LOGO} />}
          title="凌云用户中心系统"
          subTitle={"企业核心的用户中心系统，基于 Spring Boot + React 开发的全栈系统"}
          submitter={{
            searchConfig: {
              submitText: "注册",
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType} items={items} />

          {type === "account" && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={"请输入账号"}
                rules={[
                  {
                    required: true,
                    message: "账号是必填项！",
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={"请输入密码"}
                rules={[
                  {
                    required: true,
                    message: "密码是必填项！",
                  },
                  {
                    min: 8,
                    type: "string",
                    message: "密码长度不小于 8",
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={"请确认密码"}
                rules={[
                  {
                    required: true,
                    message: "确认密码是必填项！",
                  },
                  {
                    min: 8,
                    type: "string",
                    message: "密码长度不小于 8",
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
```

### 执行注册请求（测试）

在完成上面的步骤之后，我们就可以来测试注册录请求了：

测试校验，两次填入的密码不一致：

![image-20240201225725605](https://static.mlinyun.com/user-center/image-20240201225725605.png)

测试已存在的用户，结果如下：

![image-20240202002345418](https://static.mlinyun.com/user-center/image-20240202002345418.png)

接着我们正常注册一个新用户，成功的话返回的是新用户的 id 值：

![image-20240202003133397](https://static.mlinyun.com/user-center/image-20240202003133397.png)

### 添加去注册链接

上面测试的时候，我们是在地址栏输入注册的 URL，但是在我们的页面中，没有添加去注册的链接，所以我们在登录页面写上去注册的链接，我们修改一下登录页面原来的代码，并加上去注册的链接，修改后的代码如下：

```tsx
<div
  style={{
    marginBottom: 24,
  }}
>
  <Space split={<Divider type="vertical" />}>
    <ProFormCheckbox noStyle name="autoLogin">
      自动登录
    </ProFormCheckbox>
    <Link to="/user/register">没账号，去注册</Link>
    <a href={GITHUB_URL} target="_blank" rel="noreferrer">
      忘记密码 ?
    </a>
  </Space>
</div>
```

![image-20240202015640801](https://static.mlinyun.com/user-center/image-20240202015640801.png)

我们到浏览器中查看效果如下：

![image-20240202015753360](https://static.mlinyun.com/user-center/image-20240202015753360.png)

同样，我们也在注册页面添加去登陆的链接，在 `src/pages/user/Register/index.tsx` 文件中添加下面的代码：

```tsx
<div
  style={{
    marginBottom: 24,
    paddingRight: 8,
    float: "right",
  }}
>
  <Link to="/user/login">老用户？返回登录</Link>
</div>
```

![image-20240202020000037](https://static.mlinyun.com/user-center/image-20240202020000037.png)

在浏览器中查看效果：

![image-20240202020141831](https://static.mlinyun.com/user-center/image-20240202020141831.png)

## 后端实现获取当前用户信息功能

### 编写 Service 层代码

用户服务（`UserService.java`）编写 **获取当前用户信息服务接口**，代码如下：

```java
/**
 * 获取当前用户信息
 *
 * @param request 请求
 * @return 当前登录的用户信息
 */
User getCurrentUser(HttpServletRequest request);
```

![image-20240202022812131](https://static.mlinyun.com/user-center/image-20240202022812131.png)

用户服务实现类（`UserServiceImpl.java`） **实现获取当前用户信息服务**，代码如下：

```java
/**
 * 获取当前用户信息服务实现
 *
 * @param request 请求
 * @return 当前登录的用户信息
 */
@Override
public User getCurrentUser(HttpServletRequest request) {
    Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
    User currentUser = (User) userObj;
    if (currentUser == null) {
        return null;
    }
    Long userId = currentUser.getId();
    // TODO 校验用户是否合法
    User user = userMapper.selectById(userId);
    return getSafetyUser(user);
}
```

![image-20240202122953186](https://static.mlinyun.com/user-center/image-20240202122953186.png)

在上面的代码中，我们从 session 中获取了登录态，然后将其强转为 User 对象，然后我们再得到改用的 id 值，最后根据该 id
去数据库中查询该用户最新的信息，再返回脱敏后的用户信息，在这种情况下，可能会出现一种情况，那就是在数据库中可能查询不到该用户，这样再调用
`getSafetyUser()` 函数时就会报错，所以这里我们还需要修改一下 `getSafetyUser()` 函数，加上判空处理，在该函数的最前面加上下面的代码即可：

```java
// 判空
if (originUser == null) {
    return null;
}
```

![image-20240202124103382](https://static.mlinyun.com/user-center/image-20240202124103382.png)

### 编写 Controller 层代码

我们接着在 `UserController.java` 文件中写入如下的代码：

```java
/**
 * 获取当前用户信息接口
 *
 * @param request 请求
 * @return 当前登录的用户信息
 */
@GetMapping("/currentUser")
public User getCurrentUser(HttpServletRequest request) {
    return userService.getCurrentUser(request);
}
```

![image-20240202124426693](https://static.mlinyun.com/user-center/image-20240202124426693.png)

### 获取当前用户信息接口测试

在测试前，我们需要进行一下登录，该接口是所有用户都可以调用的，所以这里我登录的是普通账号（mlinyun），登录成功之后，我们就可以获取当前登录的用户信息了：

![image-20240202125650265](https://static.mlinyun.com/user-center/image-20240202125650265.png)

## 前端实现获取当前用户信息功能

Ant Design Pro (Umi 框架) 获取初始状态流程：首次访问页面（刷新页面），进入 `app.tsx` ，执行 `getInitialState`
方法，该方法的返回值就是全局可用的状态值，其中，就有 `queryCurrentUser` 方法，该方法是 Ant Design Pro
提供的获取当前用户信息的接口，不过在我们的项目中，他写的接口不适用与我们的项目，所以我们需要对其进行修改，主要修改请求的地址，返回的对象
`currentUser`，与我们返回的用户信息对应起来：

### 编写获取当前用户接口

```ts
/** 获取当前的用户 GET /api/user/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>("/api/user/currentUser", {
    method: "GET",
    ...(options || {}),
  });
}
```

![image-20240202142549445](https://static.mlinyun.com/user-center/image-20240202142549445.png)

### 修改 `API.CurrentUser` 类型

我们将 `CurrentUser` 的字段与我们后端返回的用户信息字段对应起来：

```ts
type CurrentUser = {
  id: number;
  username: string;
  userAccount: string;
  avatarUrl?: string;
  gender: number;
  phone: string;
  email: string;
  userStatus: number;
  createTime: Date;
  userRole: number;
};
```

![image-20240202173024224](https://static.mlinyun.com/user-center/image-20240202173024224.png)

### 获取用户登录状态功能实现

除了登陆页面和注册页面，所有页面都需要获取用户的登录状态，如果未登录，跳转至登录页面：

```tsx
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是无需登录的页面，则需要执行 fetchUserInfo 函数，获取当前用户信息
  if (!NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  // 无需登录的页面，不需要执行 fetchUserInfo 函数
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}
```

![image-20240202150504132](https://static.mlinyun.com/user-center/image-20240202150504132.png)

因为我们修改了 `API.CurrentUser` 这个，所以用到这个的也许修改，主要修改水印，头像，用户名的引用：

`src/app.tsx`

![image-20240202153937976](https://static.mlinyun.com/user-center/image-20240202153937976.png)

`src/components/RightContent/AvatarDropdown.tsx`

![image-20240202154245363](https://static.mlinyun.com/user-center/image-20240202154245363.png)

修改页面左上角的 logo，`config/defaultSettings.ts`：

![image-20240202155438040](https://static.mlinyun.com/user-center/image-20240202155438040.png)

遇到的报错信息：

![image-20240202161706867](https://static.mlinyun.com/user-center/image-20240202161706867.png)

> 补充：
>
> 上面遇到的问题，我在查阅 Ant Design Pro
> 官网之后，有了解决的办法，具体的可以看这里 [标题和加载页](https://pro.ant.design/zh-CN/docs/title-landing)。
>
> ![image-20240202162148301](https://static.mlinyun.com/user-center/image-20240202162148301.png)
>
> 当然，使用我上面的方式导入也没问题，能实现我们的效果，但可能不是很规范，用官网的方法就是删除 `config/defaultSettings.ts` 中
> `logo` 的配置，然后在 `src/app.tsx` 中配置 `logo`，
>
> ![image-20240202163242344](https://static.mlinyun.com/user-center/image-20240202163242344.png)
>
> ![image-20240202163412124](https://static.mlinyun.com/user-center/image-20240202163412124.png)

接下来我们尝试登录一下：

![image-20240202154808843](https://static.mlinyun.com/user-center/image-20240202154808843.png)

注意，我们在用户注册的时候，是没有给用户设置头像的选项的（后面会实现），我这里有头像是因为我自己修改了数据库中 `avatarUrl`
字段的值，可以将其改为在线图片的 URL 地址，也可以用本地的 URL 地址（我用的就是这种方式），然后将头像的图片存放在 `public`
文件下，同样，`username` 也没有设置（后面会实现），我也是直接修改数据库中的值：

![image-20240202160104339](https://static.mlinyun.com/user-center/image-20240202160104339.png)

## 前端实现用户管理功能

### 新建页面并添加路由

我们在 `src/pages` 目录新建一个 `Admin` 目录，该目录用来存放和管理员有关的页面，为了方便，我们直接复制 `Register` 目录到
`Admin` 目录下，并重命名为 `UserManage`，如下图所示：

![image-20240202183326573](https://static.mlinyun.com/user-center/image-20240202183326573.png)

接着，我们在 `config/routes.ts` 文件中添加路由：

```ts
{ path: '/admin/user-manage', name: '用户管理', icon: 'smile', component: './Admin/UserManage' },
```

![image-20240202183703196](https://static.mlinyun.com/user-center/image-20240202183703196.png)

### 判断管理员逻辑

我们还需要在前端判断当前登录的用户是否为管理员，以便有权限访问用户管理页面，在 `user` 表中，我们设计了 `userRole`
字段，用来存储用户的类型，我们就可以根据这个字段，来判断当前登录的用户是否为管理员，我们打开 `src/access.ts`，做如下的修改：

```ts
canAdmin: currentUser && currentUser.userRole === 1,
```

![image-20240202184338975](https://static.mlinyun.com/user-center/image-20240202184338975.png)

此时我们使用管理员账号 `LingYun` 登录，就有权限访问 用户管理页面了：

![image-20240202184637403](https://static.mlinyun.com/user-center/image-20240202184637403.png)

上面的二级管理页面我们不需要用到，删除即可，它的二级管理页面指向的是欢迎页面（暂时保留），所以只需要把二级管理页的路由删除即可，即删除下面的代码：

```ts
{ path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
```

### ProComponents 高级表格

[ProComponents](https://procomponents.ant.design/) 是基于 Ant Design 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著地提升制作
CRUD 页面的效率，更加专注于页面。

这里我们使用 ProComponents 提供的高级表格 [ProTable](https://procomponents.ant.design/components/table) 来快速完成我们的用户管理页面：

1. 通过 columns 定义表格有哪些列

2. columns 属性

   dataIndex 对应返回数据对象的属性

   title 表格列名

   copyable 是否允许复制

   ellipsis 是否允许缩略

   valueType：用于声明这一列的类型（dateTime、select）

这里我们直接去官网复制它提供的代码，然后根据我们项目的实际情况修改成代码：

```tsx
import React from "react";
import styles from "./index.less";
import { ActionType, ProColumns, TableDropdown } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { useRef } from "react";
import { searchUser } from "@/services/ant-design-pro/api";
import { Image } from "antd";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: "序号",
    dataIndex: "id",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "用户名",
    dataIndex: "username",
    ellipsis: true,
    tip: "username",
  },
  {
    title: "用户账号",
    dataIndex: "userAccount",
    copyable: true,
    ellipsis: true,
    tip: "userAccount",
  },
  {
    title: "用户头像",
    dataIndex: "avatarUrl",
    render: (_, record) => (
      <div>
        <Image src={record.avatarUrl} width={60} height={60} />
      </div>
    ),
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 80,
  },
  {
    title: "电话",
    dataIndex: "phone",
    copyable: true,
  },
  {
    title: "邮件",
    dataIndex: "email",
    copyable: true,
  },
  {
    title: "状态",
    dataIndex: "userStatus",
    initialValue: 0,
    valueEnum: {
      0: { text: "正常", status: "Processing" },
      1: { text: "封号", status: "Error" },
    },
  },
  {
    title: "角色",
    dataIndex: "userRole",
    valueType: "select",
    valueEnum: {
      0: { text: "普通用户", status: "Default" },
      1: { text: "管理员", status: "Success" },
    },
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    valueType: "dateTime",
    sorter: true,
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" },
        ]}
      />,
    ],
  },
];

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <div id={styles.userManage}>
      <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          const userList = await searchUser();
          return {
            data: userList,
          };
        }}
        editable={{
          type: "multiple",
        }}
        columnsState={{
          persistenceKey: "pro-table-singe-demos",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
          onChange(value) {
            console.log("value: ", value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户表格"
      />
    </div>
  );
};
export default UserManage;
```

上面的代码，我们调用了搜索用户 `searchUser()` 函数，所以我们需要增加前端搜索用户的接口：

```tsx
/** 搜索用户列表 GET /api/user/search */
export async function searchUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser[]>("/api/user/search", {
    method: "GET",
    ...(options || {}),
  });
}
```

![image-20240205132817482](https://static.mlinyun.com/user-center/image-20240205132817482.png)

完成上面的步骤，我们就可以获取到所有用户信息，但是此时我出现了一个问题：

![image-20240205133536238](https://static.mlinyun.com/user-center/image-20240205133536238.png)

从上面的报错信息来看，我们的前端已经成功向后端发送了搜索用户的请求了，此时后端也是处理了，但是就是前端发送的请求缺少参数
`username`，此时我想：我们查询所有用户也不需要 `username` 参数啊？难道我还需要在后端自己再写一个无需 `username`
参数就可以查询所有用户的接口？有或者会不会是我后端写的搜索用户接口逻辑不对，果不其然，在前面我后端实现用户搜索的时候，是根据用户名去搜索的，而且在我写的代码中，我设置了前端必须提供
`username` 参数，否则返回 `null`，但是在前端我们发送搜索全部用户的时候，是不需要提供 `username`
参数的，我重新回去看了一下鱼皮写得代码，发现他的逻辑是，前端发送的查询用户请求可以不带 `username` 参数，此时查询数据库中的所有用户，也可以带
`username` 参数，此时根据用户名进行模糊查询，所以我们需要修改后端搜索用户功能。

![image-20240204225640450](https://static.mlinyun.com/user-center/image-20240204225640450.png)

修改完之后再次启动后端项目，然后我们再刷新前端页面，这次就可以获得全部的用户信息了：

![image-20240205135025170](https://static.mlinyun.com/user-center/image-20240205135025170.png)

## 后端实现用户注销功能

### 编写 Service 层代码

用户服务（`UserService.java`）编写 **用户注销接口**，代码如下：

```java
/**
 * 用户注销功能
 *
 * @param request 请求
 * @return true - 注销成功 false - 注销失败
 */
boolean userLogout(HttpServletRequest request);
```

![image-20240205140212484](https://static.mlinyun.com/user-center/image-20240205140212484.png)

用户服务实现类（`UserServiceImpl.java`） **实现用户注销服务**，代码如下：

```java
/**
 * 用户注销服务实现
 *
 * @param request 请求
 * @return true - 注销成功 false - 注销失败
 */
@Override
public boolean userLogout(HttpServletRequest request) {
    // 移除登录态
    request.getSession().removeAttribute(USER_LOGIN_STATE);
    return true;
}
```

![image-20240205140331068](https://static.mlinyun.com/user-center/image-20240205140331068.png)

### 编写 Controller 层代码

我们接着在 `UserController.java` 文件中写入如下的代码：

```java
/**
 * 用户注销接口
 * @param request 请求
 * @return true - 注销成功 false - 注销失败
 */
@PostMapping("/outLogin")
public Boolean userLogout(HttpServletRequest request) {
    if (request == null) {
        return null;
    }
    return userService.userLogout(request);
}
```

![image-20240205140453013](https://static.mlinyun.com/user-center/image-20240205140453013.png)

## 前端实现用户注销功能

前端实现用户注销功能十分简单，因为 Ant Design Pro 已经为我们写好了，我们只需要简单的修改一下前端用户注销的接口地址就行：

![image-20240205140710544](https://static.mlinyun.com/user-center/image-20240205140710544.png)

然后我们来测试一下用户注销功能，能获取到后端响应的信息 `true` 且页面跳转到登录页就成功了：

![image-20240205141108599](https://static.mlinyun.com/user-center/image-20240205141108599.png)

## Git 提交代码报错

这里我再记录一下2个错误，这是我在使用 git 提交代码的时候出现的一个错误，错误的信息如下，大致意思就是说不允许有空的语句块，这是
`Eslint` 的语法规范，解决的办法也很简单，我们保证不出现空语句块就行：

![image-20240205142655068](https://static.mlinyun.com/user-center/image-20240205142655068.png)

另外一个报错是因为标题提交不规范造成的，这里具体什么原因我没搞懂，解决的办法可以查看这篇文章，

![image-20240205144204739](https://static.mlinyun.com/user-center/image-20240205144204739.png)

我用的是那篇文章的第一种方法，可以成功提交代码：

![image-20240205144441168](https://static.mlinyun.com/user-center/image-20240205144441168.png)

## 用户校验

> 仅适用于用户可信的情况下，才采用这种方式，让用户自己填写 2-5 位编号，全凭用户自觉！！！
>
> 之后拉去星球用户数据，在定期清理违规的用户即可。

### 后端实现用户校验

我们需要在后端补充对用户编号的校验，长度校验，唯一性校验。

#### 用户表添加字段

给用户表添加一个字段 `planetCode`，用于存放用户的星球编码：

```sql
alter table user
    add planetCode varchar(512) not null comment '星球编号';
```

![image-20240205172415874](https://static.mlinyun.com/user-center/image-20240205172415874.png)

#### 用户实体类添加字段

给用户表心新建了 `planetCode` 字段之后，我们还需要更新一下实体类 user 对象：

```java
/**
 * 星球编号
 */
private String planetCode;
```

![image-20240205173310927](https://static.mlinyun.com/user-center/image-20240205173310927.png)

#### 用户信息脱敏补充新加的字段

找到用户信息脱敏的函数，添加下面的代码：

```java
safetyUser.setPlanetCode(originUser.getPlanetCode());
```

![image-20240205173803292](https://static.mlinyun.com/user-center/image-20240205173803292.png)

#### 用户注册接口添加新的字段

在用户进行注册时，我们需要填写星球编号，所以前端发送的注册请求需要带有 `planet` 参数：

![image-20240205175608918](https://static.mlinyun.com/user-center/image-20240205175608918.png)

注册接口添加参数 `planetCode`，

![image-20240205195448058](https://static.mlinyun.com/user-center/image-20240205195448058.png)

注册接口实现类也需要添加 `planetCode` 参数，并添加星球编号长度和唯一性校验，

```java
// 1.7 校验星球编号长度
if (planetCode.length() > 5) {
    return -1;
}

// 1.8 星球编号不能重复
queryWrapper = new QueryWrapper<>();
queryWrapper.eq("planetCode", planetCode);
count = userMapper.selectCount(queryWrapper);
if (count > 0) {
    return -1;
}

user.setPlanetCode(planetCode);
```

![image-20240205200726846](https://static.mlinyun.com/user-center/image-20240205200726846.png)

除了上面的校验之外，我们在存储注册的用户信息的时候，也要把 `planetCode` 星球编号存储到数据库中：

![image-20240205211042241](https://static.mlinyun.com/user-center/image-20240205211042241.png)

#### 用户注册接口测试

编写完代码之后，我们来测试一下用户接口，检查一下能不能注册成功：

![image-20240205210806808](https://static.mlinyun.com/user-center/image-20240205210806808.png)

### 前端实现用户校验

在前端部分，我们需要补充一个输入框，用来适配后端，这部分也比较简单。

我们在注册页面添加添加星球编号输入框：

```tsx
<ProFormText
  name="planetCode"
  fieldProps={{
    size: "large",
    prefix: <UserOutlined className={styles.prefixIcon} />,
  }}
  placeholder={"请输入星球编号"}
  rules={[
    {
      required: true,
      message: "星球编号是必填项！",
    },
  ]}
/>
```

![image-20240205212239084](https://static.mlinyun.com/user-center/image-20240205212239084.png)

修改前端登录参数的类型，增加 `planetCode` 参数：

![image-20240205212034265](https://static.mlinyun.com/user-center/image-20240205212034265.png)

接下来我们在注册页面尝试注册一个新用户：

![image-20240205212951158](https://static.mlinyun.com/user-center/image-20240205212951158.png)

点击注册按钮之后前端发送注册请求的参数如下：

![image-20240205212739685](https://static.mlinyun.com/user-center/image-20240205212739685.png)

后端返回的值：

![image-20240205213042474](https://static.mlinyun.com/user-center/image-20240205213042474.png)

可以看到，我们已经成功注册了，接着我们测试星球编号的唯一性，我们再注册一个星球编号为 3 的用户，

![image-20240205214020800](https://static.mlinyun.com/user-center/image-20240205214020800.png)

### 用户管理页面显示星球编号

在用户管理页面，我们需要把新加的这个星球编号显示在页面上。

修改 `CurrentUser` 类型：

![image-20240205220541899](https://static.mlinyun.com/user-center/image-20240205220541899.png)

接着给我的高级表格 [ProTable](https://procomponents.ant.design/components/table) 添加一列，用来显示显示星球编号：

```tsx
{
  title: '星号',
  dataIndex: 'planetCode',
  copyable: true,
  tip: '星球编号',
},
```

![image-20240205221933373](https://static.mlinyun.com/user-center/image-20240205221933373.png)

然后我们到浏览器查看效果：

![image-20240205222057434](https://static.mlinyun.com/user-center/image-20240205222057434.png)

### 优化表格显示

不知道大家注意到没有，性别一列我们的数据显示的是 `1`（表示男）或 `0`
（表示女），我们在开发的时候，当然知道1和0各自表示什么，但如果是普通的用户，他可能不知道表示什么含义，所以我们用文字显示出来，会比较友好一些。

要实现上面的功能也是非常容易的，如果是 1 我就在页面显示 '男'， 如果是 2 我们就在页面显示 '女'，这就要用到条件渲染了。我之前学过
Vue 框架，Vue 中提供了条件渲染指令 `v-if`。那么在 React 呢？因为我在做这个项目之前，是没有学过 React 的，所以我去查阅了一下
React 官网的教程，也找到了条件渲染的写法，只不过他是使用 Javascript
实现的，具体的大家可以看官网关于 [条件渲染](https://zh-hans.react.dev/learn#conditional-rendering) 的教程。

![image-20240205232040831](https://static.mlinyun.com/user-center/image-20240205232040831.png)

学会了 React 条件渲染的语法，我们就可以来修改一下性别列的显示了：

```tsx
{
  title: '性别',
  dataIndex: 'gender',
  width: 80,
  render: (_, record) => {
    const flag = record.gender;
    let content;
    if (flag) {
      content = '男';
    } else {
      content = '女';
    }
    return <div>{content}</div>;
},
```

当然，你也可以使用条件表达式，这样代码会更简洁一些：

```tsx
  {
    title: '性别',
    dataIndex: 'gender',
    width: 80,
    render: (_, record) => {
      const flag = record.gender;
      return <div>{flag ? '男' : '女'}</div>;
    },
  },
```

修改完成之后，我们再来看看效果：

![image-20240205232702645](https://static.mlinyun.com/user-center/image-20240205232702645.png)
