import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { PhotosApiService } from './js/photos-service';
import { renderGalleryPhotos } from './js/render-photos';

const photosApiService = new PhotosApiService();
const gallery = new SimpleLightbox('.gallery a');
console.log(photosApiService);

refs.searchFrom.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchSubmit(e) {
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

  photosApiService
    .fetchPhotos()
    .then(res => {
      const totalSearchResult = res.data.totalHits;
      const photos = res.data.hits;
      console.log(photos);

      if (photos.length === 0) {
        showNoMatchMessage();
        return;
      }
      showTotalFoundMessage(totalSearchResult);

      photosApiService.incrementPage();
      renderGalleryPhotos(photos);

      gallery.refresh();

      refs.loadMoreBtn.classList.toggle('is-hidden');
    })
    .catch(error => {
      showSomethingWentWrongMessage();
      console.log(error);
    });

  e.target.elements.searchQuery.value = '';
}

function onLoadMore() {
  photosApiService
    .fetchPhotos()
    .then(res => {
      const photos = res.data.hits;
      console.log(photos);

      if (photos.length === 0) {
        showNoMoreResultsMessage();
        refs.loadMoreBtn.classList.toggle('is-hidden');
        return;
      }

      photosApiService.incrementPage();

      renderGalleryPhotos(photos);

      gallery.refresh();
    })
    .catch(error => {
      if (error.response.status === 400) {
        console.error(error.response.data);
        showNoMoreResultsMessage();
        refs.loadMoreBtn.classList.toggle('is-hidden');
        return;
      }
      console.log(error);
    });
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
