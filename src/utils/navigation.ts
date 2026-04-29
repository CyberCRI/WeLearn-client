export const scrollToAnchor = (id: string) => {
  if (!document.getElementById(id)) return;
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
