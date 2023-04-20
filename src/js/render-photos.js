import { refs } from './refs';

export function renderGalleryPhotos(photos) {
  const markup = createPhotosMarkup(photos);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function createPhotosMarkup(photos) {
  return photos.reduce((markup, photo) => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = photo;

    return (markup += `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="400" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`);
  }, '');
}
