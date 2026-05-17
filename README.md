# Run Playwright TypeScript Tests on HyperExecute with TestMu AI (Formerly LambdaTest)

<p align="center">
  <a href="https://www.testmuai.com/"><img src="https://img.shields.io/badge/MADE%20BY%20TestMu%20AI-000000.svg?style=for-the-badge&labelColor=000" alt="Made by TestMu AI"></a>
  <a href="https://www.npmjs.com/package/@playwright/test"><img src="https://img.shields.io/npm/v/@playwright/test.svg?style=for-the-badge&labelColor=000000" alt="Playwright version"></a>
  <a href="https://community.testmuai.com/"><img src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&labelColor=000000" alt="Community"></a>
</p>

## Getting Started

[TestMu AI](https://www.testmuai.com/) (Formerly LambdaTest) is the world's first full-stack AI Agentic Quality Engineering platform that empowers teams to test intelligently, smarter, and ship faster. Built for scale, it offers a full-stack testing cloud with 10K+ real devices and 3,000+ browsers. With AI-native test management, MCP servers, and agent-based automation, TestMu AI supports Selenium, Appium, Playwright, and all major frameworks.

With TestMu AI (Formerly LambdaTest), you can run Playwright TypeScript automation tests at maximum speed using HyperExecute's intelligent test orchestration.

- [Sign up on TestMu AI](https://www.testmuai.com/register/) (Formerly LambdaTest).
- Follow the [TestMu AI documentation](https://www.testmuai.com/support/docs/) (Formerly LambdaTest) for the full setup walkthrough.

## Gitpod

Follow the below steps to run Gitpod button:

1. Click '**Open in Gitpod**' button (You will be redirected to Login/Signup page).
2. Login with TestMu AI (Formerly LambdaTest) credentials and it will be redirected to Gitpod editor in new tab and current tab will show hyperexecute dashboard.

[<img alt="Run in Gitpod" width="200 px" align="center" src="images/Gitpod.svg" />](https://hyperexecute.lambdatest.com/hyperexecute?type=gitpod&framework=Python&frameworkType=PlayWright)

---

## Table of Contents

* [Prerequisites](#prerequisites)
   - [Download HyperExecute CLI](#download-hyperexecute-cli)
   - [Configure Environment Variables](#configure-environment-variables)

* [Auto-Split Execution with TypeScript](#auto-split-execution-with-typescript)
   - [Core](#core)
   - [Pre Steps and Dependency Caching](#pre-steps-and-dependency-caching)
   - [Post Steps](#post-steps)
   - [Test Execution](#test-execution)

* [Matrix Execution with TypeScript](#matrix-execution-with-typescript)
   - [Core](#core-1)
   - [Pre Steps and Dependency Caching](#pre-steps-and-dependency-caching-1)
   - [Post Steps](#post-steps-1)
   - [Test Execution](#test-execution-1)

* [Secrets Management](#secrets-management)

### Prerequisites

Before using HyperExecute, you have to download the HyperExecute CLI corresponding to the host OS. Along with it, you also need to export the environment variables `LT_USERNAME` and `LT_ACCESS_KEY` that are available in the TestMu AI (Formerly LambdaTest) Profile page.

#### Download HyperExecute CLI

HyperExecute CLI is the CLI for interacting and running the tests on the HyperExecute Grid. The CLI provides a host of other useful features that accelerate test execution. In order to trigger tests using the CLI, you need to download the HyperExecute CLI binary corresponding to the platform (or OS) from where the tests are triggered:

It is recommended to download the binary in the project's parent directory. Shown below is the location from where you can download the HyperExecute CLI binary:

* Mac: https://downloads.lambdatest.com/hyperexecute/darwin/hyperexecute
* Linux: https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute
* Windows: https://downloads.lambdatest.com/hyperexecute/windows/hyperexecute.exe

### Setup

Set your credentials as environment variables.

**macOS / Linux:**

```bash
export LT_USERNAME="YOUR_USERNAME"
export LT_ACCESS_KEY="YOUR_ACCESS_KEY"
```

**Windows:**

```bash
set LT_USERNAME="YOUR_USERNAME"
set LT_ACCESS_KEY="YOUR_ACCESS_KEY"
```

## Auto-Split Execution with TypeScript

Auto-split execution lets you run tests at predefined concurrency and distribute them over the available infrastructure. Concurrency can be achieved at different levels — file, module, test suite, test, scenario, etc.

For more information about auto-split execution, check out the [TestMu AI documentation](https://www.testmuai.com/support/docs/).

### Core

Auto-split YAML file (`autosplit.yaml`) in the repo contains the following configuration:

```yaml
globalTimeout: 90
testSuiteTimeout: 90
testSuiteStep: 90
```

Global timeout, testSuite timeout, and testSuite step timeout are set to 90 minutes.

The `runson` key determines the platform (or operating system) on which the tests are executed. Here it is set to Windows:

```yaml
runson: win
```

Auto-split is set to true in the YAML file:

```yaml
autosplit: true
```

`retryOnFailure` is set to true, instructing HyperExecute to retry failed command(s). The concurrency (number of parallel sessions) is set to 2:

```yaml
retryOnFailure: true
maxRetries: 5
concurrency: 2
```

### Pre Steps and Dependency Caching

To leverage the advantage offered by Dependency Caching in HyperExecute, the integrity of `package-lock.json` is checked using the checksum functionality:

```yaml
cacheKey: '{{ checksum "package-lock.json" }}'
```

The `cacheDirectories` directive is used for specifying the directory where the packages have to be cached:

```yaml
cacheDirectories:
  - node_modules
```

Content under the `pre` directive is the precondition that will run before the tests are executed on the HyperExecute grid:

```yaml
pre:
  - yarn add @yarnpkg/core
  - yarn install
```

### Post Steps

```yaml
post:
  - cat autosplit.yaml
```

### Test Discovery

```yaml
testDiscovery:
  type: raw
  mode: dynamic
  command: grep -lr 'test' tests

testRunnerCommand: yarn playwright test $test
```

Running the above command on the terminal will give a list of TypeScript files located in the project folder:

* tests/test_1.spec.js

The `testRunnerCommand` contains the command that is used for triggering the test:

```yaml
yarn playwright test $test
```

### Run tests

#### Auto-split on Windows

```bash
./hyperexecute --download-artifacts --config autosplit.yaml
```

View results on your TestMu AI dashboard.

## Matrix Execution with TypeScript

Matrix-based test execution is used for running the same tests across different input combinations. The Matrix directive in HyperExecute YAML file is a key:value pair where value is an array of strings.

For more information about matrix multiplexing, check out the [TestMu AI documentation](https://www.testmuai.com/support/docs/).

### Core

Matrix YAML file (`hyperexecute.yaml`) in the repo contains the following configuration:

```yaml
globalTimeout: 90
testSuiteTimeout: 90
testSuiteStep: 90
```

```yaml
runson: win
```

```yaml
matrix:
  os: [win]
  specs: ["tests/test_2.spec.js", "tests/test_1.spec.js"]
```

```yaml
testSuites:
  - yarn playwright test $specs
```

### Pre Steps and Dependency Caching

```yaml
cacheKey: '{{ checksum "package-lock.json" }}'
```

```yaml
cacheDirectories:
  - node_modules
```

```yaml
pre:
  - yarn add @yarnpkg/core
  - yarn install
```

### Post Steps

Steps that need to run after the test execution are listed in the `post` step. In the example, we `cat` the contents of `hyperexecute.yaml`.

### Run tests

#### Matrix on Windows

```bash
./hyperexecute --download-artifacts --config hyperexecute.yaml
```

#### Matrix on Linux

```bash
./hyperexecute --download-artifacts --config hyperexecute_matrix.yaml
```

#### Matrix on Mac

```bash
./hyperexecute --download-artifacts --config hyperexecute.yaml
```

View results on your TestMu AI dashboard.

## Secrets Management

In case you want to use any secret keys in the YAML file, the same can be set by clicking on the *Secrets* button on the dashboard.

<img width="703" alt="pytest_secrets_key_1" src="https://user-images.githubusercontent.com/1688653/152540968-90e4e8bc-3eb4-4259-856b-5e513cbd19b5.png">

Now create a *secret* key that you can use in the HyperExecute YAML file.

<img width="359" alt="secrets_management_1" src="https://user-images.githubusercontent.com/1688653/153250877-e58445d1-2735-409a-970d-14253991c69e.png">

All you need to do is create an environment variable that uses the secret key:

```yaml
env:
  PAT: ${{ .secrets.testKey }}
```

## License

Licensed under the [MIT license](LICENSE).

## Contributions

Contributions are welcome. Open an issue to discuss your idea before submitting a pull request. When reporting bugs, include your Node.js version, OS, and Playwright version.

## TestMu AI (Formerly LambdaTest) Community

Connect with testers and developers in the [TestMu AI Community](https://community.testmuai.com/). Ask questions, share what you are building, and discuss best practices in test automation and DevOps.

## TestMu AI (Formerly LambdaTest) Certifications

Earn free [TestMu AI Certifications](https://www.testmuai.com/certifications/) for testers, developers, and QA engineers. Validate your skills in Selenium, Cypress, Playwright, Appium, Espresso and more. Industry-recognized, shareable on LinkedIn, and built by practitioners, not marketers.

## Learning Resources by TestMu AI (Formerly LambdaTest)

Learn modern testing through tutorials, guides, videos, and weekly updates:

* [TestMu AI Blog](https://www.testmuai.com/blog/)
* [TestMu AI Learning Hub](https://www.testmuai.com/learning-hub/)
* [TestMu AI on YouTube](https://www.youtube.com/@TestMuAI)
* [TestMu AI Newsletter](https://www.testmuai.com/newsletter/)

## LambdaTest is Now TestMu AI

On **January 12, 2026**, [LambdaTest evolved to TestMu AI](https://www.testmuai.com/lambdatest-is-now-testmuai/), the world's first fully autonomous **Agentic AI Quality Engineering Platform**.

Same team. Same infrastructure. Same customer accounts. All existing LambdaTest logins, scripts, capabilities, and integrations continue to work without change.

👉 Find the new home for [LambdaTest](https://www.testmuai.com).

### How LambdaTest Evolved into TestMu AI

In 2017, we launched LambdaTest with a simple mission: make testing fast, reliable, and accessible. As LambdaTest grew, we expanded into Test Intelligence, Visual Regression Testing, Accessibility Testing, API Testing, and Performance Testing, covering the full depth of the testing lifecycle.

As software development entered the AI era, testing had to evolve, too. We rebuilt the architecture to be AI-native from the ground up, with autonomous agents that **plan, author, execute, analyze, and optimize tests** while keeping humans in the loop. The platform integrates with your repos, CI, IDEs, and terminals, continuously learning from every code change and development signal.

That evolution earned a new name: **TestMu AI**, built for an AI-first future of quality engineering. TestMu is not a new name for us. It is the name of our annual community conference, which has brought together 100,000+ quality engineers to discuss how AI would reshape testing, long before that became an industry norm.

What started as a high-performance cloud testing platform has transformed into an AI-native, multi-agent system powering a connected, end-to-end quality layer. That evolution defined a new identity: LambdaTest evolved into TestMu AI, built for an AI-first future of quality engineering.

## Support

Got a question? Email [support@testmuai.com](mailto:support@testmuai.com) or chat with us 24x7 from our chat portal.
