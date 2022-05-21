const fs = require("fs")
const path = require("path")
const { pathsToModuleNameMapper } = require("ts-jest")

const testTsconfigFile = path.join(process.cwd(), "tsconfig.json")
const tsConfigFile = fs.existsSync(testTsconfigFile) ? testTsconfigFile : undefined
const { compilerOptions } = tsConfigFile ? JSON.parse(fs.readFileSync(testTsconfigFile)) : {}

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"],
  globals: {
    "ts-jest": {
      tsconfig: tsConfigFile,
      diagnostics: false,
    },
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "tests/jest.setup.ts")],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions?.paths ?? [], { prefix: "<rootDir>/" }),
}
