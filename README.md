# Habit Tracker

A simple habit tracking application for making habit management easier.

## Features

- **Habit Management**: 
  - Add and track habits with ease
  - Categorize habits for better organization
  - Set specific weekdays for each habit
  - Edit, stop and delete habits
  - Navigate days and weeks using buttons or click on the calendar icon to navigate using a date picker
- **Category Customization**: 
  - Create custom categories with unique icons

## Tech Stack

- **Frontend**:
  - Javascript
  - Vue.js
  - Vue Router
  - Vuetify

## Testing

- **End-to-End Tests**: Playwright


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Test with Playwright
Navigate to src/components. Each component folder has an e2e folder. 
Run tests from any of the e2e folders using the command below:

```sh
npx playwright test
```
