import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { useGoTo } from '../useGoTo';

describe('useGoTo', () => {
  it('hides the arrow by default', () => {
    const { displayArrow } = useGoTo(ref({ scrollTop: 0, clientHeight: 500 }));

    expect(displayArrow.value).toBe(false);
  });

  it('shows the arrow once scrolled past one screen height', () => {
    const scroller = ref({ scrollTop: 600, clientHeight: 500 });
    const { displayArrow, handleDisplayArrow } = useGoTo(scroller);

    handleDisplayArrow();
    expect(displayArrow.value).toBe(true);

    scroller.value.scrollTop = 500;
    handleDisplayArrow();
    expect(displayArrow.value).toBe(false);
  });
});
