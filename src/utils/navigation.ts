export const scrollToAnchor = (id: string) => {
  if (!document || !document.getElementById(id)) {
    console.warn(`Element with id "${id}" not found.`);
    return;
  }
  console.log('scrolled');
  document
    ?.getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
};
