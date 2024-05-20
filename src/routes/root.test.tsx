import { expect, describe, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { Root } from "../../src/routes/root.tsx";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";


describe("navigate from the / page", () => {
  it("navigates from the root page to /signin", async () => {
    render(<Root />, { wrapper: BrowserRouter });

    expect(screen.getByText("signin")).toBeInTheDocument();

    const user = userEvent.setup();
    const signin = vi.spyOn(user, "click");
    const signinLink = screen.getByText(/signin/i);

    await user.click(signinLink);
    expect(signin).toHaveBeenCalledTimes(1);
  });

  it("navigates from the root page to /signup", async () => {
    render(<Root />, { wrapper: BrowserRouter });

    expect(screen.getByText("signup")).toBeInTheDocument();

    const user = userEvent.setup();
    const signup = vi.spyOn(user, "click");
    const signupLink = screen.getByText(/signup/i);

    await user.click(signupLink);
    expect(signup).toHaveBeenCalledTimes(1);
  });
});
