# CodeAlpha App Development Tasks

This project implements **three CodeAlpha App Development internship tasks** in one React Native + Expo mobile application:

1. Flashcard Quiz App
2. Random Quote Generator
3. Fitness Tracker App

The CodeAlpha task sheet asks interns to complete any 2 or 3 of the 4 listed tasks and upload the complete source code to a GitHub repository named `CodeAlpha_ProjectName`. It also asks for a LinkedIn video explanation with the GitHub repository link and submission through the provided form.

## Features

### Task 1 — Flashcard Quiz App
- Question and answer flashcards
- Show/Hide Answer
- Next / Previous navigation
- Add flashcards
- Edit flashcards
- Delete flashcards
- Local persistence with AsyncStorage

### Task 2 — Random Quote Generator
- Random quote on app use
- New Quote button
- Quote text and author
- Works offline using built-in quote data
- Minimal UI

### Task 3 — Fitness Tracker App
- Steps tracking
- Workout minutes
- Calories burned
- Activity logging
- Recent progress bars
- Local persistence with AsyncStorage
- Reset data option

## Requirements

- Node.js LTS
- npm
- Expo CLI through `npx expo`

## Run

```bash
npm install
npx expo start
```

Then:
- Press `a` for Android emulator, or
- Scan the QR code using Expo Go.

For web:

```bash
npm run web
```

## Suggested GitHub Repository

```text
CodeAlpha_AppDevelopmentTasks
```

or, following the task sheet naming convention:

```text
CodeAlpha_AppDevelopment
```

## Suggested LinkedIn video flow

1. Introduce yourself and the CodeAlpha internship.
2. Show the home screen.
3. Demonstrate Flashcard add/edit/delete and answer reveal.
4. Demonstrate New Quote.
5. Demonstrate Fitness logging and progress.
6. Show the GitHub repository.
7. Mention that the project contains three completed tasks.

## Project structure

```text
CodeAlpha_App_Development_Tasks/
├── App.js
├── app.json
├── package.json
├── README.md
└── assets/
```

No `node_modules` folder is included in the ZIP. Run `npm install` after extracting.
