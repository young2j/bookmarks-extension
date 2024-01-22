[English](./README.md)|[中文文档](./README.ZH_CN.md)

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/young2j/bookmarks-extension?color=56BEB8">
  <img alt="Github language count" src="https://img.shields.io/github/languages/count/young2j/bookmarks-extension?color=56BEB8">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/young2j/bookmarks-extension?color=56BEB8">
  <img alt="License" src="https://img.shields.io/github/license/young2j/bookmarks-extension?color=56BEB8">
<img alt="Github forks" src="https://img.shields.io/github/forks/young2j/bookmarks-extension?color=56BEB8" />
  <img alt="Github stars" src="https://img.shields.io/github/stars/young2j/bookmarks-extension?color=56BEB8" />
</p>


<p align="center">
  <a href="#dart-关于仓库">关于仓库</a>   |
  <a href="#hammer-相关技术">相关技术</a> |
  <a href="#rocket-如何运行">如何运行</a>   |  
  <a href="#handshake-鸣谢">鸣谢</a> | 
  <a href="#memo-License">鸣谢</a>
</p>



<br>

> 😡😡😡 Fuck核污水排海，我丢！ 💣🗾💥😤😤😤

# :dart: 关于仓库

本仓库fork自 https://github.com/br4adam/bookmarks，是一个设计来轻松管理网页书签的应用。相较于原仓库，本仓库主要做了如下变更：

* 改造成了一个Chrome扩展插件。
* 移除了`supabase`依赖及相关的登陆认证模块。
* 新增了书签组的概念。
* 新增了书签的导入导出。
* 简化了部分ui。
* 其他小改动。



# :hammer: 相关技术

* [`react`](https://react.docschina.org/)

* [`headlessui`](https://headlessui.com/)

* [`tailwindcss`](https://tailwind.nodejs.cn/)

* [`zustand`](https://zustand-cn.js.org/)

* [`plasmo`](https://www.plasmo.com/)

* [`pnpm`](https://www.pnpm.cn/)

  

# :rocket: 如何运行

## 1. 源码构建

```shell
git clone git@github.com:young2j/bookmarks-extension.git
cd bookmarks-extension
pnpm install
pnpm build
```

然后在`build/`目录下会生成名为`chrome-mv3-prod`的扩展资源文件。

在`chrome`浏览器扩展管理页面`chrome://extensions/`加载上述已解压的扩展程序即可。

## 2. 下载发布的zip文件

直接在[`release`](https://github.com/young2j/bookmarks-extension/releases)页面下载`bookmarks-extension.zip`，解压后在`chrome`浏览器扩展管理页面`chrome://extensions/`加载即可。



# :handshake: 鸣谢

 [https://github.com/br4adam/bookmarks](https://github.com/br4adam/bookmarks)



## :memo: License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with ❤️ by  [young2j](https://github.com/young2j)
