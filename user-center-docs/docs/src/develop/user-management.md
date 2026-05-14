# 实现用户管理功能

## 用户管理功能设计

用户管理功能我们就做两个功能：

1. 查询用户（根据用户名查询）
2. 删除用户

注意：用户管理功能是管理员的权限，所以我们在编写代码的时候，必须进行鉴权！！！

## 修改用户表结构

用户管理功能需要管理员才能调用，所以我们需要在用户表 `user` 中增加一个 `userRole` 字段，用来表示用户类型，然后我们使用 `0`
表示普通用户，并将该值设置为默认值，`1` 表示为管理员。

我们直接使用 IDEA 自带的数据库工具修改表就行，如下图：

![image-20240131005522370](https://static.mlinyun.com/user-center/image-20240131005522370.png)

修改完之后，我们需要使用 MyBatisX 重新生成 `UserMapper.xml`文件，当然，也可以不生成，我们直接在 `User.java` 实体类中添加
`userRole` 字段，同样，在 `UserMapper.xml` 中也需要添加 `userRole` 字段，如下图所示：

![image-20240131011851927](https://static.mlinyun.com/user-center/image-20240131011851927.png)

![image-20240131011935301](https://static.mlinyun.com/user-center/image-20240131011935301.png)

另外我们还需要在返回脱敏后的用户信息函数中添加 `userRole`，代码如下图：

![image-20240131012220125](https://static.mlinyun.com/user-center/image-20240131012220125.png)

## 提取常量和公共逻辑

### 提取常量

新建包`constant`，新建 UserContant 接口（接口中的属性默认为 public static），将常量都迁移和写道这里：

```java
package com.mlinyun.usercenter.constant;

/**
 * 用户常量
 */
public interface UserConstant {

    /**
     * 用户登录态键
     */
    String USER_LOGIN_STATE = "userLoginState";

    // ---------- 权限 ----------
    /**
     * 默认权限
     */
    int DEFAULT_ROLE = 0;

    /**
     * 管理员权限
     */
    int ADMIN_ROLE = 1;
}
```

![image-20240131013636703](https://static.mlinyun.com/user-center/image-20240131013636703.png)

提取完 `USER_LOGIN_STATE` 用户登录态键常量之后，还需要删除之前代码，然后再引入这个静态常量：

![image-20240131014238087](https://static.mlinyun.com/user-center/image-20240131014238087.png)

![image-20240131014625112](https://static.mlinyun.com/user-center/image-20240131014625112.png)

### 提取公共逻辑

我们发现用户信息脱敏方法在很多地方都会用到，所以这里我们将其提取到 `UserService` 中：

在 `UserService.java` 中编写接口：

```java
/**
 * 用户信息脱敏方法
 *
 * @param originUser 要脱敏的 user 对象
 * @return 脱敏后的用户信息
 */
User getSafetyUser(User originUser);
```

![image-20240131130908449](https://static.mlinyun.com/user-center/image-20240131130908449.png)

在 `UserServiceImpl.java` 实现该方法，我们只需要将之前的 `getSafetyUser(User user)` 函数修改成下面的代码即可：

```java
/**
 * 用户信息脱敏方法
 *
 * @param originUser 要脱敏的 user 对象
 * @return 脱敏后的用户信息
 */
@Override
public User getSafetyUser(User originUser) {
    User safetyUser = new User();
    safetyUser.setId(originUser.getId());
    safetyUser.setUsername(originUser.getUsername());
    safetyUser.setUserAccount(originUser.getUserAccount());
    safetyUser.setAvatarUrl(originUser.getAvatarUrl());
    safetyUser.setGender(originUser.getGender());
    safetyUser.setPhone(originUser.getPhone());
    safetyUser.setEmail(originUser.getEmail());
    safetyUser.setUserStatus(originUser.getUserStatus());
    safetyUser.setCreateTime(originUser.getCreateTime());
    safetyUser.setUserRole(originUser.getUserRole());
    return safetyUser;
}
```

![image-20240131131322328](https://static.mlinyun.com/user-center/image-20240131131322328.png)

## 实现查询用户功能

### 查询用户逻辑

1. 仅管理员可以查询用户（需要进行鉴权）
2. 通过用户名 `username` 进行查询

### 编写查询用户业务层代码

#### 查询用户服务接口（Service 层）

用户服务（`UserService.java`）编写 **查询用户服务接口**，代码如下：

```java
/**
 * 查询用户：根据用户名搜索用户
 *
 * @param username 用户名
 * @param request  请求
 * @return 查询到的用户
 */
List<User> searchUsers(String username, HttpServletRequest request);
```

![image-20240131024441684](https://static.mlinyun.com/user-center/image-20240131024441684.png)

#### 查询用户服务实现（ServiceImpl 层）

用户服务实现类（`UserServiceImpl.java`） **实现查询用户服务**，代码如下：

```java
/**
 * 查询用户服务实现
 *
 * @param username 用户名
 * @param request  请求
 * @return 查询到的用户
 */
@Override
public List<User> searchUsers(String username, HttpServletRequest request) {
    // 仅管理员可以查询
    if (!isAdmin(request)) {
        return new ArrayList<>();
    }
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    if (StringUtils.isNotBlank(username)) {
        queryWrapper.like("username", username);
    }
    List<User> userList = userMapper.selectList(queryWrapper);
    return userList.stream().map(user -> {
        user.setUserPassword(null);
        return getSafetyUser(user);
    }).collect(Collectors.toList());
}
```

![image-20240131030821750](https://static.mlinyun.com/user-center/image-20240131030821750.png)

#### 添加鉴权函数

添加鉴权函数，判断是否为管理员，区分管理员角色和普通用户角色，只有管理员才能使用用户管理功能。

我们需要在 `UserServiceImpl.java` 后面接着写入如下代码：

```java
/**
 * 鉴权函数：判断是否为管理员
 *
 * @param request 请求
 * @return boolean（true - 管理员 false - 非管理员）
 */
public boolean isAdmin(HttpServletRequest request) {
    Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
    User user = (User) userObj;
    return user != null && user.getUserRole() == ADMIN_ROLE;
}
```

![image-20240131030911783](https://static.mlinyun.com/user-center/image-20240131030911783.png)

## 实现删除用户功能

### 删除用户逻辑

1. 仅管理员可以删除用户（需要进行鉴权）
2. 根据用户 `id` 删除用户

### 编写删除用户业务层代码

#### 删除用户服务接口（Service 层）

用户服务（`UserService.java`）编写 **删除用户服务接口**，代码如下：

```java
/**
 * 删除用户：根据 id 删除用户
 *
 * @param id      要删除用户 id
 * @param request 请求
 * @return boolean 删除结果（true - 删除成功 false - 删除失败）
 */
boolean deleteUser(long id, HttpServletRequest request);
```

![image-20240131031018413](https://static.mlinyun.com/user-center/image-20240131031018413.png)

#### 删除用户服务实现（ServiceImpl 层）

用户服务实现类（`UserServiceImpl.java`） **实现删除用户服务**，代码如下：

```java
/**
 * 删除用户服务实现
 *
 * @param id      要删除用户 id
 * @param request 请求
 * @return boolean 删除结果（true - 删除成功 false - 删除失败）
 */
@Override
public boolean deleteUser(long id, HttpServletRequest request) {
    // 仅管理员可删除
    if (!isAdmin(request)) {
        return false;
    }
    if (id < 0) {
        return false;
    }
    return userMapper.deleteById(id) > 0;
}
```

![image-20240131031527693](https://static.mlinyun.com/user-center/image-20240131031527693.png)

## 实现用户管理功能（Controller 层）

### 开始编写查询用户接口

在 `UserController.java` 文件中写入如下的代码：

```java
/**
 * 查询用户接口
 *
 * @param username 用户名
 * @param request  请求
 * @return 查询到的用户
 */
@GetMapping("/search")
public List<User> searchUsers(@RequestParam String username, HttpServletRequest request) {
    if (StringUtils.isAnyBlank(username)) {
        return null;
    }
    return userService.searchUsers(username, request);
}
```

![image-20240131040740264](https://static.mlinyun.com/user-center/image-20240131040740264.png)

### 开始编写删除用户接口

在 `UserController.java` 文件中写入如下的代码：

```java
/**
 * 删除用户接口
 *
 * @param id      要删除用户 id
 * @param request 请求
 * @return boolean 删除结果（true - 删除成功 false - 删除失败）
 */
@PostMapping("/delete")
public boolean deleteUser(@RequestParam long id, HttpServletRequest request) {
    if (id < 0) {
        return false;
    }
    return userService.deleteUser(id, request);
}
```

![image-20240131040642546](https://static.mlinyun.com/user-center/image-20240131040642546.png)

### 设置 session 失效时间

设置 session 失效时间也比较容易，我们直接在配置文件 `application.properties` 中写入以下代码即可，我们设置失效时间为
86400s（即 1 天）：

```properties
spring.session.timeout=86400
```

![image-20240131125611223](https://static.mlinyun.com/user-center/image-20240131125611223.png)

## 测试用户管理功能

### 测试前的准备

因为我们的用户管理功能只能是管理员用户使用，所以在测试之前，我们需要准备一个管理员用户，并且完成登录。这里我就不重新注册一个新的管理员用户了，我们直接修改之前注册的
`LingYun` 用户即可，为了方便我们直接修改数据库中的数据即可，方式如下：

![image-20240131042000989](https://static.mlinyun.com/user-center/image-20240131042000989.png)

这里样，我们将 `LingYun` 用户修改成管理员用户了，接着我们进行一下登录：

![image-20240131042421344](https://static.mlinyun.com/user-center/image-20240131042421344.png)

完成上面的准备步骤，我们就可以开始测试用户管理的接口了。

### 查询用户接口测试

我们打开 Postman 工具，按照下图的方式进行测试：

![image-20240131043311680](https://static.mlinyun.com/user-center/image-20240131043311680.png)

上面的结果已经可以查询到用户了，说明我们的代码理论上来说应该是没有问题的，但是我们查询用户使用的模糊搜索，由于我们的数据库只有
3 个用户，且只有 `testUser` 用户用户名不为空，所以只能查询到一个。我们可以多注册几个具有类似用户名的用户，然后再次进行查询测试，这里的注册我就不演示了，小伙伴自己注册。

下面是我注册多个用户之后重新查询的结果，我们先来看看此时的用户表 `user` 有那些数据：

![image-20240131045353202](https://static.mlinyun.com/user-center/image-20240131045353202.png)

然后我们再来看看这次的查询结果：

![image-20240131045139615](https://static.mlinyun.com/user-center/image-20240131045139615.png)

### 删除用户接口测试

接着测试删除用户接口，注意，在删除用户的时候我们用的是逻辑删除，这样删除用户实际上不会将数据库中存储的数据直接删除，而是会将
`user` 表中的逻辑删除字段 `isDelete` 的值由原来的 `0`（表示未删除）更新为 `1`（表示已删除），要想了解更多关于逻辑删除的知识，可以查看
MyBatis Plus 官网对 [逻辑删除](https://baomidou.com/pages/6b03c5/) 的介绍。

在我的数据库的 `user` 表中有 5 条数据，并且这 5 条数据都未被删除，如下图所示：

![image-20240131135208179](https://static.mlinyun.com/user-center/image-20240131135208179.png)

我们测试删除 `id` 为 5 的用户，方法如下图所示：

![image-20240131140029058](https://static.mlinyun.com/user-center/image-20240131140029058.png)

我们再来查看 `user` 表的数据，此时 `id` 为 5 的用户的 `isDelete` 字段已经由原来的 0 更新为 1 了，说明已经将该用户成功删除了。

![image-20240131135410262](https://static.mlinyun.com/user-center/image-20240131135410262.png)

### 非管理员调用用户管理功能测试

在前面的测试中，我们都是使用管理员 `LingYun` 这个账号去测试的，这一次我们使用普通用户 `mlinyun`
来调用用户管理功能，在这之前，我们需要将之前登录后保存的 `Cookice` 值删除，具体方法如下：

![image-20240131141529039](https://static.mlinyun.com/user-center/image-20240131141529039.png)

然后我们将保存的 `Cookies` 值删除：

![image-20240131141709236](https://static.mlinyun.com/user-center/image-20240131141709236.png)

接着我们登录普通用户 `mlinyun`：

![image-20240131142125765](https://static.mlinyun.com/user-center/image-20240131142125765.png)

此时我们再进行用户查询测试，如果成功的话，我们应该是获取不到用户数据的，他返回的应该是一个空的集合：

![image-20240131142828828](https://static.mlinyun.com/user-center/image-20240131142828828.png)

同样，我们进行用户删除的操作，也是不能够成功删除的，他返回的是 `false` 表示用户删除失败：

![image-20240131143235165](https://static.mlinyun.com/user-center/image-20240131143235165.png)
