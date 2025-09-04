export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaços e underscores por hífens
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
};

export const generateUniqueSlug = async (
  title: string,
  checkUnique: (slug: string) => Promise<boolean>
): Promise<string> => {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (await checkUnique(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
