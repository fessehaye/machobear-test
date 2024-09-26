import { test, expect } from "@playwright/test";

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
