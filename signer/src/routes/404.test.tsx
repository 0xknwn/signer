import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import NoMatch from "./404";

describe("404", () => {
  it("renders 404 component", () => {
    render(<NoMatch />);
    const e = screen.getByText("There's nothing here: 404!");
    expect(e).toBeInTheDocument();
  });
});
