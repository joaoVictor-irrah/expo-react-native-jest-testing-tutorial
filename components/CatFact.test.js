import { render, waitFor } from "@testing-library/react-native";
import CatFact from "./CatFact";
import { act } from "@testing-library/react-native";

describe("CatFact", () => {
  it("displays cat fact", async () => {
    fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { text: "first cat fact" },
            { text: "second cat fact" },
          ]),
      })
    );

    const { getByText } = render(<CatFact />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    const catFactElement = getByText("first cat fact");
    expect(catFactElement).toBeTruthy();
  });

  it("displays no cat fact", async () => {
    fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    const { getByText } = render(<CatFact />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    const catFactElement = getByText("No Cat Facts!");
    expect(catFactElement).toBeTruthy();
  });

  it("displays loading while fetching", async () => {
    let resolveFetch;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { getByText } = render(<CatFact />);
    expect(getByText("Loading...")).toBeTruthy();

    await act(async () => {
      resolveFetch({
        json: () => Promise.resolve([]),
      });
    });
  });
});
