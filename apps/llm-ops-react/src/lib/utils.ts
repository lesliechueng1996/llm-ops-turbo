import { type ClassValue, clsx } from 'clsx';
import { KeyboardEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';
import { ApiError } from './http';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleKeyUpAsClick: KeyboardEventHandler<HTMLElement> = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.currentTarget.click();
  }
};

export const getErrorMessage = (
  error: unknown,
  defaultErrorMsg = '系统错误',
) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  return defaultErrorMsg;
};
