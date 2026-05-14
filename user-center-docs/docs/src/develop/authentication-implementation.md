# 实现登录注册功能

## 规整项目目录

按照下图所示的操作执行：

![image-20240129193956323](https://static.mlinyun.com/user-center/image-20240129193956323.png)

## 删除测试代码

删除 `/model/User.java` 和 `/mapper/UserMapper.java` 两个文件。

接着删除测试类中 `UserCenterApplicationTests.java`，中部分代码，如下所示：

![image-20240129195002207](https://static.mlinyun.com/user-center/image-20240129195002207.png)

## 实现基本的数据库操作

操作 `user` 表

将模型中的 `user` 对象和数据库中 `user` 表的字段关联（**使用插件 MyBatisX 自动生成**）

### 安装 MyBatisX 插件

首先我们需要在 IDEA 中安装 MyBatisX 插件：

![image-20240129200814076](https://static.mlinyun.com/user-center/image-20240129200814076.png)

### MyBatisX 自动生成代码

安装成功之后，我们就可以使用 MyBatisX 插件了：

![image-20240129201339963](https://static.mlinyun.com/user-center/image-20240129201339963.png)

接着会弹出一个窗口，我们按照下图填写对应的信息就可以了：

![image-20240129202251147](https://static.mlinyun.com/user-center/image-20240129202251147.png)

接着进行下面的配置：

![image-20240129221833591](https://static.mlinyun.com/user-center/image-20240129221833591.png)

右键表 => MyBatisX-Generator => Next => 勾选 MyBatis-Plus3 => 勾选 Comment（注释）、Actual Column（每一个列的实际列名）、
Model（生成 domain ） 、 Lombok（使用 Lombok 注解） => 勾选 mybatis-plus3 => Finish最后点击完成即可生成相应的代码：

![image-20240129225144917](https://static.mlinyun.com/user-center/image-20240129225144917.png)

使用 MyBatisX 插件自动生成 domain 实体对象、mapper （操作数据库对象） 、mapper.xml （定义了mapper对象和数据库关联，可以在里面自己写
SQL ）、service（包含常用的增删改查）、serviceImpl（ service 实现类）。

然后我们需要将生成的代码移动到指定的目录中
将 `/domain/User.java` 移动到 `/model` 文件夹中
将 `/generator/mapper/UserMapper.java` 文件移动到 `/mapper` 文件夹中
将 `/generator/service/UserService.java` 文件移动到 `/service` 文件夹中
将 `/generator/service/imp/` 文件夹移动到 `/service` 文件夹中
注意，在移动文件或文件夹的时候，要注意执行重构，移动之后的项目目录如下：

![image-20240129233633113](https://static.mlinyun.com/user-center/image-20240129233633113.png)

### 创建测试类

我们按照下图所示的方法创建测试类

![image-20240129235627685](https://static.mlinyun.com/user-center/image-20240129235627685.png)

之后弹窗一个窗口，我们不用进行更改，默认就行，然后点击确定，就会创建 `UserServiceTest.java` 测试文件。

![image-20240129235724461](https://static.mlinyun.com/user-center/image-20240129235724461.png)

### 安装 GenerateAllSetter 插件

打开设置，点击插件，选择插件市场，然后搜索 GenerateAllSetter 插件，最后进行安装。

![image-20240130003917866](https://static.mlinyun.com/user-center/image-20240130003917866.png)

这个插件可以一键生成一个对象的所有 set 方法。

使用方法：将光标放置需要生成 set 方法的对象上，然后点击 Atl + Enter 键，然后可以选择生成带有默认值的 setter
方法，也可以选择生成不带默认值的 setter 方法，如图所示：

![image-20240130004651112](https://static.mlinyun.com/user-center/image-20240130004651112.png)

### 编写测试类代码

打开刚刚创建的测试类 `UserServiceTest.java`，写入以下代码：

```java
package com.mlinyun.usercenter.service;

import com.mlinyun.usercenter.model.domain.User;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 用户测试服务
 *
 * @author LinCanhui
 */
@SpringBootTest
public class UserServiceTest {

    @Resource
    private UserService userService;

    @Test
    public void testAddUser() {
        User user = new User();
        user.setUsername("testUser");
        user.setUserAccount("123456");
        user.setAvatarUrl("https://www.baidu.com/img/flexible/logo/pc/result.png");
        user.setGender(0);
        user.setUserPassword("123456");
        user.setPhone("15600000000");
        user.setEmail("123@qq.com");
        boolean result = userService.save(user);
        System.out.println(user.getId());
        Assertions.assertTrue(result);
    }
}
```

![image-20240130010350631](https://static.mlinyun.com/user-center/image-20240130010350631.png)

## 注册功能实现（Service 层 & ServiceImpl 层）

### 注册逻辑

1. 用户在前端输入账号和密码、以及校验码（校验码待做）

2. 校验用户的账户、密码、校验密码是否符合要求

   ① 账户不小于 4 位

   ② 密码不小于 8 位

   ③ 账户不能重复

   ④ 账户不包含特殊字符

   ⑤ 密码和校验密码相同

3. 对密码进行加密（密码千万不要直接以明文存储到数据库中）

4. 向数据库插入用户数据

### 编写注册业务层代码

#### 用户注册服务接口（Service 层）

> **知识点**
>
> 在 Spring Boot 中，Service 层是业务逻辑处理的核心部分。它负责处理具体的业务逻辑，协调不同的 Repository（或
> Mapper）层，提供业务相关的方法供 Controller 层调用。
>
> Service 层通常定义接口，用于定义具体的业务方法。接口可以提供业务数据的查询、新增、修改、删除等方法的定义。
>
> Service 层的好处在于它将业务逻辑和数据访问层分离，使得代码更加清晰、可维护。此外，Service 层还可以在业务方法中进行一些校验、转换或其他的业务处理，对
> Controller 层提供更高层的服务。通过定义接口和实现类的方式，Service 层也更加便于扩展与单元测试。
>
> Service 层在 SpringBoot 中是非常重要的一层，用来处理业务逻辑，实现业务需求。

用户服务（`UserService.java`）编写 **用户注册服务接口**，代码如下：

```java
package com.mlinyun.usercenter.service;

import com.mlinyun.usercenter.model.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 用户服务
 *
 * @author LinCanhui
 * @description 针对表【user(用户)】的数据库操作Service
 * @createDate 2024-01-29 22:18:17
 */
public interface UserService extends IService<User> {

    /**
     * 用户注册
     *
     * @param userAccount   用户账户
     * @param userPassword  用户密码
     * @param checkPassword 校验密码
     * @return 新用户id
     */
    long userRegister(String userAccount, String userPassword, String checkPassword);

}
```

#### 用户注册服务实现（ServiceImpl 层）

> **知识点**
>
> ServiceImpl 层是 Service 层实现接口的具体方法，编写业务逻辑代码，并调用 Repository（或 Mapper）层进行数据操作。

用户服务实现类（`UserServiceImpl.java`） **实现用户注册服务**，代码如下：

```java
package com.mlinyun.usercenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenter.model.domain.User;
import com.mlinyun.usercenter.service.UserService;
import com.mlinyun.usercenter.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 用户服务实现类
 *
 * @author LinCanhui
 * @description 针对表【user(用户)】的数据库操作Service实现
 * @createDate 2024-01-29 22:18:17
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword) {
        // 1. 校验
        // 1.1 校验是否为空 引入apache common utils ：Apache Commons Lang 使用其中的方法：isAnyBlank 可判断多个字符串是否为空
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            // TODO 修改为自定义异常
            return -1;
        }
        // 1.2 校验账号位数（账户不能小于 4 位）
        if (userAccount.length() < 4) {
            return -1;
        }
        // 1.3 校验密码位数（密码不小于 8 位）
        if (userPassword.length() < 8 || checkPassword.length() < 8) {
            return -1;
        }
        // 1.4 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            return -1;
        }
        // 1.5 校验密码和校验密码是否相同
        if (!userPassword.equals(checkPassword)) {
            return -1;
        }
        // 1.6 账户不能重复（需要查询数据库中的用户表是否存在此用户）
        // 这一步放在最后，当其他校验通过时，再去数据库查询账号是否存在，这样可以防止性能浪费
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            return -1;
        }

        // 2. 密码加密
        final String SALT = "mlinyun";
        // 使用 String 的加密方法，采用 MD5 加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes(StandardCharsets.UTF_8));

        // 3. 向数据库插入用户数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        boolean saveResult = this.save(user);
        if (!saveResult) {
            return -1;
        }
        // 4. 返回新用户 id
        return user.getId();
    }
}
```

注意：上面的代码使用到了 Apache Commons Lang 这个工具类，所以我们需要在 `pom.xml` 文件中引入这个依赖：

```xml

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```

![image-20240130014022569](https://static.mlinyun.com/user-center/image-20240130014022569.png)

### 测试注册服务

在 `UserServiceTest.java` 中添加单元测试方法 `userRegister()`：

![image-20240130022101231](https://static.mlinyun.com/user-center/image-20240130022101231.png)

写入如下的测试代码：

```java

@Test
void userRegister() {
    String userAccount = "yupi";
    String userPassword = "";
    String checkPassword = "123456";
    // 非空测试
    long result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 账号位数测试
    userAccount = "yu";
    userPassword = "12345678";
    checkPassword = "12345678";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 密码位数测试
    userAccount = "yupi";
    userPassword = "123456";
    checkPassword = "123456";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 账号特殊字符测试
    userAccount = "@yupi";
    userPassword = "12345678";
    checkPassword = "12345678";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 密码和校验密码相同测试
    userAccount = "yupi";
    userPassword = "12345678";
    checkPassword = "12345679";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 账户重复测试
    userAccount = "123456";
    userPassword = "12345678";
    checkPassword = "12345678";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertEquals(-1, result);
    // 测试是否可以注册成功
    userAccount = "mlinyun";
    userPassword = "12345678";
    checkPassword = "12345678";
    result = userService.userRegister(userAccount, userPassword, checkPassword);
    Assertions.assertTrue(result > 0);
}
```

然后执行测试代码，结果如下图所示：

![image-20240130024337786](https://static.mlinyun.com/user-center/image-20240130024337786.png)

## 登录功能实现（Service层 & ServiceImpl层）

### 登录接口

接收参数：用户账户、密码

请求类型：POST

请求体：JSON 格式的数据

> 请求参数很长时不建议用 GET

返回值：用户信息（脱敏）

### 登录逻辑

1. 校验用户账户和密码是否合法
   ① 非空
   ② 账户不小于4位
   ③ 密码不小于8位
   ④ 账户不包含特殊字符
2. 校验用户密码是否输入正确，和数据库中的密文密码对比
3. 用户信息脱敏，隐藏敏感信息，防止数据库中的字段泄漏给前端
4. 记录用户的登录态（session），将其存到服务器上（用后端 Springboot 封装的 tomcat 服务器记录）
5. 返回脱敏后的用户信息

#### 如何知道是哪个用户登录了？

1. 连接服务端后，得到一个 session1 状态（匿名会话），返回给前端
2. 登录成功后，得到登录成功的 session，并且给该 session 设置一些值（比如用户信息），返回给前端一个设置 cookie 的"命令"
3. 前端接收到后端的命令后，设置 cookie，保存到浏览器内
4. 前端再次请求后端的时候（相同的域名），在请求头中带上 cookie 去请求
5. 后端拿到前端传来的 cookie，找到对应的 session
6. 后端从 session 中可以取出基于该 session 存储的变量

### 编写登录业务层代码

#### 用户登录服务接口（Service 层）

用户服务（`UserService.java`）编写 **用户登录服务接口**，代码如下：

```java
/**
 * 用户登录
 * @param userAccount 用户账号
 * @param userPassword 用户密码
 * @param request 请求
 * @return 脱敏后的用户信息
 */
User userLogin(String userAccount, String userPassword, HttpServletRequest request);
```

![image-20240130162119831](https://static.mlinyun.com/user-center/image-20240130162119831.png)

#### 用户登录服务实现（ServiceImpl 层）

用户服务实现类（`UserServiceImpl.java`） **实现用户登录服务**，代码如下：

```java
// 省略其他代码....
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    /**
     * 盐值，用于混淆密码
     */
    private static final String SALT = "mlinyun";

    /**
     * 用户登录态键
     */
    private static final String USER_LOGIN_STATE = "userLoginState";

    // 省略用户注册服务实现代码....

    /**
     * 用户
     *
     * @param userAccount  用户账号
     * @param userPassword 用户密码
     * @param request      请求
     * @return 脱敏后的用户信息
     */
    @Override
    public User userLogin(String userAccount, String userPassword, HttpServletRequest request) {
        // 1. 校验
        // 1.1 校验是否为空 引入apache common utils ：Apache Commons Lang 使用其中的方法：isAnyBlank 可判断多个字符串是否为空
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            // TODO 修改为自定义异常
            return null;
        }
        // 1.2 校验账号位数（账户不能小于 4 位）
        if (userAccount.length() < 4) {
            return null;
        }
        // 1.3 校验密码位数（密码不小于 8 位）
        if (userPassword.length() < 8) {
            return null;
        }
        // 1.4 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            return null;
        }

        // 2. 密码加密
        // 使用 String 的加密方法，采用 MD5 加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes(StandardCharsets.UTF_8));

        // 3. 查询用户是否存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        // 注意：这里要用 encryptPassword，因为数据库中存储的是加密之后的密码
        queryWrapper.eq("userPassword", encryptPassword);
        User user = userMapper.selectOne(queryWrapper);
        // 用户不存在
        if (user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            return null;
        }

        // 4. 用户信息脱敏
        User safetyUser = getSafetyUser(user);

        // 5. 记录用户的登录态
        request.getSession().setAttribute(USER_LOGIN_STATE, safetyUser);

        // 返回脱敏后的用户信息
        return safetyUser;
    }

    /**
     * 用户信息脱敏方法
     *
     * @param user 要脱敏的 user 对象
     * @return 脱敏后的用户信息
     */
    private static User getSafetyUser(User user) {
        User safetyUser = new User();
        safetyUser.setId(user.getId());
        safetyUser.setUsername(user.getUsername());
        safetyUser.setUserAccount(user.getUserAccount());
        safetyUser.setAvatarUrl(user.getAvatarUrl());
        safetyUser.setGender(user.getGender());
        safetyUser.setPhone(user.getPhone());
        safetyUser.setEmail(user.getEmail());
        safetyUser.setUserStatus(user.getUserStatus());
        safetyUser.setCreateTime(user.getCreateTime());
        return safetyUser;
    }
}
```

#### MyBatis Plus 配置逻辑删除

在上述代码中，我们写了 `User user = userMapper.selectOne(queryWrapper);` 这行代码，这里需要添加逻辑删除，以防查询到已删除的用户。

我们在整合 MyBatis Plus 框架的时候，就对其进行了逻辑删除的配置，如下图所示：

![image-20240130163141897](https://static.mlinyun.com/user-center/image-20240130163141897.png)

查看 MyBatis Plus 官网对逻辑删除的使用方法：

![image-20240130163333038](https://static.mlinyun.com/user-center/image-20240130163333038.png)

我们还需要配置一下全局逻辑删除实体字段名，虽然官网说了从 3.3.0 版本之后，配置全局逻辑删除实体字段名后可以不进行步骤2的配置，但是我这里还是进行步骤2的配置（保险一些）。

在 `application.properties` 添加如下代码：

```properties
mybatis-plus.global-config.db-config.logic-delete-field=isDelete
```

![image-20240130164825956](https://static.mlinyun.com/user-center/image-20240130164825956.png)

在 `User.java` 实体类的 `isDelete` 加上 `@TableLogic` 注解：

```java
/**
 * 是否删除
 */
@TableLogic // 逻辑删除注解
private Integer isDelete;
```

![image-20240130164655130](https://static.mlinyun.com/user-center/image-20240130164655130.png)

## 实现登录注册的接口（Controller 层）

> **知识点**
>
> 在 SpringBoot 中，Controller 层是 Web 应用程序中负责接收和处理用户请求的部分。它作为应用程序的入口点，负责将用户的请求转发给相应的
> Service 层，并将 Service 层返回的结果以合适的方式呈现给用户。
>
> Controller 层的主要职责包括以下几个方面：
>
> 1. **定义映射路径**：Controller 层使用注解（如`@RestController`、`@RequestMapping`）来定义接收请求的映射路径。例如，

     `@RequestMapping("/users")` 可以将该 Controller 中的方法与"/users"路径进行映射。

> 2. **接收请求参数**：Controller 层可以通过方法参数来接收请求中传递的参数，可以使用 `@RequestParam`、`@PathVariable`

     等注解来获取请求参数的值。

> 3. **调用 Service 层**：Controller 层通过注入相应的 Service 对象，调用 Service 层中的方法来处理业务逻辑。通常情况下，Controller

     层会将请求参数传递给 Service 层，并将 Service 层返回的结果进行处理后返回给客户端。

> 4. **处理返回结果**：Controller 层可以将 Service 层返回的结果以不同的方式呈现给用户，如将结果封装为 JSON 格式、返回 HTML

     页面等。通常情况下，可以使用 `@ResponseBody` 注解将方法返回值直接写入响应体，或者返回 `ModelAndView` 对象来指定渲染的视图。

### 创建 UserController 类

首先我们需要在 `controller` 文件夹中创建 `UserController.java` 文件，然后写入以下代码：

```java
package com.mlinyun.usercenter.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

}
```

添加 @RestController 注解（适用于restful风格的API，返回值默认为json类型），添加 @RequestMapping 注解（请求的路径）

### 创建 UserRegisterRequest 实体类

使用 `UserRegisterRequest` 实体类接受前端数据，在 `/model/domain` 文件夹下创建 `/request` 文件夹，然后再创建
`UserRegisterRequest.java` 文件，写入如下的代码：

```java
package com.mlinyun.usercenter.model.domain.request;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户注册请求体
 *
 * @author LinCanhui
 */
@Data
public class UserRegisterRequest implements Serializable {

    /**
     * 防止序列化过程中冲突
     */
    @Serial
    private static final long serialVersionUID = 1590243006321438588L;

    /**
     * 用户账号
     */
    private String userAccount;

    /**
     * 用户密码
     */
    private String userPassword;

    /**
     * 校验密码
     */
    private String checkPassword;

}
```

### 开始编写注册接口

我们在 `UserController.java` 文件中写入如下的代码：

```java
package com.mlinyun.usercenter.controller;

import com.mlinyun.usercenter.model.domain.request.UserRegisterRequest;
import com.mlinyun.usercenter.service.UserService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/register")
    public Long userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            return null;
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            return null;
        }
        return userService.userRegister(userAccount, userPassword, checkPassword);
    }
}
```

### 创建 UserLoginRequest 实体类

使用 `UserLoginRequest` 实体类接受前端数据，在 `/model/domain/request` 文件夹创建 `UserLoginRequest.java` 文件，写入如下的代码：

```java
package com.mlinyun.usercenter.model.domain.request;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户登录请求体
 */
@Data
public class UserLoginRequest implements Serializable {

    /**
     * 防止序列化过程中冲突
     */
    @Serial
    private static final long serialVersionUID = 2428441552261962530L;

    /**
     * 用户账号
     */
    private String userAccount;

    /**
     * 用户密码
     */
    private String userPassword;
}
```

### 开始编写登录接口

我们接着在 `UserController.java` 文件中写入如下的代码：

```java
// 省略其他代码......
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    // 省略用户注册接口代码.....

    /**
     * 用户登录接口
     *
     * @param userLoginRequest 用户登录请求体
     * @param request          请求
     * @return 脱敏后的用户信息
     */
    @PostMapping("/login")
    public User userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            return null;
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            return null;
        }
        return userService.userLogin(userAccount, userPassword, request);
    }
}
```

## 测试登录和注册接口

因为我们还没完成前端，所以这里对接口的测试，我打算使用 $\color{red}{Postman}$​ 工具（主要原因是我最近刚学完 Postman
工具的使用，在这里刚好可以练习一下😀）。

### 测试前的准备

在前面初始化后端项目的时候，我们对 Web 项目进行了基础的配置，其中就有设置项目路径（忘记的伙伴可以去翻前面的笔记），下图是我们之前配置的：

![image-20240130213716738](https://static.mlinyun.com/user-center/image-20240130213716738.png)

我们对其进行修改一下，指定项目路径前缀为 `api`：

```properties
server.servlet.context-path=/api
```

修改完成之后，我们就可以使用 `mvn spring-boot:run` 命令启动项目了，当然你也可以执行启动类（`UserCenterApplication.java`）中的
`main` 方法来启动项目，然后就可以愉快的进行接口测试了。

### 注册接口测试

我们打开 Postman 工具，按照下图的方式进行测试：

![image-20240130214955788](https://static.mlinyun.com/user-center/image-20240130214955788.png)

上面的测试结果表示我们已经成功注册了一个用户 `LingYun`，我们可以到数据库中查看，检查一下该用户是否已经保存到了数据库中：

![image-20240130215614774](https://static.mlinyun.com/user-center/image-20240130215614774.png)

可以看到，我们注册的用户确实保存到数据库中了。

### 登录接口测试

接着使用 Postman 工具，按照下图的方式进行操作：

![image-20240130220659985](https://static.mlinyun.com/user-center/image-20240130220659985.png)

### 逻辑删除测试

因为我们还没有编写删除用户的代码，所以这里我们手动的在数据集库中更改数据，我们将刚刚注册的 `LingYun` 用户的 `isDelete`
字段值由原来的 `0` （0表示该用户未删除）改为 `1` （1表示该用户已删除），如下图所示：

![image-20240130221637727](https://static.mlinyun.com/user-center/image-20240130221637727.png)

然后我们再次用 `LingYun` 这个用户进行登录，若得不到任何返回信息表示逻辑删除成功，倘若能得到脱敏后的用户信息则表示逻辑删除不成功（理论上是不会不成功的，因为这个逻辑删除是
MyBatis Plus 框架实现的，应该是不会有错的，如果出现错误的话，有可能是 MyBatis Plus 的配置项没设置好）。

![image-20240130222552142](https://static.mlinyun.com/user-center/image-20240130222552142.png)

在鱼皮的视频教程中，使用的是 IDEA 自带的 HTTP 客户端测试工具，打开方式：Tools => HTTP Client => Create Request in HTTP
Client => Add request，或者点 Controller 访问路径旁边的小图标也可以，然后在上面书写请求：

![image-20240130224811191](https://static.mlinyun.com/user-center/image-20240130224811191.png)

```java
import com.mlinyun.springboot3demo.entity.TbUser;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class TbUserServiceTest {

    @Autowired
    private TbUserService tbUserService;

    /**
     * 测试添加用户功能
     * 这个测试会创建一个新用户，保存到数据库，然后验证是否保存成功
     * 使用@Transactional注解确保测试完成后会回滚事务，不会影响数据库
     */
    @Test
    @DisplayName("测试添加用户")
    @Transactional
    void testAddUser() {
        // 1. 创建用户对象
        TbUser user = new TbUser();
        user.setName("testUser");
        user.setPassword("password123");
        user.setIsDelete(0); // 设置为未删除状态

        // 2. 保存用户
        boolean saveResult = tbUserService.save(user);

        // 3. 断言保存结果为true
        assertTrue(saveResult, "用户保存应该成功");

        // 4. 验证用户ID已生成（保存成功后会自动设置ID）
        assertNotNull(user.getId(), "用户ID应该已生成");

        // 5. 从数据库查询并验证用户信息
        TbUser savedUser = tbUserService.getById(user.getId());
        assertNotNull(savedUser, "应该能从数据库查询到保存的用户");
        assertEquals("testUser", savedUser.getName(), "用户名应匹配");
        assertEquals("password123", savedUser.getPassword(), "密码应匹配");
        assertEquals(0, savedUser.getIsDelete(), "删除标记应匹配");
    }
}
```
