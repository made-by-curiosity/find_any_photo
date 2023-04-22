import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import { refs } from './js/refs';
import { PhotosApiService } from './js/photos-service';
import { renderGalleryPhotos } from './js/render-photos';

const photosApiService = new PhotosApiService();
const gallery = new SimpleLightbox('.gallery a');
let isNoContentLeft = false;
let totalSearchResult;

refs.searchFrom.addEventListener('submit', onSearchSubmit);
window.addEventListener('scroll', debounce(onLoadMore, 300));

async function onSearchSubmit(e) {
  e.preventDefault();

  // empty search field check
  const searchQueryValue = e.target.elements.searchQuery.value.trim();
  if (searchQueryValue === '') {
    showEmptyFieldMessage();
    return;
  }

  // reset all properties
  isNoContentLeft = false;
  totalSearchResult = 0;
  refs.galleryContainer.innerHTML = '';
  photosApiService.resetPage();

  // set new search query
  photosApiService.searchQuery = searchQueryValue;

  // add found photos on a page
  await fetchAndRenderPhotos();

  // clear search field value
  e.target.elements.searchQuery.value = '';
}

async function onLoadMore() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  //stop loading more photos if content ended or gallery is updating with new search query
  if (isNoContentLeft || refs.galleryContainer.innerHTML === '') {
    return;
  }

  // load more photos when reached the end of a page
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    await fetchAndRenderPhotos();
    smoothScrollOnLoadMore();
  }
}

async function fetchAndRenderPhotos() {
  const totalPhotosOnPage = refs.galleryContainer.children.length;

  // check if content ended before new fetch(backend bug, gives back more photos than free user limit)
  if (totalPhotosOnPage >= totalSearchResult && totalSearchResult !== 0) {
    showNoMoreResultsMessage();
    isNoContentLeft = true;
    return;
  }

  try {
    const result = await photosApiService.fetchPhotos();
    const photos = result.data.hits;
    totalSearchResult = result.data.totalHits;

    // check if content ended after fetch
    if (photosApiService.page > 1 && photos.length === 0) {
      showNoMoreResultsMessage();
      isNoContentLeft = true;
      return;
    }

    // show total found or no matches messages on a new search query
    if (photosApiService.page === 1) {
      if (photos.length === 0) {
        showNoMatchMessage();
        return;
      }
      showTotalFoundMessage(totalSearchResult);
    }

    // add new photos in gallery
    photosApiService.incrementPage();
    renderGalleryPhotos(photos);
    gallery.refresh();
  } catch (error) {
    console.log(error);
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
