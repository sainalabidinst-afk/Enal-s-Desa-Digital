export interface TSConfig {
  extends?: string | string[];
  include?: string[];
  exclude?: string[];
  compilerOptions?: {
    target?: string;
    module?: string;
    lib?: string[];
    outDir?: string;
    rootDir?: string;
    strict?: boolean;
    esModuleInterop?: boolean;
    skipLibCheck?: boolean;
    forceConsistentCasingInFileNames?: boolean;
    moduleResolution?: string;
    resolveJsonModule?: boolean;
    jsx?: string;
    baseUrl?: string;
    paths?: Record<string, string[]>;
    declaration?: boolean;
    declarationMap?: boolean;
    sourceMap?: boolean;
    composite?: boolean;
    [key: string]: any;
  };
}

export const baseConfig: TSConfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022'],
    module: 'ESNext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    allowJs: true,
    checkJs: false,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    skipLibCheck: true,
    baseUrl: '.',
  },
  exclude: ['node_modules'],
};

export const nextjsConfig: TSConfig = {
  ...baseConfig,
  compilerOptions: {
    ...baseConfig.compilerOptions,
    jsx: 'preserve',
    paths: {
      '@/*': ['./src/*'],
    },
  },
  include: ['**/*.ts', '**/*.tsx'],
};

export const reactNativeConfig: TSConfig = {
  ...baseConfig,
  compilerOptions: {
    ...baseConfig.compilerOptions,
    jsx: 'react-native',
    paths: {
      '@/*': ['./src/*'],
    },
  },
  include: ['**/*.ts', '**/*.tsx'],
};

export const nestjsConfig: TSConfig = {
  ...baseConfig,
  compilerOptions: {
    ...baseConfig.compilerOptions,
    module: 'CommonJS',
    moduleResolution: 'node',
    paths: {
      '@/*': ['./src/*'],
    },
    outDir: './dist',
    rootDir: './src',
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    removeComments: false,
  },
  include: ['src/**/*'],
};
