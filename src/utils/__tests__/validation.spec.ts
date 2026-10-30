import { describe, expect, it } from 'vitest';
import { isValidEmail } from '../validation';

describe('isValidEmail', () => {
  it.each(['ada@test.org', '  ada.lovelace@uni.example.fr  ', 'a+b@c.io'])(
    'accepts %s',
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    }
  );

  it.each(['', 'ada', 'ada@', 'ada@test', '@test.org', 'ada lovelace@test.org', 'a@b@c.org'])(
    'rejects "%s"',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    }
  );
});
