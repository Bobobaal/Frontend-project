import {axios} from '.';

export const getAllMovies = async () => {
  const {data} = await axios.get('movies');
  return data;
}

export const getMovieById = async (id) => {
  const {data} = await axios.get(`movies/${id}`);
  return data;
};

export const saveMovie = async ({id, title, releaseYear, synopsis, imdbLink}) => {
  const {data} = await axios({
    method: id ? 'put' : 'post',
    url: `movies/${id ?? ''}`,
    data: {
      title,
      releaseYear,
      synopsis,
      imdbLink
    }
  });
  return data;
};

export const deleteMovie = async (id) => {
  await axios.delete(`movies/${id}`);
}