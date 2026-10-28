import { describe, expect, it } from 'vitest';
import { extractProcessingMetadata } from '../chatProcessing';

const processing = (step: string) => ({ status: 'processing', step });

describe('extractProcessingMetadata', () => {
  it.each([
    ['null', null],
    ['a string', 'processing'],
    ['an array', [{ status: 'processing', step: 'generating_answer' }]],
    ['an empty object', {}]
  ])('returns null for %s', (_, parsed) => {
    expect(extractProcessingMetadata(parsed)).toBeNull();
  });

  it.each(['fetching_resources', 'analyzing_resources', 'generating_answer'])(
    'reads the %s step',
    (step) => {
      expect(extractProcessingMetadata({ status: 'processing', step })).toEqual(processing(step));
    }
  );

  it('normalises the case, hyphens and spaces of a step', () => {
    expect(extractProcessingMetadata({ step: ' Fetching-Resources ' })).toEqual(
      processing('fetching_resources')
    );
    expect(extractProcessingMetadata({ step: 'generating answer' })).toEqual(
      processing('generating_answer')
    );
  });

  it('reads the step from the status when there is no step', () => {
    expect(extractProcessingMetadata({ status: 'Analyzing-Resources' })).toEqual(
      processing('analyzing_resources')
    );
  });

  it.each([
    ['an unknown step', { status: 'processing', step: 'thinking' }],
    ['a processing status without step', { status: 'processing' }],
    ['a non string step', { status: 'processing', step: 3 }],
    ['an unrelated status', { status: 'done' }]
  ])('returns null for %s', (_, parsed) => {
    expect(extractProcessingMetadata(parsed)).toBeNull();
  });

  it.each(['data', 'meta', 'metadata'])('reads the event nested under %s', (key) => {
    expect(extractProcessingMetadata({ [key]: { step: 'generating_answer' } })).toEqual(
      processing('generating_answer')
    );
  });

  it('prefers the top level event over nested ones', () => {
    expect(
      extractProcessingMetadata({
        step: 'fetching_resources',
        data: { step: 'generating_answer' }
      })
    ).toEqual(processing('fetching_resources'));
  });

  it('falls through to the next nested key when one is not an event', () => {
    expect(
      extractProcessingMetadata({
        data: { content: 'answer chunk' },
        metadata: { step: 'analyzing_resources' }
      })
    ).toEqual(processing('analyzing_resources'));
  });
});
