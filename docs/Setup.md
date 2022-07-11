# Android

## Clone github repository

```shell
git clone https://github.com/e-johnson/MFTmusic.git
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

- [react-navigation 5](https://reactnavigation.org)

Navigation for react native

- [react-native-paper](https://callstack.github.io/react-native-paper/index.html)

Component library used for theming and components.

- TypeScript

Type safe programming language

- AsyncStorage

Offline key value storage and also used for Redux state persistance

- [react-native-fs](https://www.npmjs.com/package/react-native-fs)

For native file management

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

## Project walkthrough

Your src folder is where most of the goodies are found in the app. Let's walk through them in more detail. Start with src/App.tsx (described below) and work your way down the walkthrough in order.

### screens

screens are full screens.

`shared` folder contains shared screens between stacks. Playlist screens can be used as nested navigation.

`launch` Launch screen of the application

`RootNavigator.tsx` - main view of your application. Contains your status bar and navigation container

### Navigation

`RootNavigator.tsx` - Root navigation and bottom bar is defined in this file.

Inside each screen folder index.tsx contains the navigation stack defined

### utils

Additional files of the application

`theme.ts` contains theme definitions

### assets

`Icons` svg icons used in the project stays here

`Animations` lottie json animations lives here

`images` Introduction screen images here

`Media.json` contains hard coded songs
