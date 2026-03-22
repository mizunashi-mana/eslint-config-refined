{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [];

  # https://devenv.sh/languages/
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;

  # https://devenv.sh/scripts/
  scripts.lint-all.exec = ''
    prek run --all-files
  '';
  scripts.cc-edit-lint-hook.exec = ''
    "$DEVENV_ROOT/scripts/cc-edit-lint-hook.mjs"
  '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks.actionlint = {
    enable = true;
    entry = "actionlint";
    files = "^.github/workflows/.*\.ya?ml$";
  };
  git-hooks.hooks.npx-eslint-pkg-root= {
    enable = true;
    entry = "npx eslint --cache --fix";
    files = "^(?!packages/).*\.[cm]?(js|ts)x?$";
  };
  git-hooks.hooks.npx-eslint-pkg-eslint-config-refined = {
    enable = true;
    entry = "./scripts/run-script.mjs --cwd packages/eslint-config-refined -- npx eslint --cache --fix FILES";
    files = "^packages/eslint-config-refined/.*\.[cm]?(js|ts)x?$";
  };
  git-hooks.hooks.npx-eslint-pkg-eslint-plugin-promise = {
    enable = true;
    entry = "./scripts/run-script.mjs --cwd packages/eslint-plugin-promise -- npx eslint --cache --fix FILES";
    files = "^packages/eslint-plugin-promise/.*\.[cm]?(js|ts)x?$";
  };

  # See full reference at https://devenv.sh/reference/options/
}
