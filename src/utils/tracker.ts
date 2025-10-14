import chalk from "chalk";

/**
 * Step status for tracking CLI operations
 */
type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

interface Step {
  key: string;
  label: string;
  status: StepStatus;
  detail?: string;
}

/**
 * StepTracker manages and displays progress of CLI operations
 */
export class StepTracker {
  private steps: Step[] = [];
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  /**
   * Add a new step
   */
  add(key: string, label: string): void {
    this.steps.push({ key, label, status: "pending" });
    this.render();
  }

  /**
   * Start a step (mark as running)
   */
  start(key: string, detail?: string): void {
    this.updateStep(key, "running", detail);
  }

  /**
   * Complete a step successfully
   */
  complete(key: string, detail?: string): void {
    this.updateStep(key, "done", detail);
  }

  /**
   * Mark a step as errored
   */
  error(key: string, detail?: string): void {
    this.updateStep(key, "error", detail);
  }

  /**
   * Skip a step
   */
  skip(key: string, detail?: string): void {
    this.updateStep(key, "skipped", detail);
  }

  /**
   * Update step status
   */
  private updateStep(key: string, status: StepStatus, detail?: string): void {
    const step = this.steps.find((s) => s.key === key);
    if (step) {
      step.status = status;
      step.detail = detail;
      this.render();
    }
  }

  /**
   * Render the current state
   */
  render(): void {
    // Clear previous output (move cursor up and clear lines)
    if (this.steps.length > 0 && this.steps[0].status !== "pending") {
      process.stdout.write(`\x1b[${this.steps.length + 2}A`);
    }

    console.log(chalk.cyan(`\n${this.title}\n`));

    for (const step of this.steps) {
      const symbol = this.getSymbol(step.status);
      const label = step.status === "pending" 
        ? chalk.gray(step.label) 
        : chalk.white(step.label);
      const detail = step.detail ? chalk.gray(` (${step.detail})`) : "";
      
      console.log(`${symbol} ${label}${detail}`);
    }
  }

  /**
   * Get symbol for step status
   */
  private getSymbol(status: StepStatus): string {
    switch (status) {
      case "done":
        return chalk.green("●");
      case "pending":
        return chalk.gray("○");
      case "running":
        return chalk.cyan("○");
      case "error":
        return chalk.red("●");
      case "skipped":
        return chalk.yellow("○");
      default:
        return " ";
    }
  }
}
