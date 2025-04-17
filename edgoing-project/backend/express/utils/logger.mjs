/**
 * 简单的日志工具
 * 
 * 提供基本的日志记录功能，包括时间戳和日志级别
 */

// 日志级别
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/**
 * 记录日志
 * @param {string} message - 日志消息
 * @param {string} level - 日志级别，默认为 INFO
 */
export const log = (message, level = LOG_LEVELS.INFO) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

/**
 * 记录调试日志
 * @param {string} message - 日志消息
 */
export const debug = (message) => {
  log(message, LOG_LEVELS.DEBUG);
};

/**
 * 记录信息日志
 * @param {string} message - 日志消息
 */
export const info = (message) => {
  log(message, LOG_LEVELS.INFO);
};

/**
 * 记录警告日志
 * @param {string} message - 日志消息
 */
export const warn = (message) => {
  log(message, LOG_LEVELS.WARN);
};

/**
 * 记录错误日志
 * @param {string} message - 日志消息
 */
export const error = (message) => {
  log(message, LOG_LEVELS.ERROR);
};

export default {
  log,
  debug,
  info,
  warn,
  error
};
