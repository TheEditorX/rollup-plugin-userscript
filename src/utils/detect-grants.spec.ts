import { detectGrants } from "./detect-grants";
import { GRANTABLE_GM_APIS } from "../consts";
import { parse } from "acorn";
import sinon, { SinonSandbox, SinonStub } from "sinon";

describe("detectGrants", () => {
  let sandbox: SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    Object.keys(GRANTABLE_GM_APIS).forEach((apiKey) => {
      sandbox.stub(GRANTABLE_GM_APIS, apiKey).returns(false);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("returns an empty array when no grantable APIs are detected", () => {
    const ast = parse("const x = 42;", { ecmaVersion: 2020 });

    const result = detectGrants(ast);

    expect(result).toEqual([]);
  });

  it("detects a single grantable API", () => {
    const ast = parse("GM_getValue('key');", { ecmaVersion: 2020 });
    (GRANTABLE_GM_APIS["GM_getValue"] as SinonStub).returns(true);

    const result = detectGrants(ast);

    expect(result).toEqual(["GM_getValue"]);
  });

  it("detects multiple grantable APIs", () => {
    const ast = parse("GM_getValue('key'); GM_setValue('key', 'value');", {
      ecmaVersion: 2020,
    });
    (GRANTABLE_GM_APIS["GM_getValue"] as SinonStub).returns(true);
    (GRANTABLE_GM_APIS["GM_setValue"] as SinonStub).returns(true);

    const result = detectGrants(ast);

    expect(result.sort()).toEqual(["GM_getValue", "GM_setValue"].sort());
  });

  it("handles duplicate grantable APIs gracefully", () => {
    const ast = parse("GM_getValue('key'); GM_getValue('key');", {
      ecmaVersion: 2020,
    });
    (GRANTABLE_GM_APIS["GM_getValue"] as SinonStub).returns(true);

    const result = detectGrants(ast);

    expect(result).toEqual(["GM_getValue"]);
  });

  it("returns an empty array for an empty AST", () => {
    const ast = parse("", { ecmaVersion: 2020 });

    const result = detectGrants(ast);

    expect(result).toEqual([]);
  });
});
