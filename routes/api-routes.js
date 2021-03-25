const router = require("express").Router();
// Deconstructing the test function from the controller's object.
const auth = require("../middleware/auth");

const {
  test,
  getPosts,
  createPost,
  getPostWithAccount,
} = require("../controllers/testControllers");

const {
  getChatMessage,
  createChatMessage,
} = require("../controllers/chatMessageControllers");
// Running the test function from our controller when this route is hit.
router.get("/test", test);

router.get("/posts", auth, getPosts);

router.post("/posts", auth, createPost);

// router.get("/posts", auth, getPostWithAccount)

router.get("/messages", auth, getChatMessage);

router.post("/messages", auth, createChatMessage);

// Authentication function s
const {
  register,
  login,
  getAccount,
  charCreatedAccount,
} = require("../controllers/userAuthControllers");

//User authenication routes

router.post("/register", register);

router.post("/login", login);

router.get("/accounts", auth, getAccount);

router.post("/characterCreation", auth, charCreatedAccount);

const { findAll, findChr, createChr, updateChr, updateAlChr, deleteChr } = require("../controllers/chrController");

router.get("/characters", findAll);

router.get("/characters/:id", findChr);

router.post("/characters", auth, createChr);

router.patch("/characters/update", auth, updateAlChr);

router.get("/characters/:id", deleteChr);

module.exports = router;
