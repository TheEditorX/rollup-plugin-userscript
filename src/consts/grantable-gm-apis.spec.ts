import { BASIC_GM_API_NAMES, GRANTABLE_GM_APIS } from "./grantable-gm-apis";
import { parse } from "acorn";
import { simple, SimpleVisitors } from "acorn-walk";

const createWalkHandler = (
  apiKey: keyof typeof GRANTABLE_GM_APIS,
  matchedRef: { matched: boolean },
): SimpleVisitors<unknown> => {
  return {
    Expression(node) {
      if (matchedRef.matched) return;
      if (GRANTABLE_GM_APIS[apiKey](node)) {
        matchedRef.matched = true;
      }
    },
    Identifier(node) {
      if (matchedRef.matched) return;
      if (GRANTABLE_GM_APIS[apiKey](node)) {
        matchedRef.matched = true;
      }
    },
  };
};

describe("GRANTABLE_GM_APIS matchers", () => {
  Object.values(BASIC_GM_API_NAMES).forEach((apiKey) => {
    it(`matches ${apiKey} call expression`, () => {
      const ast = parse(`${apiKey}('key');`, { ecmaVersion: 2020 });
      const matchedRef = { matched: false };

      simple(ast, createWalkHandler(apiKey, matchedRef));

      expect(matchedRef.matched).toBe(true);
    });

    it(`does not match ${apiKey} in comments`, () => {
      const ast = parse(`// ${apiKey}('key');`, { ecmaVersion: 2020 });
      const matchedRef = { matched: false };

      simple(ast, createWalkHandler(apiKey, matchedRef));

      expect(matchedRef.matched).toBe(false);
    });

    it(`matches nested ${apiKey} call expression`, () => {
      const ast = parse(`function test() { ${apiKey}('key'); }`, {
        ecmaVersion: 2020,
      });
      const matchedRef = { matched: false };

      simple(ast, createWalkHandler(apiKey, matchedRef));

      expect(matchedRef.matched).toBe(true);
    });

    it(`matches ${apiKey} with additional boilerplate`, () => {
      const ast = parse(
        `const obj = { key: 'value' };\n${apiKey}('key');\n// Commented out\n// ${apiKey}('key');`,
        { ecmaVersion: 2020 },
      );
      const matchedRef = { matched: false };

      simple(ast, createWalkHandler(apiKey, matchedRef));

      expect(matchedRef.matched).toBe(true);
    });

    it(`matches ${apiKey} through call through assigned var`, () => {
      const ast = parse(
        `const agent = typeof GM_${apiKey} === 'function' ? GM_${apiKey} : GM.${apiKey};
        agent();`,
        { ecmaVersion: 2020 },
      );
      expect(
        (() => {
          const matchedRef = { matched: false };
          simple(ast, createWalkHandler(`GM_${apiKey}`, matchedRef));
          return matchedRef.matched;
        })(),
      ).toBe(true);
      expect(
        (() => {
          const matchedRef = { matched: false };
          simple(ast, createWalkHandler(`GM.${apiKey}`, matchedRef));
          return matchedRef.matched;
        })(),
      ).toBe(true);
    });
  });

  it("matches unsafeWindow identifier expression", () => {
    const ast = parse("unsafeWindow;", { ecmaVersion: 2020 });
    const matchedRef = { matched: false };

    simple(ast, createWalkHandler("unsafeWindow", matchedRef));

    expect(matchedRef.matched).toBe(true);
  });

  it("does not match unsafeWindow in comments", () => {
    const ast = parse("// unsafeWindow;", { ecmaVersion: 2020 });
    const matchedRef = { matched: false };

    simple(ast, createWalkHandler("unsafeWindow", matchedRef));

    expect(matchedRef.matched).toBe(false);
  });

  it("matches unsafeWindow with boilerplate", () => {
    const ast = parse(
      "const obj = { key: 'value' };\nunsafeWindow;\n// Commented out\n// unsafeWindow;",
      { ecmaVersion: 2020 },
    );
    const matchedRef = { matched: false };

    simple(ast, createWalkHandler("unsafeWindow", matchedRef));

    expect(matchedRef.matched).toBe(true);
  });
});
