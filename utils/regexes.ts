// Example: `eta:YYYY-MM-DD` -> `YYYY-MM-DD`
export const getEtaDate = (v) => /^eta[^:]*:[\s]*(([0-9]{4})[-\/\.]{1}([0-9]{2})[-\/\.]{1}([0-9]{2}))/im.exec(v)?.[1];
export const isValidChildren = (v) => /^children[:]?$/im.test(v);
