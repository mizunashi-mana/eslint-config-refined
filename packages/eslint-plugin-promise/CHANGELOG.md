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

- Initial package scaffold
- Implement 9 core promise rules
- Additional rules: no-callback-in-promise, no-return-in-finally, prefer-await-to-then
- Fix no-multiple-resolved selectors for ESLint v10
- Enable no-unsafe-type-assertion / naming-convention
- Apply self-linting
- Migrate build tool to tsdown
- Eliminate no-restricted-imports overrides with path aliases
