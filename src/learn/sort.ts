// state of a sorting activity ("drag each statement to the right category"). pure, so it's testable
export type SortState = {
  placed: Record<string, string>; // cardId -> binId, correct placements only
  attempts: Record<string, number>; // cardId -> number of tries
};

export const emptySort = (): SortState => ({ placed: {}, attempts: {} });

export function placeCard(
  state: SortState,
  card: { id: string; bin: string },
  binId: string
): { state: SortState; correct: boolean } {
  if (state.placed[card.id]) return { state, correct: true };
  const correct = card.bin === binId;
  return {
    correct,
    state: {
      placed: correct ? { ...state.placed, [card.id]: binId } : state.placed,
      attempts: { ...state.attempts, [card.id]: (state.attempts[card.id] ?? 0) + 1 }
    }
  };
}

export const isSortDone = (state: SortState, cardCount: number) =>
  Object.keys(state.placed).length === cardCount;

export const firstTryCount = (state: SortState) =>
  Object.keys(state.placed).filter((id) => state.attempts[id] === 1).length;

// fisher–yates; if chance gives back the original order, rotate by one so it's never the answer order
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift() as T);
  return out;
}
