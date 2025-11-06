import chalk from "chalk"; 

class Logger {
  static #getTimestamp() {
    return new Date().toISOString().replace("T", " ").split(".")[0];
  }

  static #format(level, icon, colorFn, moreInfo, message) {
    const timestamp = this.#getTimestamp();
    // Convert the array to [value1][value2][value3] format
    const moreInfoStr = Array.isArray(moreInfo)
      ? moreInfo.map(info => `[${info}]`).join("")
      : `[${moreInfo}]`;

    console.log(
      `${colorFn(`[${icon} ${level}]`)} [${timestamp}]${moreInfoStr}: ${message}`
    );
  }

  static success(moreInfo, message) {
    this.#format("SUCCESS", "✅", chalk.green, moreInfo, message);
  }

  static error(moreInfo, message) {
    this.#format("ERROR", "❌", chalk.red, moreInfo, message);
  }

  static info(moreInfo, message) {
    this.#format("INFO", "ℹ️", chalk.cyan, moreInfo, message);
  }

  static warn(moreInfo, message) {
    this.#format("WARN", "⚠️", chalk.yellow, moreInfo, message);
  }

  static debug(moreInfo, message) {
    this.#format("DEBUG", "🐛", chalk.magenta, moreInfo, message);
  }
}

export default Logger;