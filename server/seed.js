const db = require("./database");

const seed = () => {
  db.query(
    `
        CREATE TABLE Users (
            user_id SERIAL PRIMARY KEY,
            github_username VARCHAR(255) UNIQUE,
            github_email VARCHAR(320) UNIQUE
        );
        CREATE TABLE Repositories (
          repository_id SERIAL PRIMARY KEY,
          repository_name VARCHAR(255) UNIQUE,
          repository_last_updated VARCHAR(20),
          repository_language VARCHAR(255)
        );
        
        CREATE TABLE Favorites (
            favorite_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES Users(user_id),
            repository_id INTEGER REFERENCES Repositories(repository_id)
        );
    `
  ).then(() => {
    console.log("Seeded... :)");
  });
};

module.exports = seed;
