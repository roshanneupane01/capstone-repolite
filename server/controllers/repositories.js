const db = require("../database");
const axios = require("axios");

module.exports = {
  getGitHubToken: (req, res) => {
    const githubToken = process.env.GITHUB_PAT;
    if (githubToken) {
      res.json({ token: githubToken });
    } else {
      res.status(500).json({ error: 'GitHub token not available' });
    }
  },

  // Handler for getting user repositories
  getRepositories: async (req, res) => {
    try {
      console.log("repo", req.session);
      const accessToken = req.session.githubAccessToken;
      console.log(accessToken);

      // Check if the access token is present in the session
      if (!accessToken) {
        return res.status(401).json({ error: "Access token not found" });
      }

      const apiUrl = "https://api.github.com/user/repos";

      // Setting up headers for making authenticated API requests
      const headers = {
        Accept: "application/vnd.github+json", // Specifying the accepted response format
        Authorization: `Bearer ${accessToken}`, // Including the access token for authentication
        "X-GitHub-Api-Version": "2022-11-28", // Specifying the GitHub API version
      };

      // Making a GET request to the GitHub API to fetch user repositories
      const response = await axios.get(apiUrl, { headers });
      const repositories = response.data;

      // Sending the fetched repositories in the response
      res.status(200).json({ repositories });
    } catch (error) {
      console.error("Error getting repositories:", error);
      res.status(500).json({ error: "Error getting repositories" });
    }
  },

  checkRepositoryExistence : async (req, res) => {
    const { id } = req.params;
    try {
      const repository = await db.query(`
        SELECT EXISTS (
          SELECT 1
          FROM Repositories
          WHERE repository_id = ${id}
        ) AS exists;
      `);
      res.status(200).json(repository[0][0]);
    } catch (error) {
      console.error('Error checking repository existence:', error);
      res.status(500).json({ error: 'Error checking repository existence' });
    }
  },

  getFavList: async (req, res) => {
    try {
      const getAllFavorites = await db.query(`
        SELECT * FROM Favorites AS F
        JOIN Repositories AS R
        ON R.repository_id = F.repository_id;
      `);

      res.status(200).json(getAllFavorites);
    } catch (err) {
      console.error('Error fetching favorites list:', err);
      res.status(500).json({ error: 'Error showing favorites list' });
    }
  },

  addRepoToFav: async (req, res) => {
    try {
      const {
        repositoryId,
        repositoryName,
        repositoryUpdatedAt,
        repositoryLanguage,
      } = req.body;

      console.log(repositoryLanguage)
      // Insert the repository into the Repositories table
      await db.query(`
  INSERT INTO Repositories (repository_id, repository_name, repository_last_updated, repository_language)
  VALUES ('${repositoryId}', '${repositoryName}', '${repositoryUpdatedAt}', '${repositoryLanguage}')
  ON CONFLICT (repository_name) DO NOTHING;
`, [repositoryName, repositoryUpdatedAt, repositoryLanguage]);

      // Check if the repository is already in favorites for the user
      const checkQuery = `
        SELECT * FROM Favorites
        WHERE user_id = 1
        AND repository_id = ${repositoryId};
      `;
      const existingFavorite = await db.query(checkQuery, [req.session.userId, repositoryId]);
      if (existingFavorite[0].length > 0) {
        return res
          .status(400)
          .json({ error: 'Repository already in favorites' });
      }

      // Add the repository to favorites
      const insertQuery = `
        INSERT INTO Favorites (user_id, repository_id, repository_note)
        VALUES (1, ${repositoryId}, '');
      `;
      const newFavorite = await db.query(insertQuery, [req.session.userId, repositoryId, repositoryName]);
      const allFavorites = await db.query(`
        SELECT * FROM Favorites AS F
        JOIN Repositories AS R
        ON R.repository_id = F.repository_id;
      `)
      console.log(newFavorite)
      res.status(200).json(allFavorites);
    } catch (error) {
      console.error('Error adding repository to favorites:', error);
      res.status(500).json({ error: 'Error adding repository to favorites' });
    }
  },

  getFavList: async (req, res) => {
    try {
      const getAllFavorites = await db.query(`
        SELECT * FROM Favorites AS F
        JOIN Repositories AS R
        ON R.repository_id = F.repository_id;
      `);
      
      res.status(200).json(getAllFavorites);
    } catch (err) {
      console.error('Error fetching favorites list:', err);
      res.status(500).json({ error: 'Error showing favorites list' });
    }
  },  

  deleteRepoFromFav: async (req, res) => {
    try {
      const { id } = req.params;
      // Delete the repository from favorites
      const deleteQuery = `
      DELETE FROM Favorites
      WHERE repository_id = ${id}
      AND user_id = 1;
    `;
      const deletedFavorite = await db.query(deleteQuery);
      if (deletedFavorite[1].rowCount === 0) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.status(200).json({ message: "Repository removed from favorites" });
    } catch (error) {
      console.error("Error deleting repository from favorites:", error);
      res
        .status(500)
        .json({ error: "Error deleting repository from favorites" });
    }
  },

  clearFavorites: async (req, res) => {
    try {
      await db.query("DELETE FROM Favorites");
      res.status(200).json({ message: "Favorites cleared successfully" });
    } catch (err) {
      console.error("Error clearing favorites:", err);
      res.status(500).json({ error: "Error clearing favorites" });
    }
  },

  signOut: (req, res) => {
    try {
      req.session.destroy();
      res.clearCookie('authToken');
      console.log('Redirecting to login page...');
      res.redirect('/login');
    } catch (error) {
      console.error('Error during sign-out:', error);
      res.sendStatus(500);
    }
  }  
};