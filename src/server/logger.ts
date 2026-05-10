type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

const SENSITIVE_KEY_PATTERN = /(secret|password|token|key|credential|database_url|connectionstring|authorization)/i;

function sanitizeValue(key: string, value: unknown): unknown {
  if (SENSITIVE_KEY_PATTERN.test(key)) return "[redacted]";

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(String(index), item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as LogFields).reduce<LogFields>((fields, [entryKey, entryValue]) => {
      fields[entryKey] = sanitizeValue(entryKey, entryValue);
      return fields;
    }, {});
  }

  return value;
}

function sanitizeFields(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;

  return Object.entries(fields).reduce<LogFields>((sanitized, [key, value]) => {
    sanitized[key] = sanitizeValue(key, value);
    return sanitized;
  }, {});
}

function write(level: LogLevel, message: string, fields?: LogFields): void {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitizeFields(fields),
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(message: string, fields?: LogFields) {
    write("info", message, fields);
  },
  warn(message: string, fields?: LogFields) {
    write("warn", message, fields);
  },
  error(message: string, fields?: LogFields) {
    write("error", message, fields);
  },
};
