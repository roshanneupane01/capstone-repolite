const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const cors = require("cors"); // Add the cors middleware
const seed = require('./seed')
const {
  getGitHubToken,
  addRepoToFav,
  deleteRepoFromFav,
  signOut,
  getFavList,
  checkRepositoryExistence,
  clearFavorites

} = require("./controllers/repositories"); 

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(
  session({
    secret: "d9d01708d6b764d6a83f9530c4df009375d3e6f1",
    resave: false,
    saveUninitialized: true,
  })
);
// app.post('/api/seed', seed)

// Route to get GitHub token
app.get('/api/githubToken', getGitHubToken);

// routes for adding and deleting repositories
app.post("/api/addRepoToFav", addRepoToFav);
app.delete("/api/deleteRepoFromFav/:id", deleteRepoFromFav);

// Route for signing out
app.get('/api/signOut', signOut);

// route to check if repository exists
app.get('/api/repositoryExists/:id', checkRepositoryExistence);

// route for getting list of favorite items
app.get('/api/favorites', getFavList)

// route to clear favorites
app.delete('/api/clearFavorites', clearFavorites);

app.get("*", (req, res) => {
  res.redirect("/login.html");
});

app.listen(4000, () => console.log("Running on 4000."));