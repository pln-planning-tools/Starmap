export const addHttpsIfNotLocal = (url: any) => {
  // console.log('process.env.IS_LOCAL ->', process.env.IS_LOCAL);
  if (process.env.IS_LOCAL) {
    return url;
  }
  return 'https://' + url;
};
