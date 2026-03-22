# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-03-22

### Changed

- Promote to stable release (no functional changes from 0.2.0)

## [0.2.0] - 2026-03-22

### Changed

- Add npm publish metadata to package.json
- Move npm badges to README

## [0.1.0] - 2026-03-21

### Added

- Monorepo foundation with npm workspaces
- Core ESLint configurations (globals, js, ts, stylistic, imports, comments, node)
- React ruleset (eslint-plugin-react-x)
- Playwright / Storybook rulesets
- Integration of eslint-plugin-promise
- Stylistic customization options
- Rule expansion based on gap analysis with eslint-config-love
- Snapshot tests
- Migrate build tool to tsdown
- Eliminate no-restricted-imports overrides with path aliases
- Apply self-linting
