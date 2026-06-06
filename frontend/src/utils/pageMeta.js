const DEFAULT_TITLE = 'Linktree Clone';

function upsertMetaTag(name, content, attribute = 'name') {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function setPageMeta({ title, description, url, image }) {
  document.title = title || DEFAULT_TITLE;

  upsertMetaTag('description', description);
  upsertMetaTag('og:title', title, 'property');
  upsertMetaTag('og:description', description, 'property');
  upsertMetaTag('og:url', url, 'property');
  upsertMetaTag('og:type', 'profile', 'property');
  upsertMetaTag('twitter:card', image ? 'summary_large_image' : 'summary');
  upsertMetaTag('twitter:title', title);
  upsertMetaTag('twitter:description', description);

  if (image) {
    upsertMetaTag('og:image', image, 'property');
    upsertMetaTag('twitter:image', image);
  }
}

export function resetPageMeta() {
  setPageMeta({
    title: DEFAULT_TITLE,
    description: 'Создайте свою страницу со ссылками',
    url: window.location.origin,
  });
}
