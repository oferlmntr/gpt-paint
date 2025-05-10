# Contributing to GPT Power-Ups

First off, thank you for considering contributing to GPT Power-Ups! It's people like you that make this tool better for everyone.

This document provides guidelines and steps for contributing to this project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/TypeScript Style Guide](#javascripttypescript-style-guide)
  - [CSS Style Guide](#css-style-guide)
- [Project Structure](#project-structure)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Make sure you have a GitHub account
2. Fork the repository on GitHub
3. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/gpt-missing-features.git
   cd gpt-missing-features
   ```
4. Create a branch for your work:
   ```bash
   git checkout -b your-branch-name
   ```
5. Set up your development environment as described in the README.md file

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before submitting a bug report:**
- Check the [issues](https://github.com/oferlmntr/gpt-missing-features/issues) to see if the problem has already been reported
- If you're unable to find an open issue addressing the problem, open a new one

**How to submit a good bug report:**
- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include details about your browser, OS, and extension version

### Suggesting Features

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before creating a feature suggestion:**
- Check the [issues](https://github.com/oferlmntr/gpt-missing-features/issues) to see if the enhancement has already been suggested
- If you find a similar feature request, add a comment instead of opening a new one

**How to submit a good feature suggestion:**
- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead and why
- Explain why this enhancement would be useful to most users
- List some other applications where this enhancement exists, if applicable

### Code Contributions

1. Find an issue to work on, or create a new one that you'd like to address
2. Comment on the issue to let others know you're working on it
3. Code your feature or bug fix
4. Write tests that verify your code works as expected
5. Make sure your code follows our style guides
6. Submit a pull request

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure any install or build dependencies are removed before the end of the layer when doing a build
3. Increase the version numbers in any examples files and the README.md to the new version that this PR would represent
4. The PR will be merged once it receives approval from a maintainer

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🔒 `:lock:` when dealing with security
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * ✅ `:white_check_mark:` when adding tests
    * ⬆️ `:arrow_up:` when upgrading dependencies

### JavaScript/TypeScript Style Guide

* Use 2 spaces for indentation
* Use semicolons
* Prefer const over let, and let over var
* Use meaningful variable and function names
* Add comments for complex code sections
* Follow TypeScript best practices

### CSS Style Guide

* Use appropriate naming conventions
* Group related properties together
* Use shorthand properties where possible
* Comment sections of CSS

## Project Structure

Here's a brief overview of the project structure:

```
gpt-missing-features/
├── public/        # Static assets
├── src/           # Source files
│   ├── contentScript.tsx  # Main extension functionality
│   └── extension.css     # Styles
├── scripts/       # Build and utility scripts
└── package.json   # Project dependencies and scripts
```

Thank you for contributing to GPT Power-Ups! 