import chalk from "chalk";
import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import * as readline from "readline";

export function initCreateProject(project: Command): void {
  project
    .command("create-project")
    .description("Leads you through the creation of a new project")
    .action(createProject);
}

async function createProject(): Promise<void> {
  const rl: readline.Interface = getReadline();
  const directory: string = await inputDirectory(rl);
  const template: string = await inputTemplate(rl);
  await verifyInputDirectory(rl, directory);
  rl.close();
  console.log(
    chalk.blue(`got inputs: directory: ${directory}, template: ${template}`)
  );
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
