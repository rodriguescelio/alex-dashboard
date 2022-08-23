import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://tv.celiorodrigues.com:5001',
});
