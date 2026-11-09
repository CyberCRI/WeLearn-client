export const scrollToAnchor = (id: string) => {
  if (!document || !document.getElementById(id)) {
    console.warn(`Element with id "${id}" not found.`);
    return;
  }
  document
    ?.getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
};

// the app scrolls inside AppLayout's .main, not the window
export const scrollToTop = () => {
  document.querySelector('.main')?.scrollTo?.({ top: 0 });
};
