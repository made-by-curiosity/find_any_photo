import axios from 'axios';

export class PhotosApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.perPage = 40;
  }

  async fetchPhotos() {
    const BASE_URL = `https://pixabay.com/api/`;
    const API_KEY = '35477319-8304939ba4ef8e390b1df04a7';

    const config = {
      baseURL: BASE_URL,
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.perPage,
        page: this.page,
      },
    };
    return await axios(config);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
