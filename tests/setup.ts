/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@testing-library/jest-dom/vitest";
import { setLogger } from "react-query";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "./mocks/server";

/* remove this after react-query update see in notes Readme.md*/
const printLog = () => {
  return;
};

setLogger({
  log: printLog,
  warn: printLog,
  error: printLog,
});
/* remove above after update */

// msw server handling
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// mocking auth0
vi.mock("@auth0/auth0-react");

// global things missing from jsdom
global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
