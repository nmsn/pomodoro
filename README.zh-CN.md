
# Pomodoro

![github version](https://img.shields.io/github/package-json/v/nmsn/pomodoro)
![license](https://img.shields.io/github/license/nmsn/pomodoro)
![last commit](https://img.shields.io/github/last-commit/nmsn/pomodoro)
![commit activity](https://img.shields.io/github/commit-activity/y/nmsn/pomodoro)

一个在线的番茄钟 + Todo List。

[English](./README.md) | 简体中文

在线地址: [https://pomodoro-easy.vercel.app/](https://pomodoro-easy.vercel.app/)

![pomodoro.png](https://s2.loli.net/2023/02/18/dRlCoLftjqX7IUZ.png)

![pomodoro_todo.png](https://s2.loli.net/2023/02/18/PeAHoVTN6tE4JWB.png)

## 特征

- 轻量：打开网页就可使用，不需要额外的客户端
- 安全：使用 `localstorage` 保存数据，不涉及网络请求
- 简洁：使用 `tailwindcss` 打造的扁平化界面，没有其他复杂功能

## 技术栈

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=Next.js&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=TypeScript&logoColor=white&style=flat)
![React](https://img.shields.io/badge/-React-61DAFB?logo=React&logoColor=white&style=flat)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=TailwindCSS&logoColor=white&style=flat)
![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=Redux&logoColor=white&style=flat)

- 使用 `Nextjs` 搭建开发环境
- 全程使用 `Typescript` 开发
- 使用 `React` 开发组件
- 使用 `React-Dnd` 开发 Todo List 的拖拽排序功能
- 使用 `canvas-confetti` 增加完成时的动画特效
- 使用 `Tailwindcss` 开发样式
- 使用 `Redux` `Redux-Toolkit` `Redux-Persist` 来维护全局状态数据

## 已完成功能

- [x] 基础番茄钟功能
- [x] 可编辑的 Todo List
  - [x] 新增、删除
  - [x] 切换完成和未完成状态
  - [x] 拖拽更改 TODO List 顺序
  - [x] 标记过期 TODO List 项
- [x] 持久化保存数据
- [x] 两种番茄钟时间可供选择（25min/50min）
- [x] 全屏功能
- [x] 任务完成时的动画特效

## 待开发功能

- [ ] 自定义主题色功能
- [ ] 完成任务时的音效
- [ ] 移动端的适配
- [ ] 增加时钟模式

## 参与贡献

欢迎一起开发，互相学习!

- [nmsn](https://github.com/nmsn)

## License

[MIT License](https://github.com/nmsn/pomodoro/blob/main/LICENSE)
