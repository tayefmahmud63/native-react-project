# Android

## Clone github repository

```shell
git clone https://github.com/e-johnson/Vybezmusic.git
```

## Project structure

The following folders in packages indicate following things

| folder name | description          |
| ----------- | -------------------- |
| android     | native android code  |
| ios         | native ios code      |
| src         | react native project |
| assets      | logos and fonts      |

## Dependencies

- react-native-track-player

Audio player for android and ios

- realm

Offline database

- @stripe/stripe-react-native

For managing payment

- redux

State management library

- lottie

For Animations in react native

## Branches

- develop -> pr this branch for everything
- main -> source code of production application

## Install project dependencies

Navigate to project root:

We're using [Yarn](https://yarnpkg.com) for this project, do not use npm for the following commands
Run below command in project root:

```shell
yarn install
```

## IOS

Navigate to ios

```shell
cd ios
pod install
```

## Configurations

Create a .env file for managing secrets in root folder

```shell
touch .env
```

## Run Metro bundler

```shell
yarn start
```

## Connect emulator or real device

## Install application on device

```shell
yarn android
yarn ios
```

## Run tests

The tests of a specific packages are present in **tests** folder to run

```shell
yarn tests
```
