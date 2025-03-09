module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',  // This allows Jest to resolve 'src/' paths
    },
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest',  // Ensure TypeScript files are processed by ts-jest
    },
    rootDir: './',  // Root directory for Jest
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],  // Ignore node_modules and dist folders
  };
  