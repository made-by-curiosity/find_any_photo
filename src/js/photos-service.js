import axios from 'axios';

export class PhotosApiService {
  constructor() {
    this.page = 1;
    // this.searchQuery = '';
    // удалить и раскоментить сверху
    this.searchQuery = 'dog';
  }

  fetchPhotos() {
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
        per_page: 40,
      },
    };
    console.log(this);
    return axios(config);
  }
}
