import { screen } from "@testing-library/react";
import { Navigation } from "../Navigation";
import MockAdapter from "axios-mock-adapter";
import { renderWithProviders } from "../../../common/utils/testUtils";

describe("Navigation", () => {
  const mockApi = new MockAdapter(axios);

  beforeAll(() => {
    mockApi.reset();
  });

  test("Should render navigation", async () => {
    act(() => {
      renderWithProviders(<Navigation />);
    });

    const nav = screen.getByTestId("navigation");
    expect(nav).toBeInTheDocument();
  });
});
