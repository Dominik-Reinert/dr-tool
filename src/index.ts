#! /usr/bin/env node

import { Command } from "commander";
import { initCreateProject } from "./create_project/create_project";

const program = new Command();
program.version("0.0.1");

initCreateProject(program);

program.parse();
