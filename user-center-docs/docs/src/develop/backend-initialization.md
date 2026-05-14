# 后端代码初始化

## 开发环境搭建

工欲善其事必先利其器，在进行 Spring Boot 项目开发前首先要把基础的开发环境搭建完成。

### 基础环境之 Java 17

自 Spring Boot 3.0 开始，最低的 Java 版本要求为 17，Java 8 就不再适用了。如果你目前使用的是 Java 8或 Java 11，那么就需要在本机安装
Java 17 并进行环境变量配置，以进行 Spring Boot 3 项目的开发。

### 基础环境之 Maven

Spring Boot 官方支持 Maven 和 Gradle 作为项目构建工具，在日常开发工作中，Maven 是一个更加大众的选择，Gradle 相比 Maven
来讲其行业使用率偏低，并且 Spring Boot 官方默认使用 Maven，因此本项目选择使用 Maven 作为项目构建工具，在进行实际的 Spring
Boot 项目开发前也一定要将 Maven 安装并配置正确。

### MySQL 数据库

数据库往往是项目开发中不可或缺的角色，不过它并不是 Spring Boot 项目开发中必须的基础环境，只是我们在用户中心项目开发中会使用它作为数据存储，因此我们也需要安装
MySQL 数据库。

## 快速构建 Spring Boot 应用

### 使用 Spring Initializr 构建

