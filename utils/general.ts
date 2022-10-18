export const addHttpsIfNotLocal = (url: any) => {
  console.log('url', url);
  // console.log('process.env.IS_LOCAL ->', process.env.IS_LOCAL);
  if (process.env.IS_LOCAL) {
    return url;
  }
  console.log('after!', url);
  return 'https://' + url;
};
