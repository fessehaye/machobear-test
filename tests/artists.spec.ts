import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

const ARTISTS = [
  { name: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" },
  { name: "Red Hot Chili Peppers", id: "0L8ExT028jH3ddEcZwqJJ5" },
  { name: "The Beatles", id: "3WrFJ7ztbogyGnTHbHJFl2" },
] as const;

const ALBUMS = [
  { name: "Justice", id: "4GGazqHvuKwxBjWLFaJkDL" },
  { name: "The Getaway", id: "43otFXrY0bgaq5fB3GrZj6" },
] as const;

test.describe("Search Bar", () => {
  test("should allow me to go to multiple artist pages and add to favorite", async ({
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

    // search 2nd artist.
    await searchInput.fill(ARTISTS[1].name);
    await page.getByTestId("search-results").waitFor();
    await page.getByTestId("search-results").locator("a").first().click();

    await expect(page.getByTestId("artist-name")).toHaveText([ARTISTS[1].name]);
    await favButton.click();

    await page.getByTestId("home-button").click();

    // // Make sure the list now has two todo items.
    await expect(page.getByTestId("fav-artist-link")).toHaveText([
      ARTISTS[0].name,
      ARTISTS[1].name,
    ]);

    await checkNumberOfFavArtistsInLocalStorage(page, 2);
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

test.describe("Navigation", () => {
  test("should allow me to go to home page", async ({ page }) => {
    await expect(page.getByText("Music Search")).toBeVisible();
  });

  test("should be able to navigate to artist pages via URL", async ({
    page,
  }) => {
    await page.goto(`http://localhost:5173/details/artist/${ARTISTS[0].id}`);
    await expect(page.getByTestId("artist-name")).toHaveText([ARTISTS[0].name]);
  });

  test("should be able to navigate to album pages via URL", async ({
    page,
  }) => {
    await page.goto(`http://localhost:5173/details/album/${ALBUMS[0].id}`);
    await expect(page.getByTestId("album-name")).toHaveText([ALBUMS[0].name]);
    await expect(page.getByTestId("track-list")).toBeVisible();
    await page.getByTestId("back-button").click();
    await expect(page.getByText("Music Search")).toBeVisible();
  });

  test("should be able to navigate to album pages via artist page", async ({
    page,
  }) => {
    await page.goto(`http://localhost:5173/details/artist/${ARTISTS[1].id}`);
    await expect(page.getByTestId("artist-name")).toHaveText([ARTISTS[1].name]);
    await expect(page.getByTestId("album-listing")).toBeVisible();

    const albumLink = page
      .locator('a[data-testid="album-link"]')
      .filter({ hasText: ALBUMS[1].name });
    await expect(albumLink).toHaveCount(1);

    await albumLink.click();

    await expect(page.getByTestId("album-name")).toHaveText([ALBUMS[1].name]);
    await expect(page.getByTestId("track-list")).toBeVisible();
    await page.getByTestId("back-button").click();
    await expect(page.getByTestId("artist-name")).toHaveText([ARTISTS[1].name]);
    await expect(page.getByTestId("album-listing")).toBeVisible();
  });

  test("should show proper errors for unknown albums", async ({ page }) => {
    await page.goto(`http://localhost:5173/details/artist/not-real-artist`);
    await expect(page.getByTestId("page-error")).toHaveText("Artist not found");
  });

  test("should show proper errors for unknown artists", async ({ page }) => {
    await page.goto(`http://localhost:5173/details/album/not-real-album`);
    await expect(page.getByTestId("page-error")).toHaveText("Album not found");
  });
});

async function createDefaultFavoriteArtists(page: Page) {
  for (const artist of ARTISTS) {
    await page.goto(`http://localhost:5173/details/artist/${artist.id}`);
    await page.getByTestId("add-to-favorite").click();
  }

  await page.goto(`http://localhost:5173/`);
}

async function checkNumberOfFavArtistsInLocalStorage(
  page: Page,
  expected: number,
) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["favorites"]).length === e;
  }, expected);
}