Spring 官方提供了 [Spring Initializr](https://start.spring.io/) 来进行 Spring Boot 的快速构建，这是一个在线生成 Spring
Boot 基础项目的工具，我们可以将其理解为 Spring Boot 的“创建向导”。

![image-20240128193704477](https://static.mlinyun.com/user-center/image-20240128193704477.png)

但是我们不用上面的方法创建项目，而是使用开发工具 IntelliJ IDEA 来快速的创建一个 Spring Boot 骨架工程。其实和上面的在线生成很相似。

![image-20240128194351289](https://static.mlinyun.com/user-center/image-20240128194351289.png)

如上图所示，我们需要填写和选择项目的基础信息，包括项目名称、项目存放位置、项目语言、项目构建工具、包名设置，Java 版本以及打包方式等等。

另外，由于开发的是 Web 项目，需要引入 Web 开发相关依赖，所以要加上 Spring Web 相关依赖，如下图所示。

![image-20240128194917415](https://static.mlinyun.com/user-center/image-20240128194917415.png)

然后我们点击创建按钮，它就会自动帮助我们生成代码：

![image-20240128195618563](https://static.mlinyun.com/user-center/image-20240128195618563.png)

## Web 项目基础配置和日志配置

### Web 项目基础配置

使用 Spring Boot 开发 web 应用时，有两个需要注意的配置项：

- **server.port** 表示启动后的端口号，默认是 8080
- **server.servlet.context-path** 项目路径，是构成 url 地址的一部分

如果想要修改这两个参数值，可以在 application.properties 配置文件中修改，示例如下：

```properties
server.port=8100
server.servlet.context-path=/
```

![image-20240128203814237](https://static.mlinyun.com/user-center/image-20240128203814237.png)

### 日志配置

日志记录是项目重要组成部分之一，也是软件开发过程中需要考虑的关键因素。当系统运行出现异常时，日志文件通常是我们进行错误分析的首要依据，很多情况下也是我们手上唯一可以用来查明状况和问题发生根本原因的信息，可见，正确记录需要的信息是极其重要的。

默认情况下，Spring Boot 只将日志内容输出到控制台中，并不会输出到一个文件中。如果想增加除控制台输出之外的日志文件，需要在
Spring Boot 配置文件(application.properties 或者 application.yml)中设置 logging.file 或 logging.path 属性。

- logging.file

  设置文件，可以是绝对路径，也可以是相对路径。如：`logging.file=my.log`

- logging.path

  设置目录，会在该目录下创建 spring.log 文件，并写入日志内容，如：`logging.path=/var/log`

如果只配置 logging.file，会在项目的当前路径下生成一个 xxx.log 日志文件。

如果只配置 logging.path，在 /var/log 文件夹生成一个日志文件为 spring.log

**注：二者不能同时使用，如若同时使用，则只有 logging.file 生效。**

我们可以在配置文件中增加如下配置：

```properties
logging.level.root=info
logging.file.name=./logs/user-center-back.log
```

![image-20240128204237334](https://static.mlinyun.com/user-center/image-20240128204237334.png)

再次启动项目，可以看到不仅仅控制台上有日志，在当前项目下会新生成一个 `/logs/insurance-site.log` 文件，该文件中也包含日志输出。

**注意：**完成上面的配置之后，我们还需要忽略日志文件的提交，我们在向仓库提交代码的时候，日志文件是不需要提交，我们需要排除它，所以还需要在
`.gitignore` 文件中将我们整个日志文件目录排除，代码如下：

![image-20240128204609877](https://static.mlinyun.com/user-center/image-20240128204609877.png)

## MySQL 数据库准备

### 启动 MySQL

在连接数据库之前，我们需要先启动 MySQL 数据库，使用管理员权限打开终端，然后输入以下命令，即可开启 MySQL 服务：

```powershell
net start mysql80
```

![image-20240128200611711](https://static.mlinyun.com/user-center/image-20240128200611711.png)

注意：上面的命令中的 `mysql80` 是 MySQL 服务的名字，如果你忘记了，可以通过下面的方式找到：打开任务管理器，点击服务一项，然后寻找带有
`mysql` 相关的单词的服务，这个大概率就是 MySQL 服务名了。

![image-20240128201516048](https://static.mlinyun.com/user-center/image-20240128201516048.png)

MySQL 服务启动后，我们就可以在 IDEA 中进行连接了，我们只需要填写用户名和密码就行，然后点击测试连接，成功之后在点击确定就可以了。

![image-20240128202018451](https://static.mlinyun.com/user-center/image-20240128202018451.png)

### 创建数据库和表结构

首先我们在项目的根目录创建 `sql` 目录，然后再该目录下创建 `user-center.sql` 文件，用来存放 sql 代码，接着写入下面的代码：

```sql
DROP DATABASE IF EXISTS `user_center`;
CREATE DATABASE IF NOT EXISTS `user_center` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT ENCRYPTION = 'N';
USE `user_center`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user`
(
    id    BIGINT      NOT NULL COMMENT '主键ID',
    name  VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
    age   INT         NULL DEFAULT NULL COMMENT '年龄',
    email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
    PRIMARY KEY (id)
);

DELETE
FROM `user`;

INSERT INTO `user` (id, name, age, email)
VALUES (1, 'Jone', 18, 'test1@baomidou.com'),
       (2, 'Jack', 20, 'test2@baomidou.com'),
       (3, 'Tom', 28, 'test3@baomidou.com'),
       (4, 'Sandy', 21, 'test4@baomidou.com'),
       (5, 'Billie', 24, 'test5@baomidou.com');
```

![image-20240128210704134](https://static.mlinyun.com/user-center/image-20240128210704134.png)

首先创建了 `user_center` 的数据库，之后在数据库中新建了一个名称为 `user` 的数据表，表中有 id , name , age，email
四个字段，然后我们全选（Ctrl + A）执行上面的代码即可。

## Spring Boot 连接数据库

### 新增 pom 依赖

在进行数据库连接前，首先将相关 jar 包依赖引入到项目中，Spring Boot 针对 JDBC 的使用提供了对应的 Starter
包：spring-boot-starter-jdbc，方便在 Spring Boot 生态中更好的使用 JDBC。

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

**提示：** 笔者引入这个依赖，主要是为了下面的测试与 MySQL 的连接是否成功，如果你能保证一定能连接成功，可以忽略这一步。

另外项目中使用 MySQL 作为数据库，因此项目中也需要引入 MySQL 驱动包，不过这一步我们在构建 Spring Boot 项目的时候已经引入了。

![image-20240129005059574](https://static.mlinyun.com/user-center/image-20240129005059574.png)

### 数据库配置信息

为了能够连接上数据库并进行操作，在新增依赖后，我们也需要对数据库的基本信息进行配置，比如数据库地址、账号、密码等信息，这些配置依然是在
application.properties 文件中增加，配置如下：

```properties
# 数据源基本配置
# 配置数据库连接的url
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/user_center?useUnicode=true&characterEncoding=utf-8&useSSL=false&allowPublicKeyRetrieval=true&allowMultiQueries=true
# 指定数据库驱动程序的类
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# 配置数据库的用户名
spring.datasource.username=root
# 配置数据库的密码
spring.datasource.password=123456
```

![image-20240129011020703](https://static.mlinyun.com/user-center/image-20240129011020703.png)

接下来就可以进行连接测试了。值得注意的是，在 Spring Boot 3 中，数据库驱动类推荐使用 `com.mysql.cj.jdbc.Driver`，而不是我们平时比较熟悉的
`com.mysql.jdbc.Driver` 类了。

### 连接测试

最后，我们编写一个测试类来测试一下目前能否获得与数据库的连接，在
`src/test/java/com/mlinyun/usercenter/UserCenterApplicationTests.java`下添加 `datasourceTest()` 单元测试方法，源码及注释如下：

```java
package com.mlinyun.usercenter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
class UserCenterApplicationTests {

    // 注入数据源对象
    @Autowired
    private DataSource dataSource;

    @Test
    void contextLoads() {
    }

    @Test
    public void datasourceTest() throws SQLException {
        // 获取数据源类型
        System.out.println("默认数据源为：" + dataSource.getClass());
        // 获取数据库连接对象
        Connection connection = dataSource.getConnection();
        // 判断连接对象是否为空
        System.out.println(connection != null);
        connection.close();
    }
}
```

运行单元测试方法`mvn test`，如果 connection 对象不为空，则证明数据库连接成功，如下图所示，在对 connection 对象进行判空操作时，得到的结果是
connection 非空。如果数据库连接对象没有正常获取，则需要检查数据库是否连接或者数据库信息是否配置正确。

![image-20240129010616764](https://static.mlinyun.com/user-center/image-20240129010616764-1706461579981-1.png)

至此，Spring Boot 连接数据库的就算完成了，分别是引入依赖、增加数据库信息配置、注入数据源进行数据库测试。

## Spring Boot 整合 MyBatis 和 MyBatis-Plus

### MyBatis 介绍

MyBatis 是一个 Dao 层框架，它支持普通 SQL 查询，并且支持存储过程和高级映射。MyBatis 消除了几乎所有的 JDBC
代码和参数的手工设置以及对结果集的检索封装。MyBatis 可以使用简单的 XML 或注解用于配置和原始映射，将接口和 Java 的
POJO（Plain Old Java Objects，普通的 Java 对象）映射成数据库中的记录。

### MyBatis-Plus 介绍

MyBatis-Plus（简称 MP）是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

### Spring Boot 整合 MyBatis

#### 添加依赖

添加 MyBatis 依赖这一步我们在构建 Spring Boot 应用的时候就添加了。

![image-20240129012701151](https://static.mlinyun.com/user-center/image-20240129012701151.png)

#### 添加配置

Spring Boot 整合 MyBatis 时几个比较需要注意的配置参数：

- **mybatis.config-location**

  配置 mybatis-config.xml 路径，mybatis-config.xml 中配置 MyBatis 基础属性，如果项目中配置了 mybatis-config.xml 文件需要设置该参数

- **mybatis.mapper-locations**

  配置 Mapper 文件对应的 XML 文件路径

- **mybatis.type-aliases-package**

  配置项目中实体类包路径

```properties
mybatis.config-location=classpath:mybatis-config.xml
mybatis.mapper-locations=classpath:mapper/*Dao.xml
mybatis.type-aliases-package=com.mlinyun.usercenter
```

![image-20240129015002223](https://static.mlinyun.com/user-center/image-20240129015002223.png)

如上图所示，这里我只设置了两个需要用到的配置。

#### 启动类添加 Mapper 扫描包路径

首先我们在 `com.mlinyun.usercenter` 下创建 `mapper` 文件夹，然后在 Spring Boot 启动类 `Application.java` 中添加
`@MapperScan` 注解，用来指定要扫描的 Mapper 文件夹：

![image-20240129021242031](https://static.mlinyun.com/user-center/image-20240129021242031.png)

### Spring Boot 整合 MyBatis-Plus

#### 添加依赖

向 `pom.xml` 文件中继续添加如下依赖：

```xml

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

![image-20240129015240904](https://static.mlinyun.com/user-center/image-20240129015240904.png)

上面这段 xml 脚本引入了 1 个依赖，其中 `mybatis-plus-boot-starter` 是 `MyBatis-Plus` 的依赖包，引入之后就可以使用
MyBatis-Plus 的所有功能。

#### 添加配置

如果我们不设置 MyBatis-Plus 默认的驼峰式编码，在 MyBatis-Plus 则会默认把驼峰式编码映射为下划线格式，比如实体类种属性
userId 映射到数据库字段 user_id, 这种下划线格式的字段会导致代码报错，所以我们需要关闭驼峰命名规则映射，在
`application.properties` 配置文件中添加如下配置：

```properties
mybatis-plus.mapper-locations=classpath:mybatis/mapper/*.xml
mybatis-plus.configuration.map-underscore-to-camel-case=false
```

![image-20240129015447292](https://static.mlinyun.com/user-center/image-20240129015447292.png)

如图所示，是我对 MyBatis Plus 的配置。

#### 编写代码

我们在 `com.mlinyun.usercenter` 下创建 `model` 文件夹，然后编写实体类 `User.java`

```java
package com.mlinyun.usercenter.model;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("`user`")
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

![image-20240129022415737](https://static.mlinyun.com/user-center/image-20240129022415737.png)

接着在 `mapper` 文件夹中，编写 Mapper 包下的 `UserMapper.java` 接口：

```java
package com.mlinyun.usercenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mlinyun.usercenter.model.User;

public interface UserMapper extends BaseMapper<User> {

}
```

![image-20240129022811599](https://static.mlinyun.com/user-center/image-20240129022811599.png)

#### 进行测试

打开 `UserCenterApplicationTests.java` 添加 `testSelect()` 单元测试方法，进行功能测试：

```java

@Autowired
private UserMapper userMapper;

@Test
public void testSelect() {
    System.out.println(("----- selectAll method test ------"));
    List<User> userList = userMapper.selectList(null);
    Assert.isTrue(5 == userList.size(), "");
    userList.forEach(System.out::println);
}
```

![image-20240129023819885](https://static.mlinyun.com/user-center/image-20240129023819885.png)

UserMapper 中的 `selectList()` 方法的参数为 MP 内置的条件封装器 `Wrapper`，所以不填写就是无任何条件。

然后我们点击右侧的测试按钮，在控制台中会输出：

![image-20240129024134787](https://static.mlinyun.com/user-center/image-20240129024134787.png)
