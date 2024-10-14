import chalk from 'chalk';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

// 日志级别及其颜色配置
const logLevels = {
    info: { color: chalk.blue, level: 1 },
    warn: { color: chalk.yellow, level: 2 },
    error: { color: chalk.red, level: 3 },
    debug: { color: chalk.green, level: 4 }
};

// 当前日志级别（可以设置为 'info', 'warn', 'error', 'debug'）
let currentLogLevel = 'debug';  // 默认设置为 'debug'，输出所有级别的日志

// 创建日志文件的写入流
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logFile = path.join(__dirname, 'app.log');
const writeStream = fs.createWriteStream(logFile, { flags: 'a' });  // 'a' 表示追加模式

// 日志系统主类
class Logger {
    constructor(level = 'debug') {
        this.setLogLevel(level);
    }

    setLogLevel(level) {
        if (logLevels[level]) {
            currentLogLevel = level;
        } else {
            console.warn(`Unknown log level: ${level}`);
        }
    }

    log(level, message) {
        if (logLevels[level].level <= logLevels[currentLogLevel].level) {
            const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
            const coloredMessage = logLevels[level].color(`[${timestamp}] [${level.toUpperCase()}] ${message}`);

            // 输出到控制台
            console.log(coloredMessage);

            // 也可以写入日志文件
            this.writeToFile(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
        }
    }

    info(message) {
        this.log('info', message);
    }

    warn(message) {
        this.log('warn', message);
    }

    error(message) {
        this.log('error', message);
    }

    debug(message) {
        this.log('debug', message);
    }

    writeToFile(message) {
        writeStream.write(message + '\n');
    }

    // 日志系统关闭时清理资源
    close() {
        writeStream.end();
    }
}

export default new Logger('error')