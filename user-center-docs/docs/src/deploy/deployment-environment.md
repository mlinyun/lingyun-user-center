# 项目部署环境

::: tip 说明
本文描述 User Center 在 Linux 服务器中的通用部署前置条件，并对 CentOS/RHEL 与 Ubuntu 24.04 两类环境的差异化步骤进行说明
:::

## 基础要求

- 64 位 CPU、4C8G+ 内存、40GB+ 磁盘（生产建议 100GB+ 且数据盘独立）
- MySQL 8.4、Redis、对象存储等依赖需按对应官方文档部署
- 需具备 `sudo` 权限的系统账号，以便安装软件与配置 Systemd
- 所有命令默认为非交互式服务器执行；如遇代理或离线环境，请先准备离线 RPM/DEB 包

## 软件版本矩阵

| 组件  | 最低版本               | 推荐安装方式                     |
| ----- | ---------------------- | -------------------------------- |
| JDK   | 17 LTS                 | Adoptium Temurin（RPM/DEB 仓库） |
| Nginx | 1.20+                  | 官方稳定仓库                     |
| Maven | 3.9+（仅云端构建需用） | Apache 二进制包或系统仓库        |
| Git   | 2.31+                  | 系统默认                         |

## CentOS / RHEL (7/8/9) 环境准备

### 安装 JDK 17+

如果你使用的是 CentOS Stream 9 系统，则可以直接使用 dnf 包管理器安装 JDK

```bash
# 安装 Java8
sudo dnf install java-1.8.0-openjdk-devel.x86_64
# 安装 Java11
sudo dnf install java-11-openjdk-devel.x86_64
# 安装 Java17
sudo dnf install java-17-openjdk-devel.x86_64
# 安装 Java21
sudo dnf install java-21-openjdk-devel.x86_64
```

设置 java 和 javac 默认版本

```bash
# 设置 java 默认版本
sudo alternatives --config java
# 设置 javac 默认版本
sudo alternatives --config javac
```

如果你使用的是 CentOS7.9，可以使用 yum 包管理器安装 JDK8 和 JDK11，当如果需要安装 JDK17 或 21，则需要通过下面的方案进行安装

**方案1：使用 Adoptium（Eclipse Temurin）RPM 包**

1. 导入 Adoptium GPG key：

   ```bash
   sudo rpm --import https://packages.adoptium.net/artifactory/api/gpg/key/public
   ```

2. 创建 `/etc/yum.repos.d/adoptium.repo`：

   ```bash
   cat <<'EOF' | sudo tee /etc/yum.repos.d/adoptium.repo
   [Adoptium]
   name=Adoptium
   baseurl=https://packages.adoptium.net/artifactory/rpm/${DISTRIBUTION_NAME:-$(. /etc/os-release; echo $ID)}/$releasever/$basearch
   enabled=1
   gpgcheck=1
   gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
   EOF
   ```

3. 安装 JDK 17 或者 JDK21，最低 17，建议安装 21

   ```bash
   sudo yum install -y temurin-17-jdk
   # 或
   sudo yum install -y temurin-21-jdk
   ```

4. 验证 JDK 版本

   ```bash
   java -version
   ```

**方案2：使用 Oracle Java**

从 Oracle Java 下载中获取最新的 Oracle JDK 21 版本下载您的架构所需的包

```bash
wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.rpm
```

使用 yum 包管理器安装 `jdk-21_linux-x64_bin.rpm`

```bash
sudo yum install jdk-21_linux-x64_bin.rpm -y
```

**方案 3：使用 Amazon Corretto 17**

Amazon 提供的 OpenJDK 版本也支持 CentOS 7

```bash
# 导入 GPG key
sudo rpm --import https://yum.corretto.aws/corretto.key

# 添加 yum repo
sudo curl -o /etc/yum.repos.d/corretto.repo https://yum.corretto.aws/corretto.repo

# 安装 Corretto 17
sudo yum install java-17-amazon-corretto-devel
```

### 安装 Nginx

1. 安装必备组件 `yum-utils`：

   ```bash
   sudo yum install -y yum-utils
   ```

2. 设置 yum 存储库，创建 `/etc/yum.repos.d/nginx.repo` 并填写如下的内容：

   ```bash
   cat <<'EOF' | sudo tee /etc/yum.repos.d/nginx.repo
   [nginx-stable]
   name=nginx stable repo
   baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
   gpgcheck=1
   enabled=1
   gpgkey=https://nginx.org/keys/nginx_signing.key
   module_hotfixes=true

   [nginx-mainline]
   name=nginx mainline repo
   baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
   gpgcheck=1
   enabled=0
   gpgkey=https://nginx.org/keys/nginx_signing.key
   module_hotfixes=true
   EOF
   ```

