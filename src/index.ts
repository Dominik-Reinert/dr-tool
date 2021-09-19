#! /usr/bin/env node

import { Command } from "commander";

const program = new Command();
program.version("0.0.1");

program
  .command("list")
  .description("list some todos")
  .action((hello: string) => {
    console.info(`hello ${hello}!`);
  });

function print(name: string): void {
  console.info(`hello ${name}!`);
}

function initPrint(): void {
  program
    .command("print")
    .argument("<hello>", "name to say hello to")
    .description("Print something to the console")
    .action(print);
}

initPrint();

program.parse();
