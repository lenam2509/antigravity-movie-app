import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getMovieImageUrl, MOVIE_PLACEHOLDER } from '../src/utils/movieImage.ts';

test('uses a placeholder for malformed API image fields including empty objects', () => {
    for (const value of [{}, [], null, undefined, 0, false, '', '   ']) {
        assert.equal(getMovieImageUrl(value), MOVIE_PLACEHOLDER);
    }
});

test('preserves full URLs and resolves relative images', () => {
    assert.equal(getMovieImageUrl('https://vsmov.com/storage/images/movie.jpg'), 'https://vsmov.com/storage/images/movie.jpg');
    assert.equal(getMovieImageUrl(' movie.jpg '), 'https://img.vsmov.com/uploads/movies/movie.jpg');
    assert.equal(getMovieImageUrl('//example.com/movie.jpg'), 'https://example.com/movie.jpg');
});
