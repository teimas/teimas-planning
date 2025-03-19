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

## Deployment

### Web Version (AWS Amplify Hosting)

This project uses AWS Amplify Hosting for deploying the web version. Deployment is automated via GitHub Actions.

#### Setting up AWS Amplify Hosting (First-time setup)

1. **Create an Amplify app in the AWS Console**:
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Choose GitHub as the repository source
   - Connect your GitHub account and select the repository
   - Configure the branch to deploy (e.g., main)
   - Skip the build settings (we'll use GitHub Actions instead)

2. **Configure required GitHub secrets**:
   - In your GitHub repository, go to Settings > Secrets and variables > Actions
   - Add the following secrets in the MAIN environment:
     ```
     AWS_ACCESS_KEY_ID         # AWS access key with Amplify permissions
     AWS_SECRET_ACCESS_KEY     # AWS secret key
     AWS_REGION                # AWS region where your Amplify app is hosted
     AMPLIFY_APP_ID            # Your Amplify app ID (found in Amplify Console)
     AMPLIFY_BRANCH            # Branch to deploy (usually 'main')
     ```
   - Also ensure all Firebase configuration secrets are added

3. **Update environment variables in Amplify Console**:
   - In the Amplify Console, go to your app > Environment variables
   - Add the same Firebase environment variables used in GitHub Actions

#### Automatic Deployments

With the setup complete, the web app will automatically deploy to Amplify Hosting whenever:
- Code is pushed to the main branch
- The workflow is manually triggered from GitHub Actions

#### Manual Deployment

You can manually trigger a deployment:
1. Go to your GitHub repository
2. Navigate to Actions > "Deploy to AWS Amplify" workflow
3. Click "Run workflow"

## License

Private © Teimas
