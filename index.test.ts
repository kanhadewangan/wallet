import { test } from "bun:test";
import { expect } from "bun:test";
import { Cookies } from "./index.js";

// This is a simple test file for Bun's test runner.
// Importing the test function from Bun's test module
test("test", () => {
    // This is a test to ensure that the test runner is working correctly.
    // If this test fails, it means that the test runner is not set up correctly.
    console.log("Test is running successfully!");
});

test("Cookies class functionality", () => {
    const cookie = new Cookies();
    cookie.set("name", "John Doe");
    expect(cookie.get("name")).toBe("John Doe");
})

test("Cookies class hashed functionality", () => {
    const cookie = new Cookies();
    cookie.hashed("secret", "my.secret.value");
    expect(cookie.get("secret")).toBeDefined();
    expect(cookie.has("secret")).toBe(true);
})

// test("Cookies class toJson functionality", () => {
//     const cookie = new Cookies();
//     cookie.set("name", "John Doe");
//     expect(cookie.toJson()).toBe({
//         name: "John Doe",
//     });
// });

test("Cookies class dehash functionality", () => {
    const cookie = new Cookies();
    cookie.hashed("secret", "my.secret.value");
    expect(cookie.dehash("secret")).toBeDefined();
    expect(cookie.dehash("secret")).not.toBe(undefined);
});

test("Cookies class checkIsKeys functionality", () => {
    const cookie = new Cookies();
    cookie.set("name", "John Doe");
    expect(cookie.checkIsKeys("name")).toBe(true);
    expect(cookie.checkIsKeys("nonexistent")).toBe(false);
});