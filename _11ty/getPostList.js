module.exports = function(collection) {
  const posts = collection.getFilteredByTag("posts");

  for(let i = 0; i < posts.length ; i++) {
    const data = posts[i].data;
    data.prevPost = posts[i - 1];
    data.nextPost = posts[i + 1];
  }

  return posts;
};
