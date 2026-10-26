// minimal standins for WXT auto-imported globals

const defineItem = <T>(_key: string, { fallback }: { fallback: T }) => {
  let value = fallback;
  return {
    getValue: async () => value,
    setValue: async (next: T) => (value = next) as void,
    watch: (_cb: (v: T) => void) => () => {},
  };
};

Object.assign(globalThis, {
  storage: { defineItem },
});
