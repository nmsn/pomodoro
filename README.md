# Pomodoro

![github version](https://img.shields.io/github/package-json/v/nmsn/pomodoro)
![license](https://img.shields.io/github/license/nmsn/pomodoro)
![last commit](https://img.shields.io/github/last-commit/nmsn/pomodoro)
![commit activity](https://img.shields.io/github/commit-activity/y/nmsn/pomodoro)

A online pomodoro clock + Todo List.

English | [简体中文](./README.zh-CN.md)

Online address: [https://pomodoro-easy.vercel.app/](https://pomodoro-easy.vercel.app/)

![pomodoro.png](https://s2.loli.net/2023/02/18/dRlCoLftjqX7IUZ.png)

![pomodoro_todo.png](https://s2.loli.net/2023/02/18/PeAHoVTN6tE4JWB.png)
## Features

- Lightweight: Open a web page and use it, no additional client is required.
- Safety: Use `localstorage` to save data and involve no network requests.
- Terseness: A flat interface built with `tailwindcss` without other complications.

## Tech

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=Next.js&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=TypeScript&logoColor=white&style=flat)
![React](https://img.shields.io/badge/-React-61DAFB?logo=React&logoColor=white&style=flat)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=TailwindCSS&logoColor=white&style=flat)
![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=Redux&logoColor=white&style=flat)

- Use `Nextjs` to set up a development environment.
- Developed using `Typescript` throughout.
- Develop components using `React`.
- Use `React-Dnd` to develop the drag-and-drop sorting function of Todo List.
- Use `canvas-confetti` to add animation effects when finished.
- Use `Tailwindcss` to develop styles.
- Use `Redux` `Redux-Toolkit` `Redux-Persist` to maintain global state data.

## Finished

- [x] Base pomodoro clock.
- [x] Editable todo list.
  - [x] Add\Delete.
  - [x] Switch finished and unfinished status.
  - [x] Drag and drop to change the TODO List order.
  - [x] Mark an expired item.
- [x] Persist data.
- [x] Two time formats(25min/50min)
- [x] Full screen.
- [x] Animation when finished.
- [x] Full screen.


## Todo

- [ ] Custom theme color.
- [ ] Sound when finished.
- [ ] Mobile adaptation.
- [ ] Add a clock mode.

## Contributing

- [nmsn](https://github.com/nmsn)

## License

[MIT License](https://github.com/nmsn/pomodoro/blob/main/LICENSE)
