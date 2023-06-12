const getAllPostsController = async (req, res) => {
  console.log(req._id);
  return res.send("These All are the posts");
};

module.exports = { getAllPostsController };
