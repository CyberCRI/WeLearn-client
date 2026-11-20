import { describe, expect, it } from 'vitest';
import { apiErrorCode, apiErrorDetail, apiRetryAfter, isAccountRequired } from '../apiErrors';
import { StreamResponseError } from '../fetch';

const axiosError = (detail: unknown) => ({ response: { status: 401, data: { detail } } });

describe('apiErrors', () => {
  it('reads the detail of a domain error', () => {
    const detail = { code: 'GUEST_QUOTA_EXCEEDED', feature: 'chat' };

    expect(apiErrorDetail(axiosError(detail))).toEqual(detail);
    expect(apiErrorCode(axiosError(detail))).toBe('GUEST_QUOTA_EXCEEDED');
  });

  it('reads the error of a refused stream like an axios one', () => {
    const error = new StreamResponseError(401, { detail: { code: 'ACCOUNT_REQUIRED' } });

    expect(isAccountRequired(error)).toBe(true);
  });

  it.each([
    ['a string detail', axiosError('Invalid or expired token')],
    ['a validation error', axiosError([{ loc: ['body'], msg: 'missing' }])],
    ['a plain text body', { response: { data: 'Bad gateway' } }],
    ['a network error', new Error('offline')],
    ['nothing', undefined]
  ])('finds no code in %s', (_, error) => {
    expect(apiErrorCode(error)).toBeUndefined();
    expect(isAccountRequired(error)).toBe(false);
  });

  it('reads the seconds a 429 asks to wait, from the body first, then the header', () => {
    const tooMany = (detail: unknown, headers: Record<string, string> = {}) => ({
      response: { status: 429, headers, data: { detail } }
    });
    expect(apiRetryAfter(tooMany({ code: 'RATE_LIMITED', retry_after: 42 }))).toBe(42);
    expect(apiRetryAfter(tooMany({ code: 'RATE_LIMITED' }, { 'retry-after': '7' }))).toBe(7);
    expect(apiRetryAfter(tooMany('m', { 'retry-after': '2.2' }))).toBe(3);
    expect(apiRetryAfter(tooMany({ code: 'RATE_LIMITED' }))).toBeNull();
    expect(
      apiRetryAfter(tooMany('m', { 'retry-after': 'Wed, 21 Oct 2026 07:28:00 GMT' }))
    ).toBeNull();
    expect(apiRetryAfter(new Error('network'))).toBeNull();
  });
});
