import {axios} from '.';

export const getWatchListUser = async (userId) => {
  const {data} = await axios.get(`list/${userId}`)
  return data;
};

export const saveListItem = async ({id, userId, movieId, watched}) => {
  const {data} = await axios({
    method: id ? 'put' : 'post',
    url: `list/${id ?? ''}`,
    data: {
      userId,
      movieId,
      watched
    }
  });
  return data;
};

export const deleteListItem = async (id) => {
  await axios.delete(`list/${id}`)
}