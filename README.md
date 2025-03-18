# Planning Poker

A multi-user Planning Poker web application for agile teams to estimate work collaboratively. Built with React Native and Expo.

**Created by:** Ludo Bermejo  
**Company:** [Teimas](https://teimas.com)

## What is Planning Poker?

Planning Poker is an agile estimation technique where team members use numbered cards to vote on the effort required for a user story or task. This app provides a digital version of this technique, allowing teams to:

1. Create estimation sessions
2. Invite team members to join
3. Vote anonymously on stories
4. Reveal all votes simultaneously
5. Discuss differences and reach consensus

## Features

- **Multi-user real-time sessions**: Create and join planning poker sessions
- **Anonymous voting**: Cast votes privately until all votes are revealed
- **Vote visualization**: See votes displayed by card value after reveal
- **Statistical analysis**: View average and most common estimates
- **User-friendly interface**: Simple, intuitive design for all team members
- **Session sharing**: Easily share session IDs to invite others
- **Host controls**: Session creator can reveal votes and reset for new rounds
- **Responsive design**: Works on desktop, tablet, and mobile browsers
- **Multilingual support**: Available in English and Spanish

## Technology Stack

- **Frontend**: React Native Web, Expo
- **State Management**: Zustand
- **Backend**: Firebase Realtime Database
- **Authentication**: Username-only for simplicity
- **Routing**: Expo Router
- **Internationalization**: i18next

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Firebase

   Update the Firebase configuration in `firebase/config.ts` with your own Firebase project details.

3. Start the app

   ```bash
   npx expo start --web
   ```

## Usage Instructions

1. **Login**: Enter your name to identify yourself in the session
2. **Home Screen**: Choose to create a new session or join an existing one
3. **Create Session**: Start a new planning session as the host
4. **Join Session**: Enter a session ID to join as a participant
5. **Vote**: Select a card with your estimate
6. **Reveal**: The host can reveal all votes at once
7. **Analysis**: View the average and most frequent estimates
8. **Reset**: Start a new round with the same participants

## Development

This project uses Expo and React Native. The main files are:

- `app/login.tsx`: Login screen
- `app/home.tsx`: Home screen for creating/joining sessions
- `app/planning-session.tsx`: Main Planning Poker screen
- `stores/sessionStore.ts`: State management for sessions
- `firebase/config.ts`: Firebase configuration

## Customization

- **Card Values**: Modify `CARD_VALUES` in `app/planning-session.tsx` to use different scales
- **Appearance**: Edit the styles in each component file
- **Language**: Update translations in `src/i18n/en.json` and `src/i18n/es.json`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
