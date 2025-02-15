# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

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
<br>

---

<br>
<br>

# Contribution Guidelines

To ensure a smooth workflow for our mobile app project, please follow these conventions when contributing.

---

## 1. Branching Strategy

- **Never Push Directly to `main` (or `master`):**  
  All changes should go through feature branches and pull requests to ensure proper code review and testing.

- **Branch Types:**
  - **Feature Branches:** For new features.  
    **Example:** `feature/login-screen`
  - **Bugfix Branches:** For bug fixes.  
    **Example:** `bugfix/crash-on-load`
  - **Hotfix Branches:** For urgent fixes on production code.  
    **Example:** `hotfix/fix-payment-error`
  - **Release Branches (Optional):** For preparing a release.  
    **Example:** `release/v1.2.0`

---

## 2. Branch Naming Conventions

- **Use Lowercase and Hyphens:**  
  This improves readability and consistency.  
  **Examples:**
  - `feature/user-authentication`
  - `bugfix/navigation-error`

- **Keep it Descriptive:**  
  Include a short description of the change so others can easily understand the purpose.

---

## 3. Commit Message Conventions

Use a consistent commit message format to maintain a clear project history. We follow the **Conventional Commits** standard:

- **Format:** <br>
### type(scope): description

- **Types:**
  - `feat:` — for new features
  - `fix:` — for bug fixes
  - `docs:` — for documentation changes
  - `style:` — for formatting changes (no code logic changes)
  - `refactor:` — for code refactoring
  - `test:` — for adding or modifying tests
  - `chore:` — for changes to build process, auxiliary tools, etc.

- **Examples:**
   - `feat(auth): add login screen with validation`
   - `fix(api): resolve crash when fetching user data`
   - `docs(readme): update installation instructions`

- **Additional Guidelines:**
   - Keep the subject line concise (preferably under 50 characters).
   - Include a longer description in the commit body if needed.

---

## 4. Pull Requests & Code Reviews

- **Always Open a Pull Request (PR):**  
   - When your feature or fix is ready, open a PR to merge your branch into `main`.

- **Review Process:**
   - At least one other team member should review the PR.
   - Ensure tests pass and code style guidelines are met.
   - Link related issues in the PR description.

- **Merge Strategy:**
   - **Prefer Squash Merging:** Keeps a clean history by consolidating commits.
   - **Rebase Regularly:** Keep your branch up-to-date with the base branch to avoid conflicts.

---

## 5. Additional Best Practices

- **Keep Commits Atomic:**  
   - Each commit should represent a single logical change.

- **Descriptive PR Titles and Descriptions:**  
   - Use clear titles and detailed descriptions to help others understand the purpose of the changes.

- **Document Your Workflow:**  
   - New team members should refer to these guidelines to get up to speed quickly.

---
