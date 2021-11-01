const { Post } = require('../../models/Post');
const User = require('../../models/User');

const createPostDB = async (
  name,
  type,
  state,
  description,
  id,
  genre,
  date,
  petImage
) => {
  try {
    const post = new Post({
      name,
      type,
      state,
      description,
      user: id,
      genre,
      date,
      petImage,
    });
    await post.save();
    console.log('USER', id, User);
    const userById = await User.findById(id);

    userById.posts.push(post);
    await userById.save();

    return post;
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};

const findPostDB = async id => {
  try {
    const post = id ? await Post.findById(id) : await Post.find();
    return post;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createPostDB,
  findPostDB,
};
