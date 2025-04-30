# Frontend Linting and Formatting

This project uses ESLint and Prettier for code linting and formatting.

## Available Commands

- `yarn lint` - Run ESLint to check for code issues
- `yarn lint:fix` - Run ESLint and automatically fix issues where possible
- `yarn format` - Run Prettier to format all code files
- `yarn format:check` - Check if files are formatted according to Prettier rules
- `yarn validate` - Run lint, format check, and tests

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration
- `.prettierignore` - Files to be ignored by Prettier
- `.vscode/settings.json` - VS Code editor settings for consistent formatting

## VS Code Integration

For the best development experience in VS Code, install the following extensions:

1. ESLint (`dbaeumer.vscode-eslint`)
2. Prettier - Code formatter (`esbenp.prettier-vscode`)

The project includes VS Code settings that will:

- Format code on save using Prettier
- Fix ESLint issues on save
- Use the project's ESLint and Prettier configurations

## Current Limitations

- Some files may have warnings that need to be addressed over time
- The `src/app/schemas/page.tsx` file is currently excluded from linting due to parsing issues
- TypeScript version mismatch warning with @typescript-eslint (this is a known issue and doesn't affect functionality)

## Best Practices

1. Always run `yarn validate` before committing changes
2. Address warnings incrementally to improve code quality
3. Use TypeScript properly to avoid `any` types where possible
4. Follow React Hooks rules (don't call hooks inside callbacks)
5. Remove unused imports and variables

## Future Improvements

- Set up pre-commit hooks with Husky and lint-staged
- Gradually fix all warnings in the codebase
- Add more specific rules for consistent code style
