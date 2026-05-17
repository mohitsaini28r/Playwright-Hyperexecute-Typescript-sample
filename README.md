# Run Playwright TypeScript Tests With HyperExecute on TestMu AI (Formerly LambdaTest)



<p align="center">

  <a href="https://www.testmuai.com/"><img src="https://img.shields.io/badge/MADE%20BY%20TestMu%20AI-000000.svg?style=for-the-badge&labelColor=000" alt="Made by TestMu AI"></a>

  <a href="https://community.testmuai.com/"><img src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&labelColor=000000" alt="Community"></a>

</p>


## Getting Started

TestMu AI (Formerly LambdaTest) is an AI-native, multi-agent quality engineering platform. HyperExecute, part of the TestMu AI (Formerly LambdaTest) platform, enables you to run Playwright TypeScript automation tests at maximum speed with intelligent test orchestration.



- [Sign up on TestMu AI](https://www.testmuai.com/register/) (Formerly LambdaTest).

- Follow the [TestMu AI Documentation](https://www.testmuai.com/support/docs/) for the full setup walkthrough.



## Gitpod



Follow the below steps to run Gitpod button:



1. Click '**Open in Gitpod**' button (You will be redirected to Login/Signup page).

2. Login with TestMu AI (Formerly LambdaTest) credentials and it will be redirected to Gitpod editor in new tab and current tab will show hyperexecute dashboard.



[<img alt="Run in Gitpod" width="200 px" align="center" src="images/Gitpod.svg" />](https://hyperexecute.lambdatest.com/hyperexecute?type=gitpod&framework=Python&frameworkType=PlayWright)



---



# How to run Playwright automation tests on HyperExecute (using TypeScript framework)



* [Pre-requisites](#pre-requisites)

   - [Download HyperExecute CLI](#download-hyperexecute-cli)

   - [Configure Environment Variables](#configure-environment-variables)



* [Auto-Split Execution with TypeScript](#auto-split-execution-with-TypeScript)

   - [Core](#core)

   - [Pre Steps and Dependency Caching](#pre-steps-and-dependency-caching)

   - [Post Steps](#post-steps)

   - [Test Execution](#test-execution-1)



* [Matrix Execution with TypeScript](#matrix-execution-with-TypeScript)

   - [Core](#core-1)

   - [Pre Steps and Dependency Caching](#pre-steps-and-dependency-caching-1)

   - [Post Steps](#post-steps-1)

   - [Test Execution](#test-execution-1)



* [Secrets Management](#secrets-management)



# Pre-requisites



Before using HyperExecute, you have to download HyperExecute CLI corresponding to the host OS. Along with it, you also need to export the environment variables *LT_USERNAME* and *LT_ACCESS_KEY* that are available in the TestMu AI (Formerly LambdaTest) Profile page.



## Download HyperExecute CLI



HyperExecute CLI is the CLI for interacting and running the tests on the HyperExecute Grid. The CLI provides a host of other useful features that accelerate test execution. In order to trigger tests using the CLI, you need to download the HyperExecute CLI binary corresponding to the platform (or OS) from where the tests are triggered:



Also, it is recommended to download the binary in the project's parent directory. Shown below is the location from where you can download the HyperExecute CLI binary:



* Mac: https://downloads.lambdatest.com/hyperexecute/darwin/hyperexecute

* Linux: https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute

* Windows: https://downloads.lambdatest.com/hyperexecute/windows/hyperexecute.exe



## Configure Environment Variables



Before the tests are run, please set the environment variables LT_USERNAME & LT_ACCESS_KEY from the terminal. The account details are available on your TestMu AI (Formerly LambdaTest) Profile page.



For macOS:



```bash

export LT_USERNAME=LT_USERNAME

export LT_ACCESS_KEY=LT_ACCESS_KEY

```



For Linux:



```bash

export LT_USERNAME=LT_USERNAME

export LT_ACCESS_KEY=LT_ACCESS_KEY

```



For Windows:



```bash

set LT_USERNAME=LT_USERNAME

set LT_ACCESS_KEY=LT_ACCESS_KEY

```



## Auto-Split Execution with TypeScript



Auto-split execution mechanism lets you run tests at predefined concurrency and distribute the tests over the available infrastructure. Concurrency can be achieved at different levels - file, module, test suite, test, scenario, etc.



For more information about auto-split execution, check out the [TestMu AI Documentation](https://www.testmuai.com/support/docs/)



### Core



Auto-split YAML file (*autosplit.yaml*) in the repo contains the following configuration:



```yaml

globalTimeout: 90

testSuiteTimeout: 90

testSuiteStep: 90

```



Global timeout, testSuite timeout, and testSuite timeout are set to 90 minutes.

 

The *runson* key determines the platform (or operating system) on which the tests are executed. Here we have set the target OS as Windows.



```yaml

runson: win

```



Auto-split is set to true in the YAML file.



```yaml

 autosplit: true

```



*retryOnFailure* is set to true, instructing HyperExecute to retry failed command(s). The retry operation is carried out till the number of retries mentioned in *maxRetries* are exhausted or the command execution results in a *Pass*. In addition, the concurrency (i.e. number of parallel sessions) is set to 2.



```yaml

retryOnFailure: true

maxRetries: 5

concurrency: 2

```



## Pre Steps and Dependency Caching



To leverage the advantage offered by *Dependency Caching* in HyperExecute, the integrity of *package-lock.json* is checked using the checksum functionality.



```yaml

cacheKey: '{{ checksum "package-lock.json" }}'

```



By default, in TypeScript saves the downloaded packages in the cache so that next time, the package download request can be serviced from the cache (rather than re-downloading it again).



The caching advantage offered by *npm* can be leveraged in HyperExecute, whereby the downloaded packages can be stored (or cached) in a secure server for future executions. The packages available in the cache will only be used if the checksum stage results in a Pass.



The *cacheDirectories* directive is used for specifying the directory where the packages have to be cached. The mentioned directory will override the default directory where TypeScript packages are usually cached. The packages downloaded using npm will be cached in the directory (or location) mentioned under the *cacheDirectories* directive.



In our case, the downloaded packages are cached in the *node_modules* folder in the project's root directory. The folder is automatically created when the packages mentioned in *package-lock.json* are downloaded.  



```yaml

cacheDirectories:

  - node_modules

```



Content under the *pre* directive is the precondition that will run before the tests are executed on the HyperExecute grid. The *--cache-dir* option in *npm install* is used for specifying the cache directory. It is important to note that downloaded cached packages are securely uploaded to a secure cloud before the execution environment is auto-purged after build completion. Please modify *package-lock.json* as per the project requirements.



```yaml

  - yarn add @yarnpkg/core

  - yarn install

```



## Post Steps



The *post* directive contains a list of commands that run as a part of post-test execution. Here, the contents of *autosplit.yaml* are read using the *cat* command as a part of the post step.



```yaml

post:

  - cat autosplit.yaml

```



The *testDiscovery* directive contains the command that gives details of the mode of execution, along with detailing the command that is used for test execution. Here, we are fetching the list of TypeScript files that would be further executed using the *value* passed in the *testRunnerCommand*



```yaml

testDiscovery:

  type: raw

  mode: dynamic

  command: grep -lr 'test' tests



testRunnerCommand: yarn playwright test $test

```



Running the above command on the terminal will give a list of TypeScript files that are located in the Project folder:



* tests/test_1.spec.js



The *testRunnerCommand* contains the command that is used for triggering the test. The output fetched from the *testDiscoverer* command acts as an input to the *testRunner* command.



```yaml

yarn playwright test $test

```



### Test Execution



The CLI option *--config* is used for providing the custom HyperExecute YAML file (i.e. *autosplit.yaml* for Windows, *autosplit.yaml* for Linux and  *autosplit.yaml* for Mac).



#### Execute TypeScript tests using Autosplit mechanism on Windows platform



Run the following command on the terminal to trigger the tests in TypeScript files with HyperExecute platform set to Windows. The *--download-artifacts* option is used to inform HyperExecute to download the artifacts for the job.



```bash

./hyperexecute --download-artifacts --config autosplit.yaml

```



# Matrix Execution with TypeScript



Matrix-based test execution is used for running the same tests across different test (or input) combinations. The Matrix directive in HyperExecute YAML file is a *key:value* pair where value is an array of strings.



Also, the *key:value* pairs are opaque strings for HyperExecute. For more information about matrix multiplexing, check out the [TestMu AI Documentation](https://www.testmuai.com/support/docs/)



### Core



In the current example, matrix YAML file (*hyperexecute.yaml*) in the repo contains the following configuration:



```yaml

globalTimeout: 90

testSuiteTimeout: 90

testSuiteStep: 90

```



Global timeout, testSuite timeout, and testSuite timeout are set to 90 minutes.

 

The target platform is set to Windows. Please set the *[runson]* key to *[mac]* if the tests have to be executed on the macOS platform.



```yaml

runson: win

```



TypeScript files in the 'tests' folder contain the test suites run on the HyperExecute grid. In the example, the tests in the files **.spec.js* run in parallel using the specified input combinations.



```yaml

matrix:

  os: [win]

  specs: ["tests/test_2.spec.js", "tests/test_1.spec.js"]

```



The *testSuites* object contains a list of commands (that can be presented in an array). In the current YAML file, commands for executing the tests are put in an array (with a '-' preceding each item). The TypeScript command is used to run tests in *.ts* files. The files are mentioned as an array to the *files* key that is a part of the matrix.



```yaml

testSuites:

  - yarn playwright test $specs

```



### Pre Steps and Dependency Caching



Dependency caching is enabled in the YAML file to ensure that the package dependencies are not downloaded in subsequent runs. The first step is to set the Key used to cache directories.



```yaml

cacheKey: '{{ checksum "package-lock.json" }}'

```



Set the array of files & directories to be cached. In the example, all the packages will be cached in the *node_modules* directory.



```yaml

cacheDirectories:

  - node_modules

```



Steps (or commands) that must run before the test execution are listed in the *pre* run step. In the example, the packages listed in *package-lock.json* are installed using the *npm install* command.



The *--cache-dir* option is used for specifying the location of the directory used for caching the packages (i.e. *CacheDir*). It is important to note that downloaded cached packages are securely uploaded to a secure cloud before the execution environment is auto-purged after build completion. Please modify *package-lock.json* as per the project requirements.



```yaml

pre:

  - yarn add @yarnpkg/core

  - yarn install

```



### Post Steps



Steps (or commands) that need to run after the test execution are listed in the *post* step. In the example, we *cat* the contents of *hyperexecute.yaml*



## Test Execution



The CLI option *--config* is used for providing the custom HyperExecute YAML file (i.e. *hyperexecute.yaml* or *hyperexecute.yaml* or *hyperexecute.yaml*).



#### Execute TypeScript tests using Matrix mechanism on Windows platform



Run the following command on the terminal to trigger the tests in TypeScript files with HyperExecute platform set to Windows. The *--download-artifacts* option is used to inform HyperExecute to download the artifacts for the job.



```bash

./hyperexecute --download-artifacts --config hyperexecute.yaml

```



#### Execute TypeScript tests using Matrix mechanism on Linux platform



Run the following command on the terminal to trigger the tests in TypeScript files with HyperExecute platform set to Linux. The *--download-artifacts* option is used to inform HyperExecute to download the artifacts for the job.



```bash

./hyperexecute --download-artifacts --config hyperexecute_matrix.yaml

```



#### Execute TypeScript tests using Matrix mechanism on Mac platform



Run the following command on the terminal to trigger the tests in TypeScript files with HyperExecute platform set to MAC. The *--download-artifacts* option is used to inform HyperExecute to download the artifacts for the job.



```bash

./hyperexecute --download-artifacts --config hyperexecute.yaml

```



## Secrets Management



In case you want to use any secret keys in the YAML file, the same can be set by clicking on the *Secrets* button the dashboard.



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



## LambdaTest is Now TestMu AI



On **January 12, 2026**, [LambdaTest evolved to TestMu AI](https://www.testmuai.com/lambdatest-is-now-testmuai/), the world's first fully autonomous **Agentic AI Quality Engineering Platform**.



Same team. Same infrastructure. Same customer accounts. All existing LambdaTest logins, scripts, capabilities, and integrations continue to work without change.



ð Find the new home for [LambdaTest](https://www.testmuai.com).



### How LambdaTest Evolved into TestMu AI



In 2017, we launched LambdaTest with a simple mission: make testing fast, reliable, and accessible. As LambdaTest grew, we expanded into Test Intelligence, Visual Regression Testing, Accessibility Testing, API Testing, and Performance Testing, covering the full depth of the testing lifecycle.



As software development entered the AI era, testing had to evolve, too. We rebuilt the architecture to be AI-native from the ground up, with autonomous agents that **plan, author, execute, analyze, and optimize tests** while keeping humans in the loop. The platform integrates with your repos, CI, IDEs, and terminals, continuously learning from every code change and development signal.



That evolution earned a new name: **TestMu AI**, built for an AI-first future of quality engineering. TestMu is not a new name for us. It is the name of our annual community conference, which has brought together 100,000+ quality engineers to discuss how AI would reshape testing, long before that became an industry norm. 



What started as a high-performance cloud testing platform has transformed into an AI-native, multi-agent system powering a connected, end-to-end quality layer. That evolution defined a new identity: LambdaTest evolved into TestMu AI, built for an AI-first future of quality engineering.



## Support



Got a question? Email [support@testmuai.com](mailto:support@testmuai.com) or chat with us 24x7 from our chat portal.

