import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { PhotosApiService } from './js/photos-service';
import { renderGalleryPhotos } from './js/render-photos';

const photosApiService = new PhotosApiService();
const gallery = new SimpleLightbox('.gallery a');

refs.searchFrom.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchSubmit(e) {
  e.preventDefault();

  const searchQueryValue = e.target.elements.searchQuery.value.trim();
  if (searchQueryValue === '') {
    showEmptyFieldMessage();
    return;
  }

  if (!refs.loadMoreBtn.classList.contains('is-hidden')) {
    refs.loadMoreBtn.classList.toggle('is-hidden');
  }

  refs.galleryContainer.innerHTML = '';
  photosApiService.resetPage();
  photosApiService.searchQuery = searchQueryValue;

  await fetchAndRenderPhotos();

  e.target.elements.searchQuery.value = '';
}

async function onLoadMore() {
  await fetchAndRenderPhotos();
  smoothScrollOnLoadMore();
}

async function fetchAndRenderPhotos() {
  try {
    const result = await photosApiService.fetchPhotos();
    const totalSearchResult = result.data.totalHits;
    const loadedPhotosCount = photosApiService.page * photosApiService.perPage;
    const photos = result.data.hits;

    if (photosApiService.page === 1) {
      if (photos.length === 0) {
        showNoMatchMessage();
        return;
      }
      showTotalFoundMessage(totalSearchResult);

      refs.loadMoreBtn.classList.toggle('is-hidden');
    }

    photosApiService.incrementPage();
    renderGalleryPhotos(photos);
    gallery.refresh();

    if (loadedPhotosCount >= totalSearchResult) {
      showNoMoreResultsMessage();
      refs.loadMoreBtn.classList.toggle('is-hidden');
      return;
    }
  } catch (error) {
    showSomethingWentWrongMessage();
  }
}

function showNoMatchMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEmptyFieldMessage() {
  Notify.failure("Search field shouldn't be empty");
}

function showTotalFoundMessage(total) {
  Notify.success(`Hooray! We found ${total} images.`);
}

function showNoMoreResultsMessage() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}

function showSomethingWentWrongMessage() {
  Notify.failure('Oops, something went wrong. Try again later.');
}

function smoothScrollOnLoadMore() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
