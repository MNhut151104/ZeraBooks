import apiClient from './apiClient';
import { authAPI } from './auth.service';
import { booksAPI } from './books.service';
import { categoriesAPI } from './categories.service';
import { ordersAPI } from './orders.service';
import { reviewsAPI } from './reviews.service';
import { cartAPI } from './cart.service';
import { bannersAPI } from './banners.service';

export {
  apiClient as default,
  authAPI,
  booksAPI,
  categoriesAPI,
  ordersAPI,
  reviewsAPI,
  cartAPI,
  bannersAPI
};
