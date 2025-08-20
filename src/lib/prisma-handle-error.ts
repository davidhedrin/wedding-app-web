import { Prisma } from '@prisma/client';

/**
 * Handles Prisma unique constraint errors (P2002)
 * @param error - The error object thrown by Prisma
 * @param messages - An object mapping unique fields to custom error messages
 * @throws Error with a custom or default message
 */
export function handlePrismaUniqueError(
  error: unknown,
  messages: Record<string, string> = {}
): string | null {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const target = error.meta?.target;

    if (typeof target === 'string') {
      return messages[target] || `The '${target}' field must be unique.`;
    }

    if (Array.isArray(target)) {
      for (const field of target) {
        if (messages[field]) return messages[field];
      }

      return `The combination of fields [${target.join(', ')}] must be unique.`;
    }

    return 'A unique constraint violation occurred.';
  }

  return null;
}