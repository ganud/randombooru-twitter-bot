import { getPages, getRandomPostfromTag } from "../randombooru";
import { expect, test } from "vitest";

test("Peter Griffin has 7 pages in the general rating (as of writing)", async () => {
  expect(await getPages(["peter_griffin"], ["g"])).toBeGreaterThanOrEqual(7);
});

test("Mistyped tag returns NaN", async () => {
  expect(await getPages(["petergriffin"], ["g"])).toBe(NaN);
});

test("getRandomPostfromTag throws error if tag entered incorrectly", async () => {
  await expect(
    getRandomPostfromTag(["petergriffin"], ["g"])
  ).rejects.toThrowError("Tag entered is invalid");
});
