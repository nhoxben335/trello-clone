# Trello Web App
A full-stack MERN Trello application for managing tasks.

## Introduction
Trello App is a web application that allows users to create, view, update, and delete tasks. It provides a user-friendly interface for managing tasks efficiently.

## Features

## Technologies

## Setup

git clone https://github.com/nhoxben335/trello-web.git

## Install dependencies
nvm use 18.16.0
cd trello-web -> run "yarn install" -> run "yarn dev" (zsh)

## Project Phases
### Phase 1: Front-end JS
React - React Hooks

JSX vs JS

Semantic Versioning

Clean code

Material Design UI

Redux - Redux Toolkit

## Reference Documents
### 1: Environment Set-up
- NodeJS: [https://nodejs.org/en](https://nodejs.org/en)
- Git: [https://git-scm.com/](https://git-scm.com/)
- Yarn: [https://classic.yarnpkg.com/lang/en/d...](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- Vite: https://vitejs.dev/guide/
- NVM: https://github.com/nvm-sh/nvm#install--update-script
- ESlint: https://eslint.org/docs/latest/use/getting-started
- @mui/material: https://www.npmjs.com/package/@mui/material
- @emotion/react: https://www.npmjs.com/package/@emotion/react
- @emotion/styled: https://www.npmjs.com/package/@emotion/styled
- @mui/icons-material: https://www.npmjs.com/package/@mui/icons-material

### 2: Trello Web App Layout Analysis

![Trello Layout Web Page](https://github.com/nhoxben335/trello-clone/assets/76023735/2c1e5b30-8ca4-4225-91c5-da89b62c9342)

### 3: New Component Structure

<img width="1139" alt="New component structure" src="https://github.com/nhoxben335/trello-clone/assets/76023735/59e66226-cb86-4c6a-b6e2-e8e3ceafc87f">

### 4: Sort Data 
-Optional Chaining, Object Destructuring, String charAt, String toUpperCase, Array Slice, Spread Operator, Array sort, Array indexOf
- React map keys:
https://legacy.reactjs.org/docs/lists-and-keys.html
- Clone Array:
https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/

### 5: Dnd-kit, Drag, and Drop Research
- dnd-kit: https://dndkit.com
- Which drag and drop library should use?: https://levelup.gitconnected.com/say-goodbye-to-react-dnd-hello-to-dnd-kit-the-future-of-drag-and-drop-is-here-6aa488f17a0
- Dnd-kit: https://www.npmjs.com/package/@dnd-kit/core
- Dnd-kit-sortable: https://www.npmjs.com/package/@dnd-kit/sortable
- dnd-utilities: https://www.npmjs.com/package/@dnd-kit/utilities
- (Sortable Context) Note about the Items array in the Sortable Context component: https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
- (Sensors) Require mouse to move 10px to activate, fix case where click event is called: https://docs.dndkit.com/api-documentation/sensors#usesensor
- The error of dragging and dropping stretched elements is quite strange: https://github.com/clauderic/dnd-kit/issues/117
- Touch tolerance: Tolerance (read more in the comment I pinned): https://docs.dndkit.com/api-documentation/sensors/touch#delay