import * as fs from "fs"
import * as path from "path"
import type { Config } from "@jest/types"
import { pathsToModuleNameMapper, RawCompilerOptions } from "ts-jest"

const testTsconfigFile = path.join(process.cwd(), "tsconfig.json")
const tsConfigFile = fs.existsSync(testTsconfigFile) ? testTsconfigFile : undefined
const tsConfig = tsConfigFile ? JSON.parse(fs.readFileSync(testTsconfigFile, { encoding: "utf-8" })) : {}
const compilerOptions: RawCompilerOptions = tsConfig.compilerOptions ?? {}

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"],
  transform: {
    "\\.ts$": ["ts-jest", {
      tsconfig: tsConfigFile,
      diagnostics: false,
    }],
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "tests/jest.setup.ts")],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, { prefix: "<rootDir>/" }),
}

export default config
