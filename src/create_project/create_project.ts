import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import * as readline from "readline";

enum Templates {
  "react" = "react",
}

export function initCreateProject(project: Command): void {
  project
    .command("create-project")
    .description("Leads you through the creation of a new project")
    .action(createProject);
}

async function createProject(): Promise<void> {
  const rl: readline.Interface = getReadline();
  const directory: string = await inputDirectory(rl);
  const stringTemplate: string = await inputTemplate(rl);
  await verifyInputDirectory(rl, directory);
  const template = getTemplateFromString(stringTemplate);
  const repository = getTemplateRepository(template);
  rl.close();
  console.log(
    chalk.blue(
      `got inputs: directory: ${directory}, template: ${stringTemplate}`
    )
  );
  console.log(
    chalk.blue(
      `Continuing with checking out the template repository to the directory...`
    )
  );
  await cloneTemplate(directory, repository);
}

function getReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function inputDirectory(rl: readline.Interface): Promise<string> {
  return wrapQuestionInput(rl, "Enter target directory: ");
}

function inputTemplate(rl: readline.Interface): Promise<string> {
  return wrapQuestionInput(rl, `Enter project template (react): `);
}

function wrapQuestionInput(
  rl: readline.Interface,
  question: string
): Promise<string> {
  let resolve: (result: string) => void;
  const result = new Promise<string>(
    (res) => (resolve = res as (result: string) => void)
  );
  rl.question(question, (input) => resolve(input));
  return result;
}

async function verifyInputDirectory(
  rl: readline.Interface,
  directory: string
): Promise<void> {
  const directoryExists = existsSync(directory);
  if (!directoryExists) {
    await handleDirectoryNotExistant(rl, directory);
  }
}

async function handleDirectoryNotExistant(
  rl: readline.Interface,
  directory: string
): Promise<void> {
  const shouldCreate = await checkIfDirectoryShouldBeCreated(rl);
  if (shouldCreate) {
    mkdirSync(directory, { recursive: true });
  } else {
    throw new Error(
      `Directory does not exist and should not be created - exiting!`
    );
  }
}

async function checkIfDirectoryShouldBeCreated(
  rl: readline.Interface
): Promise<boolean> {
  const shouldCreateInput: string = await inputShouldCreateDirectory(rl);
  return shouldCreateInput === "y";
}

function inputShouldCreateDirectory(rl: readline.Interface): Promise<string> {
  return wrapQuestionInput(
    rl,
    `Directory does not exist. Should create? (y|n) `
  );
}

function getTemplateFromString(template: string): Templates {
  switch (template) {
    case Templates.react:
      return Templates.react;
    default:
      throw new Error(`Template '${template}' is invalid!`);
  }
}

function getTemplateRepository(template: Templates): string {
  switch (template) {
    case Templates.react:
      return "https://github.com/Dominik-Reinert/react-template";
    default:
      throw new Error(`Template '${template}' has no repository!`);
  }
}

async function cloneTemplate(
  directory: string,
  repository: string
): Promise<void> {
  execSync(`git clone ${repository} ${directory}`, {
    stdio: "inherit",
  });
}
