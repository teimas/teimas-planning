# Planning Teimas

A modern, multiplatform Planning Poker application by Teimas.

## What is Planning Poker?

Planning Poker (also known as Scrum Poker) is a consensus-based estimation technique used in agile software development. It helps teams estimate the relative effort of user stories or tasks in a collaborative way by:

- Encouraging equal participation from all team members
- Reducing cognitive bias by revealing estimates simultaneously
- Creating meaningful discussions about complexity and requirements
- Leveraging the wisdom of the group to arrive at more accurate estimates

Planning Poker is important because it:
- Improves accuracy of project timelines
- Enhances team collaboration and communication
- Identifies misunderstandings about requirements early
- Creates shared ownership of estimates among team members
- Makes estimation more engaging through gamification

## Technologies Used

This application is built using a modern tech stack:

- **React Native & Expo**: Cross-platform mobile framework allowing us to deploy to iOS, Android and Web
- **TypeScript**: For type-safe code and improved developer experience
- **Firebase**: Backend services including authentication, real-time database, and analytics
- **i18next**: Internationalization framework for multi-language support
- **Jest**: Testing framework with comprehensive coverage reporting
- **ESLint**: Code quality and style enforcement
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment. GitHub Actions is a CI/CD platform that allows you to automate your build, test, and deployment pipeline directly from GitHub.

Our workflow in `.github/workflows/ci.yml` automatically:

1. **Sets up the environment**: Configures Node.js and installs dependencies
2. **Runs linting**: Ensures code quality and consistency  
3. **Executes tests**: Runs the test suite with coverage reporting
4. **Validates configurations**: Checks that all necessary configurations are present
5. **Uploads artifacts**: Stores test coverage reports for later analysis

The CI pipeline runs automatically on pushes to main/develop branches and on pull requests, helping maintain code quality and preventing integration issues.

## Environment Setup

This project uses environment variables for configuration settings, including Firebase credentials. Run the setup script to create your local environment:

```bash
npm run setup-env
```

## License

Private © Teimas
