import { defineConfig } from 'eslint/config';
import reactXPlugin from 'eslint-plugin-react-x';

export function buildReactConfig() {
  return defineConfig([
    reactXPlugin.configs['recommended-typescript'],
    {
      rules: {
        'react-x/exhaustive-deps': 'error',
        'react-x/no-array-index-key': 'error',
        'react-x/no-clone-element': 'error',
        'react-x/no-context-provider': 'error',
        'react-x/no-forward-ref': 'error',
        'react-x/no-use-context': 'error',
        'react-x/no-children-count': 'error',
        'react-x/no-children-for-each': 'error',
        'react-x/no-children-map': 'error',
        'react-x/no-children-only': 'error',
        'react-x/no-children-to-array': 'error',
        'react-x/no-set-state-in-component-did-mount': 'error',
        'react-x/no-set-state-in-component-did-update': 'error',
        'react-x/no-set-state-in-component-will-update': 'error',
        'react-x/no-unsafe-component-will-mount': 'error',
        'react-x/no-unsafe-component-will-receive-props': 'error',
        'react-x/no-unsafe-component-will-update': 'error',
        'react-x/no-unused-class-component-members': 'error',
        'react-x/no-unnecessary-use-prefix': 'error',
        'react-x/purity': 'error',
        'react-x/set-state-in-effect': 'error',
        'react-x/use-state': 'error',
      },
    },
  ]);
}
