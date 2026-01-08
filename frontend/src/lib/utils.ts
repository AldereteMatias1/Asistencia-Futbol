export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
  }).format(date);
};
