# Semantic HTML Checker

![Version](https://img.shields.io/badge/version-0.2.0-blue)  
![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/VanessaAristizabal.semantic-checker)  
![License](https://img.shields.io/badge/license-MIT-green)  
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen)

**Semantic HTML Checker** is a Visual Studio Code extension that helps you verify and fix semantic and accessibility issues in your HTML documents based on [WCAG 2.2](https://www.w3.org/TR/WCAG22/) guidelines.

## Features

All issues are detected based on a custom set of accessibility validation rules created in accordance with the [WCAG 2.2](https://www.w3.org/TR/WCAG22/) standards. These rules are designed to identify common semantic and accessibility problems in HTML content.

- Detect missing `alt` attributes in images  
- Identify empty or non-descriptive links and buttons  
- Detect missing or incorrect ARIA attributes  
- Validate semantic structure of tables and sections  
- Breakdown of issues by WCAG conformance level (A, AA, AAA)  
- Save reports in JSON format (`diagnostics/semantic-checker-log.json`)  
- Auto-fix simple issues like missing `alt`, `title`, or `aria-label` attributes (experimental)

## Installation

1. Open **Visual Studio Code**
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for **Semantic HTML Checker**
4. Click **Install**

## Usage

### ✅ Check Semantic HTML

You can run the HTML accessibility check by:

- Opening the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Running the command: **Verify Semantic HTML**
- Or using the keyboard shortcut: `Ctrl+Alt+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)

This command:
- Highlights issues directly in your HTML code
- Shows a breakdown of issues by WCAG level in the output console
- Saves a full accessibility report to `diagnostics/semantic-checker-log.json`

### 🔧 Fix Semantic HTML (Experimental)

You can attempt to fix common issues by:

- Opening the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Running the command: **Fix Semantic HTML with Copilot**
- Or using the keyboard shortcut: `Ctrl+Alt+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)

This command will:
- Prompt you to confirm fixing simple issues (e.g. missing `alt`, `title`, or `aria-label`)
- Attempt to apply fixes directly in the active document

> **Note:** Only a subset of errors can be automatically fixed. Manual review is always recommended.

## Commands

| Command                              | Description                                              | Shortcut                          |
|--------------------------------------|----------------------------------------------------------|-----------------------------------|
| `Verify Semantic HTML`               | Run HTML accessibility and semantic check                | `Ctrl+Alt+H` / `Cmd+Shift+H`      |
| `Fix Semantic HTML with Copilot`     | Attempt to auto-fix common issues using Copilot          | `Ctrl+Alt+F` / `Cmd+Shift+F`      |

## Contributing

This extension was developed with a focus on the [WCAG 2.2](https://www.w3.org/TR/WCAG22/) accessibility guidelines. The validation rules are custom-built to target common HTML accessibility pitfalls and provide actionable recommendations.

If you'd like to contribute:

- Propose or add new accessibility validation rules aligned with WCAG 2.2
- Help refine the auto-fix logic for additional scenarios
- Report issues or suggest improvements via the [GitHub repository](https://github.com/vanessamarely/vscode-checksemantic)

We welcome contributions from the accessibility, frontend, and open source communities!

## License

MIT

---

For more details, visit the [GitHub repository](https://github.com/vanessamarely/vscode-checksemantic).
