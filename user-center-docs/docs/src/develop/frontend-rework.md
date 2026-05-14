# 前端项目重新出发

## 前言

前面的前端项目，我用的是和鱼皮用户中心视频教程一样的版本 V5 的，可以很顺利的完成。但是我看到很多星球的小伙伴用的 Ant Design
Pro V6 的版本来完成用户中心项目，遇到了一系列的问题，所以我萌生了一个想法，那就是用 V6
版本来重新做一下用户中心系统的前端部分（不看视频做），以此来巩固一下前端的部分。下面我记录了我用 V6 版本做遇到的问题和 V6 和
V5 版本不一样的地方，其他的没有记录的基本和 V5 版本一样，没区别。

## 移除国际化命令之后报错

执行移除国际化命令 `i18n-remove` 之后，还需要手动的删除下面的代码，不然在项目启动的时候会报错：

`src\components\index.ts`

![image-20240203004927864](https://static.mlinyun.com/user-center/image-20240203004927864.png)

`src\components\RightContent\index.tsx`

![image-20240203004902878](https://static.mlinyun.com/user-center/image-20240203004902878.png)

`src/pages/User/Login/index.tsx`，在这个文件中，需要删除下面的代码：

```tsx
const Lang = () => {
  const { styles } = useStyles();
  return;
};

<Lang />;
```

![image-20240203124140409](https://static.mlinyun.com/user-center/image-20240203124140409.png)

![image-20240203124545658](https://static.mlinyun.com/user-center/image-20240203124545658.png)

## 修改 Footer 组件遇到的问题

在修改 `DefaultFooter` 组件的时候，发现他们的链接挨太近了，不是很好看，打开开发者工具之后，发现每个 `a` 标签都有
`ant-pro-global-footer-list-link` 类，这样就好办了，我们在这个类添加样式就行了。

![image-20240203020515372](https://static.mlinyun.com/user-center/image-20240203020515372.png)

上面说了，我们改一下样式就行，那么在哪里改呢？不知道你注意到 `src/global.less` 这个文件没有，该文件定义了全局的样式，所以我们直接在该文后面加上下面的代码就行：

```less
.ant-pro-global-footer-list *:not(:last-child) {
  margin-inline-end: 42px;
}
```

![image-20240203021152710](https://static.mlinyun.com/user-center/image-20240203021152710.png)

改完之后，我们在浏览器刷新页面，看看修改过后的效果：

![image-20240203120004160](https://static.mlinyun.com/user-center/image-20240203120004160.png)

## 给 Logo 添加额外类名 logo

在最新的 Ant Design Pro 中，添加样式不是单独写一个文件了，而是写在 `useStyles` 里面：

![image-20240203131010566](https://static.mlinyun.com/user-center/image-20240203131010566.png)

![image-20240203131414126](https://static.mlinyun.com/user-center/image-20240203131414126.png)

## 添加全局响应拦截器

V6 版本的请求配置可以配置错误处理，在错误处理里面有设置全局的响应拦截器，我们在 `requestErrorConfig.ts` 这个文件添加就行：

![image-20240208222916832](https://static.mlinyun.com/user-center/image-20240208222916832.png)

![image-20240208222734326](https://static.mlinyun.com/user-center/image-20240208222734326.png)

添加全局响应拦截器：

```tsx
// 响应拦截器
responseInterceptors: [
  (response) => {
    // 拦截响应数据，进行个性化处理
    const { data } = response as unknown as ResponseStructure;
    if (data.code === 0) {
      return response.data;
    }
    if (data.code === 40100) {
      message.error("请先登录");
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get("redirect") || "/");
    } else {
      message.error(data.description);
    }
    return response.data;
  },
];
```

![image-20240208223325969](https://static.mlinyun.com/user-center/image-20240208223325969.png)

上面的报错信息我不知道怎么修改，但是它不影响项目的运行，依然可以实现全局响应拦截的效果：

![image-20240208223606967](https://static.mlinyun.com/user-center/image-20240208223606967.png)