3. 默认情况下，系统会使用稳定版 nginx 软件包的仓库如果您想使用主线 nginx 软件包，请运行以下命令：

   ```bash
   # 可选：启用主线仓库
   sudo yum-config-manager --enable nginx-mainline
   ```

4. 要安装 nginx，请运行以下命令：

   ```bash
   sudo yum install nginx
   ```

   确认 Nginx 是否仍在正常运行，重载配置并确保服务启动：

   ```bash
   # 检查 Nginx 配置是否正确
   sudo nginx -t
   # 重载 nginx 配置
   sudo systemctl reload nginx
   # 查看 nginx 服务状态
   sudo systemctl status nginx
   ```

### 修改 SELinux 策略

在 CentOS 7.9 中默认启动用了 SELinux，这可能会导致 Nginx “bind() permission denied”，所以我们需要修改 SELinux 的策略

**安装 SELinux 管理工具**（如果未安装）

```bash
sudo yum install -y policycoreutils-python selinux-policy*
```

使用命令查看系统是否启用了 SELinux，并确保其模式为 `enforcing`

```bash
sestatus
```

如果输出类似如下的内容，说明 SELinux 处于启用状态

```plaintext
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      31
```

**允许 Nginx 代理访问网络**

```bash
# 允许 Nginx 代理访问网络
sudo setsebool -P httpd_can_network_connect 1
```

> 解释：
>
> - `httpd_can_network_connect` → 允许 Nginx/Apache 发起网络请求（包括本地端口）
> - `-P` → 永久生效，重启 SELinux 或系统也不会失效

### 开放防火墙端口

CentOS7 默认使用 `firewalld`，你需要放行 80 端口和 443 端口：

```bash
# 放行 80 端口
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent

# 放行 443 端口
sudo firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙
sudo firewall-cmd --reload

# 验证是否已放行
sudo firewall-cmd --list-ports
```

## Ubuntu 24.04 LTS 环境准备

### 安装 JDK 17+

在 Ubuntu 24.04 LTS 系统下安装 JDK 17 以上比较简单，可以使用系统自带的 apt 包管理器下载 OpenJDK

```bash
# 安装 Java 8
sudo apt-get install openjdk-8-jdk

# 安装 Java 11
sudo apt-get install openjdk-11-jdk

# 安装 Java 17
sudo apt-get install openjdk-17-jdk

# 安装 Java 21
sudo apt-get install openjdk-21-jdk

# 安装 Java25
sudo apt-get install openjdk-25-jdk
```

设置 java 和 javac 默认版本

```bash
# 设置 java 默认版本
sudo update-alternatives --config java
# 设置 javac 默认版本
sudo update-alternatives --config javac
```

### 安装 Nginx

安装必要组件

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring
```

导入官方的 Nginx 签名密钥，以便 apt 可以验证软件包的真实性获取密钥：

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

确认下载的文件包含正确的密钥：

```bash
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

输出结果应包含完整的指纹信息 `573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62` 具体如下：

```bash
pub   rsa2048 2011-08-19 [SC] [expires: 2027-05-24]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

请注意，输出结果可能包含用于对软件包进行签名的其他密钥

要设置用于稳定版 nginx 软件包的 apt 仓库，请运行以下命令：

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

如果您想使用主线 nginx 软件包，请运行以下命令：

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

设置仓库锁定，优先使用我们自己的软件包而不是发行版提供的软件包：

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx
```

要安装 nginx，请运行以下命令：

```bash
sudo apt update
sudo apt install nginx
```

### 开放防火墙端口

在 Ubuntu 24.04 中，默认使用 **UFW (Uncomplicated Firewall)** 作为防火墙管理工具，一般 UFW 的默认状态为：已安装但**未启用**
（inactive），我们可以使用下面的命令查看防火墙的状态

```bash
# 查看防火墙状态
sudo ufw status

# 查看详细状态
sudo ufw status verbose

# 查看带编号的规则列表
sudo ufw status numbered
```

如果需要对防火墙进行操作（启用、禁用、重置），可以执行下面的命令

```bash
# 启用防火墙
sudo ufw enable

# 禁用防火墙
sudo ufw disable

# 重置为默认设置
sudo ufw reset
```

如果启用了防火墙，需要开放特定的端口，可以执行下面的命令：

```bash
# 允许特定端口
sudo ufw allow 22/tcp          # SSH
sudo ufw allow 80/tcp           # HTTP
sudo ufw allow 443/tcp          # HTTPS
```

## 通用验证

| 检查项       | 命令                                                  |
| ------------ | ----------------------------------------------------- |
| Java 版本    | `java -version`                                       |
| Nginx 版本   | `nginx -v`                                            |
| SELinux 状态 | `sestatus`                                            |
| 防火墙规则   | `sudo firewall-cmd --list-ports` 或 `sudo ufw status` |

确保 Java、Nginx 均已启动且端口已放行后，再继续后端或前端的部署流程
