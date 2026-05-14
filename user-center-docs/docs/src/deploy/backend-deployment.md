# 后端项目部署

::: tip 说明
本文描述如何将 Spring Boot 3 应用以独立 JAR 形式部署到服务器，包括账号隔离、配置文件、Systemd 服务与常用运维命令
:::

## 前置条件

- 已依据 `project-deployment-environment.md` 安装好 JDK 17+、Nginx 及安全策略
- MySQL 数据库和对象存储等依赖已初始化，并在网络上可访问
- 准备好构建完成的 `user-center-backend-0.0.1.jar`（本地构建或服务器 Maven 构建）

## 创建应用专用用户

```bash
# 创建无登录权限的运行用户
sudo useradd -r -m -s /bin/false appuser

# 准备目录结构
sudo mkdir -p /opt/app/user-center/{lib,logs,config,uploads}

# 授权目录
sudo chown -R appuser:appuser /opt/app/user-center
```

## 分发或构建 JAR 包

- **方式一：本地构建 + 上传**

```powershell
scp target/user-center-backend-0.0.1.jar \
    lingyun@192.168.27.201:/root/lingyun/project/user-center/user-center-backend/
```

- **方式二：服务器内构建**

```bash
cd /root/project/user-center/user-center-backend
mvn clean package -DskipTests
```

> 将产物移动到运行目录并赋予权限：

```bash
sudo mv /root/lingyun/project/user-center/user-center-backend/user-center-backend-0.0.1.jar \
    /opt/app/user-center/lib/user-center-backend.jar
sudo chown appuser:appuser /opt/app/user-center/lib/user-center-backend.jar
```

## 配置文件

### `application-prod.yml`

```bash
sudo vim /opt/app/user-center/config/application-prod.yml
```

示例内容：

```yaml
spring:
  application:
    name: user-center-backend
  servlet:
    multipart:
      enabled: true
      max-file-size: 2MB
      max-request-size: 10MB
  datasource:
    url: jdbc:mysql://localhost:3306/user_center?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
    username: ${DB_USER_CENTER_USERNAME}
    password: ${DB_USER_CENTER_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

server:
  port: 8100
  servlet:
    session:
      timeout: 86400s
    context-path: /api
  tomcat:
    threads:
      max: 200
      min-spare: 10
    accept-count: 100
    max-connections: 8192
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain,text/css,text/javascript,application/javascript
    min-response-size: 1024

file:
  upload:
    upload-dir: /opt/app/user-center/uploads
    avatar-dir: avatar
    allowed-types: image/jpeg,image/png,image/jpg,image/gif
    max-size: 2097152
    access-prefix: ${FILE_SERVER_URL}/api/file

logging:
  file:
    name: /opt/app/user-center/logs/user-center.log
  level:
    root: info
  logback:
    rollingpolicy:
      max-history: 2000
      max-file-size: 5MB
      total-size-cap: 1GB

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath*:mapper/*.xml
  type-aliases-package: com.mlinyun.usercenter.model
  global-config:
    enable-sql-runner: true
    db-config:
      logic-delete-field: isDeleted
      logic-not-delete-value: 0
      logic-delete-value: 1

knife4j:
  production: true
```

### 环境变量文件 `user-center.env`

```bash
sudo vim /opt/app/user-center/config/user-center.env
```

示例内容：

```plaintext
DB_USER_CENTER_USERNAME=user_center_user
DB_USER_CENTER_PASSWORD=Sg-7xv30s4b9agiel2gz3x8.User-Center
FILE_SERVER_URL=https://user-center.mlinyun.com
JAVA_OPTS="-Xms256m -Xmx384m -XX:MaxMetaspaceSize=96m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/opt/app/user-center/logs/heapdump.hprof"
SPRING_PROFILES_ACTIVE=prod
```

设置权限：

```bash
sudo chmod 640 /opt/app/user-center/config/user-center.env
sudo chown appuser:appuser /opt/app/user-center/config/user-center.env
```

## 创建 Systemd 服务

```bash
sudo vim /etc/systemd/system/user-center.service
```

服务文件：

```plaintext
[Unit]
Description=User Center Backend Service
After=network.target syslog.target
Wants=network-online.target

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/opt/app/user-center
EnvironmentFile=/opt/app/user-center/config/user-center.env
ExecStart=/usr/bin/java \
    $JAVA_OPTS \
    -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} \
    -Dspring.config.location=/opt/app/user-center/config/application-prod.yml \
    -jar /opt/app/user-center/lib/user-center-backend.jar
ExecStop=/bin/kill -15 $MAINPID
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=60
StartLimitBurst=5
LimitNOFILE=65535
LimitNPROC=4096
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
ReadWritePaths=/opt/app/user-center
StandardOutput=journal
StandardError=journal
SyslogIdentifier=user-center

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable user-center.service
sudo systemctl start user-center.service
sudo systemctl status user-center.service
```

## 运维常用命令

```bash
# 启动 / 停止 / 重启
sudo systemctl start|stop|restart user-center

# 查看运行状态
sudo systemctl status user-center

# 追踪实时日志
sudo journalctl -u user-center -f

# 查看最近 100 行日志
sudo journalctl -u user-center -n 100

# 查看应用日志文件
sudo tail -f /opt/app/user-center/logs/user-center.log
```

当应用需滚动升级时，替换 `lib` 目录下的 JAR 并执行 `sudo systemctl restart user-center`，完成热更新
