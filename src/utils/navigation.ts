export const scrollToAnchor = (id: string) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
