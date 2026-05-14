# 前端项目部署

::: tip 说明
本文指导如何将 React 构建产物部署到 Nginx，并与后端接口、SELinux、权限系统协同工作Vue 版本同理，只需替换产物目录
:::

## 前置条件

- 已完成 `project-deployment-environment.md` 中的 Nginx 安装与端口放行
- `user-center-backend` 已部署并提供 `http://127.0.0.1:8100/api` 服务
- 前端代码已执行 `pnpm build`（或 `npm/yarn build`）生成 `dist` 目录

## 上传与发布静态资源

将构建结果上传到服务器：

```bash
scp -r user-center-react-frontend/dist \
    lingyun@192.168.27.201:/root/lingyun/project/user-center/user-center-react-frontend/
```

发布到 Nginx 根目录并设置权限：

```bash
sudo mkdir -p /var/www/user-center/user-center-react-frontend
sudo chown -R nginx:nginx /var/www/user-center/user-center-react-frontend
sudo chmod -R 755 /var/www/user-center/user-center-react-frontend
sudo mv /root/project/user-center/user-center-react-frontend/dist/* \
    /var/www/user-center/user-center-react-frontend/
```

> Vue 版本仅需将源目录替换为 `/var/www/user-center/user-center-vue-frontend`

## Nginx 反向代理

[代码仓库](https://github.com/mlinyun/user-center) 中已经包含针对 React 与 Vue 两套前端的 Nginx 配置示例，位于项目根目录的
`nginx/`：

- `nginx/user-center-react.conf` — React 前端（`react.uc.example.com`）
- `nginx/user-center-vue.conf` — Vue 前端（`vue.uc.example.com`）
- `nginx/user-center-backend.conf` — 定义 `upstream user_center_backend`（将请求代理到 `127.0.0.1:8100`）

建议直接将这三份配置部署到服务器的 `/etc/nginx/conf.d/` 下并重载 Nginx：

```bash
# 以 root 或 sudo 权限复制（根据实际路径调整）
sudo cp nginx/user-center-backend.conf /etc/nginx/conf.d/
sudo cp nginx/user-center-react.conf /etc/nginx/conf.d/
# 如果使用 Vue 前端，复制 user-center-vue.conf 替换 react.conf
sudo cp nginx/user-center-vue.conf /etc/nginx/conf.d/

# 测试并重载配置
sudo nginx -t
# 重新加载配置文件
sudo nginx -s reload
# 或
sudo systemctl reload nginx
```

关键配置说明（基于仓库配置）：

- 监听与域名：配置文件监听 `443 ssl`，示例域名为 `react.uc.example.com` 或 `vue.uc.example.com`
- TLS：示例使用 Let's Encrypt 证书，路径为 `/etc/letsencrypt/live/example.com/fullchain.pem` 与
  `/etc/letsencrypt/live/example.com/privkey.pem`，请替换为你的证书路径或配置 Certbot 自动续期
- 日志：访问与错误日志分别写到 `/var/log/nginx/user-center-react_access.log` 与
  `/var/log/nginx/user-center-react_error.log`（Vue 对应 `user-center-vue_*`）
- 根目录：React 静态根目录为 `/var/www/user-center/user-center-react-frontend`；Vue 为
  `/var/www/user-center/user-center-vue-frontend`
- gzip：已开启高压缩（`gzip_comp_level 9`）与常见 MIME 类型
- 安全头：配置中加入了若干响应头（`X-Content-Type-Options`、`X-Frame-Options`、`X-XSS-Protection`、`Referrer-Policy`、
  `Content-Security-Policy`），建议保留并按需要调整 CSP
- 静态资源缓存：CSS/JS/JSON 等设置 `expires 7d`，图片类资源设置 `expires 30d`
- 头像静态访问：路径 `^~ /api/file/avatar/` 使用 `alias /opt/app/user-center/uploads/avatar/;`（注意 `alias` 用法），并设置
  Cache-Control 1 天
- 反向代理：`/api` 路径代理到 `http://user_center_backend`，上游定义在 `user-center-backend.conf`，指向 `127.0.0.1:8100`

示例安全与运维检查命令：

```bash
# 检查 Nginx 配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx

# 查看最近访问日志（实时）
sudo tail -f /var/log/nginx/user-center-react_access.log
```

## SELinux 调整

> 若服务器启用了 SELinux，需要为新的端口和目录赋权

```bash
# 赋予静态目录 httpd_sys_content_t 标签
sudo chcon -R -t httpd_sys_content_t /var/www/user-center/user-center-react-frontend
sudo semanage fcontext -a -t httpd_sys_content_t \
  "/var/www/user-center/user-center-react-frontend(/.*)?"
sudo restorecon -Rv /var/www/user-center/user-center-react-frontend

# 允许 Nginx 访问后端端口
sudo setsebool -P httpd_can_network_connect 1
```

## 防火墙策略

如果您在配置环境时已经开放了相应端口，这一步骤可以请直接跳过

`firewalld`：

```bash
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

`ufw`：

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
sudo ufw status
```

## 静态资源共享目录

> 为了实现后端上传的头像能够被前端访问到（前提：保证后端上传的头像可被 Nginx 读取，需要共享组与权限），可以采用 Nginx 的
> 反向代理 + 静态资源映射的方式实现

**确认两者的系统用户**

```bash
# 查看 nginx 进程的用户
ps aux | grep nginx
# 查看 后端进程的用户
ps aux | grep java
```

**创建一个共享用户组**

让这两个用户都属于同一个组，比如 `uploads`：

```bash
sudo groupadd uploads
```

将两者加入该组：

```bash
sudo usermod -aG uploads nginx
sudo usermod -aG uploads appuser
```

**修改上传目录的属组和权限**

让 `/opt/app/user-center/uploads` 及其子目录属于该组：

```bash
sudo chown -R appuser:uploads /opt/app/user-center/uploads
```

然后设置目录权限，使组用户可读写执行（执行是访问目录所需权限）：

```bash
sudo chmod -R 770 /opt/app/user-center/uploads
```

再确认 Nginx 能读取：

```bash
sudo chmod -R g+rx /opt/app/user-center/uploads/avatar
```

> - `appuser`：主属主，拥有完整读写权限（用于上传文件）
> - `nginx`：通过 `uploads` 组获得读权限（用于静态访问）
> - 其他人：无访问权限（更安全）

**确保新上传文件继承组权限**

为了让 后端新上传的文件 自动属于 `uploads` 组：

```bash
sudo find /opt/app/user-center/uploads -type d -exec chmod g+s {} \;
```

设置 **组继承位 (setgid bit)** 之后，新创建的文件/文件夹将自动属于该目录的组（即 `uploads`）
