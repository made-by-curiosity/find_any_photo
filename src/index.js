import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { PhotosApiService } from './js/photos-service';
import { renderGalleryPhotos } from './js/render-photos';

const photosApiService = new PhotosApiService();
console.log(photosApiService);

refs.searchFrom.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', fetchAndRenderPhotos);

function onSearchSubmit(e) {
  refs.galleryContainer.innerHTML = '';
  const searchQueryValue = e.target.elements.searchQuery.value.trim();
  e.preventDefault();
  photosApiService.page = 1;

  photosApiService.searchQuery = searchQueryValue;
  fetchAndRenderPhotos();
  e.target.elements.searchQuery.value = '';
}

function fetchAndRenderPhotos() {
  photosApiService.fetchPhotos().then(res => {
    console.log(res);
    const totalSearchResult = res.data.totalHits;
    const photos = res.data.hits;
    console.log(photos);

    if (photos.length === 0) {
      showNoMatchMessage();
      return;
    }

    showTotalFoundMessage(totalSearchResult);
    renderGalleryPhotos(photos);
  });
}

function showNoMatchMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showTotalFoundMessage(total) {
  Notify.success(`Hooray! We found ${total} images.`);
}
