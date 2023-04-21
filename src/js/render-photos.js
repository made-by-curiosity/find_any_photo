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

		 <a href="${largeImageURL}" class="photo-wrapper">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" height="270" />
	</a>

  <div class="info">
    <p class="info-item">
      <b>Likes</b><span> ${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span> ${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span> ${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span> ${downloads}</span>
    </p>
  </div>
</div>`);
  }, '');
}
