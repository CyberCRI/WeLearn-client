export const scrollToAnchor = (id: string) => {
  if (!document || !document.getElementById(id)) {
    console.warn(`Element with id "${id}" not found.`);
    return;
  }

  document?.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
