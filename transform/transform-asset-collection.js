// node > 17 für fetch

const url = "http://localhost:1337/api";
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer 664f705aeed26de21debc54d4d7f15505b4b45d24e03a608fcc4f11e8a0192502aef9e1993006cafb38d96b40fb5a7e57de7b6ef291dd06080eb860ec0a7bb4c7f44615ec10d753dcd3d192c1e6f01eb0ddb04eb5782fba4bdf2d4e611e7bef27143fcff1f0c6bf5eb763b72723a4aff6bc27a7665c6c09bf8d1b18a1957cfcd",
};

const fetchCollection = async (resource) => {
  const query = "?populate=%2A&locale=all";
  const response = await fetch(`${url}/${resource}${query}`, {
    headers,
  });

  const { data } = await response.json();
  return data;
};

const createAsset = async (body) => {
  const payload = { data: body };
  const response = await fetch(`${url}/assets`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return response.json();
};

(async function () {
  try {
    const count = {
      total: 0,
      "press-news-article": { de: 0, en: 0 },
      "press-release": { de: 0, en: 0 },
      logo: { de: 0, en: 0 },
      other: { de: 0, en: 0 },
      photo: { de: 0, en: 0 },
      poster: { de: 0, en: 0 },
      screenshot: { de: 0, en: 0 },
      video: { de: 0, en: 0 },
    };

    const addCount = (asset) => {
      count.total++;
      count[asset.Type][asset.locale]++;
    };

    const assetBuilder = async (
      type,
      title,
      media,
      preview_image,
      url,
      date,
      locale
    ) => {
      const entry = { Type: type, Title: title, locale };
      if (media && media.data) entry.Data = media.data.map((asset) => asset.id);
      if (preview_image) entry.Preview_Image = preview_image.data;
      if (url) entry.URL = url;
      if (date) entry.Date = date;

      addCount(entry);
      return createAsset(entry);
    };

    const pressNewsArticles = await fetchCollection("press-news-articles");
    const pressReleases = await fetchCollection("press-releases");
    const logos = await fetchCollection("logos");
    const others = await fetchCollection("others");
    const photos = await fetchCollection("photos");
    const posters = await fetchCollection("posters");
    const screenshots = await fetchCollection("screenshots");
    const videos = await fetchCollection("videos");

    for (const article of pressNewsArticles) {
      await assetBuilder(
        "press-news-article",
        article.attributes.Title,
        article.attributes.Data,
        null,
        article.attributes.URL,
        article.attributes.Date,
        article.attributes.locale
      );
    }

    for (const release of pressReleases) {
      await assetBuilder(
        "press-release",
        release.attributes.Title,
        release.attributes.Data,
        null,
        release.attributes.URL,
        release.attributes.Date,
        release.attributes.locale
      );
    }

    for (const logo of logos) {
      await assetBuilder(
        "logo",
        logo.attributes.Title,
        logo.attributes.Image,
        null,
        null,
        null,
        logo.attributes.locale
      );
    }

    for (const other of others) {
      await assetBuilder(
        "other",
        other.attributes.Title,
        other.attributes.Files,
        other.attributes.Preview_Image,
        null,
        null,
        other.attributes.locale
      );
    }

    for (const photo of photos) {
      await assetBuilder(
        "photo",
        photo.attributes.Title,
        photo.attributes.Images,
        null,
        null,
        null,
        photo.attributes.locale
      );
    }

    for (const poster of posters) {
      await assetBuilder(
        "poster",
        poster.attributes.Title,
        poster.attributes.File,
        poster.attributes.Preview_Image,
        null,
        null,
        poster.attributes.locale
      );
    }

    for (const screenshot of screenshots) {
      await assetBuilder(
        "screenshot",
        screenshot.attributes.Title,
        screenshot.attributes.Image,
        null,
        null,
        null,
        screenshot.attributes.locale
      );
    }

    for (const video of videos) {
      await assetBuilder(
        "video",
        video.attributes.Title,
        null,
        null,
        video.attributes.URL,
        null,
        video.attributes.locale
      );
    }

    console.table(count);
  } catch (err) {
    console.error(err);
  }
})();
