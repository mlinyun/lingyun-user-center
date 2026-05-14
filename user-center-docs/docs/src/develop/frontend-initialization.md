# 前端代码初始化

## 环境准备

在开始开发之前，我们需要先准备好开发环境：安装 node.js。

### 第一种方式：在官网下载安装

node.js 官网：<https://nodejs.org/en>

![image-20240127184613080](https://static.mlinyun.com/user-center/image-20240127184613080.png)

最好下载长期支持版，**不要下载最新版**。之后根据安装向导无脑下一步就行（期间可更改安装位置），这里就不演示了，因为笔者不是使用这种方式安装的。

### 第二种方式：使用 nvm 安装 node.js （**推荐**）

下载安装 nvm：<https://github.com/coreybutler/nvm-windows/releases>

![image-20240127185710746](https://static.mlinyun.com/user-center/image-20240127185710746.png)

选择红框中其中一个下载安装即可，在安装向导时，可以修改 nvm 的安装路径，还可以指定 node.js 的安装路径。

安装完成之后可以打开终端，输入 `nvm -v` 命令，查看 nvm 是否安装成功，如果出现版本信息，即说明安装成功。

![image-20240127190348783](https://static.mlinyun.com/user-center/image-20240127190348783.png)

接着进入正题，开始安装 node.js，我们在终端输入 `nvm list available`，该命令的作用是显示可以安装的所有 node.js 版本。

![image-20240127190740371](https://static.mlinyun.com/user-center/image-20240127190740371.png)

然后我们再使用 `nvm install [version]` 命令安装指定版本的 node.js，比如 `nvm install 18.19.0`，即安装版本号为 18.19.0 的
node.js。同样，这里还是建议安装长期支持版（LTS）。

最后一步，执行 `nvm use [version]`，这里的 version 改成我们安装成功的 node.js 版本号，切换到使用指定的 nodejs 版本。

使用 nvm 可以安装多个版本的 node.js，笔者在自己的电脑上安装了 4 个版本的 node.js。那么该如何查看已安装的 node.js 版本呢？答案是执行
`nvm list` 命令，即可查看已安装的 node.js 版本。

![image-20240127191939915](https://static.mlinyun.com/user-center/image-20240127191939915.png)

上图中带有星号的版本，就是我们此时使用的 node.js 版本。

**nvm 常用命令**

这里给出 nvm 比较常用的一些命令，想要了解更多的读者可以自行百度。

```bash
nvm off                     // 禁用node.js版本管理(不卸载任何东西)
nvm on                      // 启用node.js版本管理
nvm install <version>       // 安装node.js的命令 version是版本号 例如：nvm install 8.12.0
nvm uninstall <version>     // 卸载node.js的命令，卸载指定版本的nodejs，当安装失败时卸载使用
nvm ls                      // 显示所有安装的node.js版本
nvm list available          // 显示可以安装的所有node.js的版本
nvm use <version>           // 切换到使用指定的nodejs版本
nvm v                       // 显示nvm版本
nvm install stable          // 安装最新稳定版
```

好了，到这一步，我们的环境准备算是完成了。

## 引入 Ant Design Pro

Ant Design Pro 提供了 pro-cli 来快速的初始化脚手架

1. **全局安装 pro-cli**

   ```bash
   # 使用 npm
   npm i @ant-design/pro-cli -g
   ```

   上面的命令是 Ant Design Pro 官网给出的全局安装 pro-cli 的命令，默认是安装最新版的 pro-cli，但是最新版的在创建项目时，选择不了
   umi 版本，为了和鱼皮视频教程里使用一样的 umi 版本，笔者在安装时指定了 pro-cli 版本进行全局安装

   ```bash
   npm install -g @ant-design/pro-cli@3.1.0
   ```

   ![image-20240127200240636](https://static.mlinyun.com/user-center/image-20240127200240636.png)

   使用 npm 默认源安装会非常慢，笔者用了 19min 才完成安装，所以我们可以切换一下源：

   ```bash
   npm config get registry  # get命令查看registry
   npm config set registry http://registry.npm.taobao.org   # 用set换为阿里镜像
   ```

2. **使用 pro-cli 创建前端项目**

   打开终端，进入我们存放代码的目录，然后执行下面的命令创建前端项目：

   ```bash
   pro create user-center-web
   ```

3. **选择 umi 的版本**

   ```bash
   ? 🐂 使用 umi@4 还是 umi@3 ?
     umi@4
   > umi@3
   ```

   ![image-20240127201128118](https://static.mlinyun.com/user-center/image-20240127201128118.png)

   这里选择 umi@3，和鱼皮的视频教程选择一样的版本，然后回车进入下一步：

   ```bash
   ? 🚀 要全量的还是一个简单的脚手架? (Use arrow keys)
   > simple
     complete
   ```

   ![image-20240127201158277](https://static.mlinyun.com/user-center/image-20240127201158277.png)

   紧接着选择 pro 的模板，simple 是基础模板，只提供了框架运行的基本内容，complete 包含所有区块，不太适合当基础模板来进行二次开发，所以这里选择
   simple 基础模板，然后回车开始拉取代码。

   ![image-20240127201405681](https://static.mlinyun.com/user-center/image-20240127201405681.png)

4. **安装依赖**

   安装依赖这一步也可以在终端使用下面的命令完成：

   ```bash
   cd user-center-web
   npm install
   ```

   但是笔者选择在开发工具 WebStorm 中完成，首先使用 WebStorm 打开我们创建好的前端项目 `user-center-web`：

   ![image-20240127202558905](https://static.mlinyun.com/user-center/image-20240127202558905.png)

   然后点击通知栏弹窗里的 `npm install`即可完成依赖安装

   ![image-20240127202901183](https://static.mlinyun.com/user-center/image-20240127202901183.png)

5. **开启 Umi UI（可选）**

   ```bash
   // 打开开发模式下页面右下角的小气泡，方便添加区块和模板等pro资产
   npm install --save-dev @umijs/preset-ui
   ```

   这里有一点要注意，如果我们使用普通的网络，可能会出现 Umi UI 区块和模板无法预览的情况，如下图所示：

   ![image-20240127214824616](https://static.mlinyun.com/user-center/image-20240127214824616.png)

   这里给出两种解决方案：

   **方案1：** 需要魔法上网，使用 VPN加载，就是挂梯子

   **方案2：** 修改 hosts 文件，使用管理员权限打开记事本，然后再记事本中打开 hosts 文件
   `C:\Windows\System32\drivers\etc\hosts`

   ![image-20240127220918625](https://static.mlinyun.com/user-center/image-20240127220918625.png)

   在 hosts 文件种添加 `151.101.64.133 raw.githubusercontent.com`，然后保存即可。

   然后我们在浏览器刷新页面，就能够加载出来了。

   ![image-20240127221354742](https://static.mlinyun.com/user-center/image-20240127221354742.png)

6. **启动项目**

   执行下面的命令即可启动项目

   ```bash
   npm run start
   ```

   笔者在启动项目时，出现了如下的错误：

   ![image-20240127212221893](https://static.mlinyun.com/user-center/image-20240127212221893.png)

   我通过百度搜索知道：这个错误是由于 webpack
   造成的，具体啥原因我也不明白😭，解决方案可以参考这篇文章：[Webpack 构建失败并出现ERR_OSSL_EVP_UNSUPPORTED - 堆栈溢出 (stackoverflow.com)](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported)

   这里也给出解决的方案：

   **解决方案1：** 修改单个启动脚本。在 `package.json` 启动脚本中加入参数 `NODE_OPTIONS=--openssl-legacy-provider`

   ```json
   // 默认的启动脚本
   "start": "cross-env UMI_ENV=dev umi dev"
   // 修改后的启动脚本
   "start": "cross-env NODE_OPTIONS=--openssl-legacy-provider UMI_ENV=dev umi dev"
   ```

   保存好脚本之后，`npm run start` 重启项目即可。

   **解决方案2：**设置环境变量，不用修改任何脚本，对所有启动脚本有效。我使用的是powershell，输入：
   `$env:NODE_OPTIONS="--openssl-legacy-provider"`。之后`npm run start` 重启项目即可。

   **解决方案3：** 降低 node.js 版本，我原先使用的版本是 18.19.0，使用 `nvm use 16.20.2` 切换低版本的 node.js，然后启动项目就不报错了。

   笔者使用的就是第3种方案，个人觉得第3种最方便，此时运行 `npm run start` 就不会报错了。

   ![image-20240127214052752](https://static.mlinyun.com/user-center/image-20240127214052752.png)

7. **查看效果**

   我们点击上面的链接 `http://localhost:8000`，就可以看到项目启动后的效果了。

   ![image-20240127214401767](https://static.mlinyun.com/user-center/image-20240127214401767.png)

## 对 Ant Design Pro 进行瘦身

移除国际化 `i18n`，官方提供了一个命令 `i18n-remove` 脚本，用于删除项目中所有的 i18n 代码

```bash
npm run i18n-remove
```

![image-20240127221544172](https://static.mlinyun.com/user-center/image-20240127221544172.png)

运行完上面的命令之后，存放国际化文件的代码还是存在的，需要我们手动删除。我们找到 `src/locales` 文件夹，将整个文件夹删除。

注意：我们在对项目进行瘦身的时候，千万不要等到把所有不需的功能删除后再去重新启动项目，因为在删除功能的时候可能会报错，等全部删除再启动发现报错，会比较难以定位报错位置，所以这里建议删除一个功能就重新启动项目，这样万一报错会比较容易解决。

删除 `/src/e2e` 文件夹，集成自动化测试。

删除 `/src/services/swagger` 文件夹，接口文档工具。

删除 `/config/oneapi.json` 文件，定义整个项目用到的接口。在删除这个文件的时候，我们同时也要把引用到这个文件的代码删除：

![image-20240127223416038](https://static.mlinyun.com/user-center/image-20240127223416038.png)

我们找到 `/config/config.ts` 文件，删除下面红框里的代码：

![image-20240127223559104](https://static.mlinyun.com/user-center/image-20240127223559104.png)

删除 `/tests` 文件夹，前端测试。

删除 `jest.config.js` 文件，测试工具。同样，在删除这个文件的时候，也需要删除引用到这个文件的代码：

![image-20240127224334701](https://static.mlinyun.com/user-center/image-20240127224334701.png)

我们找到 `tsconfig.json` 文件，删除下面红框里的代码：

![image-20240127224626178](https://static.mlinyun.com/user-center/image-20240127224626178.png)

删除 `playwright.config.ts` 文件，Playwright 微软开发的自动化测试工具，在删除这个文件时，也需要在 `tsconfig.json`
删除引用它的代码，和上面的一样，这里就不贴图了。
