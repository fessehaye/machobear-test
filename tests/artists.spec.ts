import { test, expect, type Page } from "@playwright/test";
import { FavoriteArtists } from "~/types";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

const ARTISTS: FavoriteArtists = [
  { name: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" },
  { name: "Red Hot Chili Peppers", id: "0L8ExT028jH3ddEcZwqJJ5" },
  { name: "The Beatles", id: "3WrFJ7ztbogyGnTHbHJFl2" },
];

test.describe("Search Bar", () => {
  test("should allow me to go to an artist page and add to favorite", async ({
    page,
  }) => {
    // create a search locator
    const searchInput = page.getByTestId("search-input");

    // search 1st artist.
    await searchInput.fill(ARTISTS[0].name);
    await page.getByTestId("search-results").waitFor();
    await page.getByTestId("search-results").locator("a").first().click();

    // Make sure you are on the correct artist page
    await expect(page.getByTestId("artist-name")).toHaveText([ARTISTS[0].name]);

    const favButton = page.getByTestId("add-to-favorite");
    await favButton.click();

    // Check if Favorite button state changes
    await expect(favButton).toContainText("Remove as Favorite");

    await page.getByTestId("home-button").click();

    // // Make sure the list now has two todo items.
    await expect(page.getByTestId("fav-artist-link")).toHaveText([
      ARTISTS[0].name,
    ]);

    await checkNumberOfFavArtistsInLocalStorage(page, 1);
  });

  test("should clear text input field when you click on the clear button", async ({
    page,
  }) => {
    // create a search locator
    const searchInput = page.getByTestId("search-input");

    // search 1st artist.
    await searchInput.fill(ARTISTS[0].name);
    const searchResults = page.getByTestId("search-results");
    await searchResults.waitFor();

    await page.getByTestId("clear-input").click();

    await expect(searchInput).toHaveValue("");
    await expect(searchResults).toBeHidden();
  });
});

test.describe("Favorite Artists", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultFavoriteArtists(page);
    await checkNumberOfFavArtistsInLocalStorage(page, 3);
  });

  test("should allow me to go to the individual artist page", async ({
    page,
  }) => {
    const artistLinks = await page.getByTestId("fav-artist-link").all();
    for (const link of artistLinks) {
      const artistName = await link.innerText();

      await link.click();
      await expect(page.getByTestId("artist-name")).toHaveText(artistName);
      await page.goBack();
    }
  });

  test("should allow me to remove artists from the list", async ({ page }) => {
    const removalButton = await page.getByTestId("fav-artist-removal").first();
    await removalButton.click();

    await expect(page.getByTestId("fav-artist")).toHaveCount(2);
    await checkNumberOfFavArtistsInLocalStorage(page, 2);
  });

  test("can be cleared to the default state of the empty screen", async ({
    page,
  }) => {
    await expect(page.getByTestId("empty-favorites")).toBeHidden();
    await expect(page.getByTestId("fav-artist-removal")).toHaveCount(3);
    while ((await page.getByTestId("fav-artist-removal").count()) > 0) {
      const removalButton = page.getByTestId("fav-artist-removal").first();
      await removalButton.click();
    }

    await expect(page.getByTestId("fav-artist")).toHaveCount(0);
    await checkNumberOfFavArtistsInLocalStorage(page, 0);
    await expect(page.getByTestId("empty-favorites")).toBeVisible();
  });
});

async function createDefaultFavoriteArtists(page: Page) {
  await page.evaluate((artists) => {
    localStorage.setItem("favorites", JSON.stringify(artists));
  }, ARTISTS);

  await page.reload();
}

async function checkNumberOfFavArtistsInLocalStorage(
  page: Page,
  expected: number,
) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["favorites"]).length === e;
  }, expected);
}
