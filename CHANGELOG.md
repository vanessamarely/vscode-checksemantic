# Changelog

All notable changes to this project will be documented in this file.

## \[0.2.0] - 2025-05-19

### Added

* Command: `Verify Semantic HTML` (`Ctrl+Alt+H` on Windows/Linux or `Cmd+Option+H` on macOS) to detect WCAG 2.2 issues.
* Command: `Fix Semantic HTML with Copilot` (`Ctrl+Alt+F` on Windows/Linux or `Cmd+Option+F` on macOS) to auto-correct common accessibility issues.
* Basic auto-fix support for rules like:

  * R1: `<img>` missing `alt`
  * R7: `<button>` missing accessible label
  * R10: `<iframe>` missing `title`
* Diagnostic logging to console.
* JSON report output (`semantic-checker-log.json`) including issue breakdown by WCAG level.
* Keybinding support for both commands.
* `README.md` updated with full documentation and contribution guidelines.
* `CONTRIBUTING.md` file added.

### Changed

* Improved activation behavior using command-based activation instead of explicit `activationEvents`.
* Enhanced error messaging for unsupported or unfixable issues.

### Notes

* Fixing is limited to basic patterns based on regex matches in `rules.js`. Future versions may expand to cover more rule IDs.

---

## \[0.1.0] - 2025-05-10

### Initial release

* Basic command to check semantic accessibility issues in HTML documents.
* Rule set based on WCAG 2.2 conformance levels A, AA, and AAA.
* VS Code diagnostics for issues found.
