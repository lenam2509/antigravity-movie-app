import assert from 'node:assert/strict';
import { test } from 'node:test';
import axios from 'axios';

let payload;
let request;
axios.defaults.adapter = async (config) => {
  request = config;
  return { data: payload, status: 200, statusText: 'OK', headers: {}, config };
};
const { getNewMovies, searchMovies, getMoviesByCategory, getMovieDetail, getGenres, getMoviesByGenre } = await import('../src/api/ophim.ts');

test('normalizes flat lists and preserves pagination for every list endpoint', async () => {
  const items = [{ _id: 123, name: 'Example', slug: 'example' }];
  const pagination = { totalItems: 33, totalItemsPerPage: 24, currentPage: 2, totalPages: 2 };
  payload = { status: true, items, pagination };
  for (const fetch of [() => getNewMovies(2), () => searchMovies('a & b', 2), () => getMoviesByCategory('phim-bo', 2)]) {
    const result = await fetch();
    assert.deepEqual(result.data.items, items);
    assert.deepEqual(result.data.params.pagination, pagination);
    assert.equal(request.params.page, 2);
  }
  await searchMovies('a & b');
  assert.equal(request.params.keyword, 'a & b');
});

test('accepts empty lists but rejects malformed and failed responses', async () => {
  payload = { status: true, items: [], pagination: { totalItems: 0, totalItemsPerPage: 24, currentPage: 1 } };
  assert.deepEqual((await getNewMovies()).data.items, []);
  for (const invalid of [undefined, '<html>error</html>', { status: false }, { status: true, items: [] }, { status: true, items: [], pagination: { totalItems: 1, totalItemsPerPage: 0 } }]) {
    payload = invalid;
    await assert.rejects(getNewMovies, /Invalid movie list response/);
  }
});

test('combines movie and top-level episodes for the detail page', async () => {
  const movie = { _id: 123, slug: 'example' };
  const episodes = [{ server_name: 'Server 1', server_data: [] }];
  payload = { status: true, movie, episodes };
  assert.deepEqual((await getMovieDetail('example')).data.item, { ...movie, episodes });
  payload = { status: false };
  await assert.rejects(() => getMovieDetail('missing'), /Invalid movie detail response/);
});

test('reads genre metadata from the nested response and rejects invalid data', async () => {
  const genres = [{ _id: 30, name: 'Hành Động', slug: 'hanh-dong' }];
  payload = { status: 'success', data: { items: genres } };
  assert.deepEqual(await getGenres(), genres);
  assert.equal(request.url, '/the-loai');
  payload = { status: 'success', data: { items: [] } };
  assert.deepEqual(await getGenres(), []);
  for (const invalid of [null, { status: 'error' }, { status: 'success', data: { items: [null] } }]) {
    payload = invalid;
    await assert.rejects(getGenres, /Invalid genre list response/);
  }
});

test('fetches the selected genre and page using the genre endpoint', async () => {
  const pagination = { totalItems: 50, totalItemsPerPage: 24, currentPage: 2, totalPages: 3 };
  payload = { status: true, items: [{ _id: 123 }], pagination };
  const result = await getMoviesByGenre('hanh-dong', 2);
  assert.equal(request.url, '/the-loai/hanh-dong');
  assert.equal(request.params.page, 2);
  assert.deepEqual(result.data.params.pagination, pagination);
  assert.deepEqual(result.data.items, payload.items);
});
