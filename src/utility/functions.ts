export const removeDuplicates = (arr: Array<string | number>) => {
  return arr.filter((item, index: number) => arr.indexOf(item) === index);
};
