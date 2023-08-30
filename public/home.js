document.addEventListener("DOMContentLoaded", async () => {
  const signOutButton = document.getElementById("sign-out-button");
  const allRepositoriesLink = document.querySelector(
    '.nav-link[data-section="all-repositories"]'
  );
  const favoritesLink = document.querySelector(
    '.nav-link[data-section="favorites"]'
  );
  const repositoriesContainer = document.querySelector(".repositories");

  let favoriteRepositories = [];

  signOutButton.addEventListener("click", async () => {
    try {
      const response = await axios.get("/api/signOut");
      console.log("Sign out response:", response);
      // window.location.href = '/login'
      // Redirect the user to the login page or handle the response as needed
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });

  async function fetchAllRepositories() {
    const accessToken = await axios.get('/api/githubToken')

    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken.data.token}`,
        },
      });

      const repositories = response.data;

      repositoriesContainer.innerHTML = ""; // Clear existing content

      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      repositories.forEach((repository) => {
        const repositoryCard = document.createElement("div");
        repositoryCard.classList.add("repository-card");

        // Create repository info
        const repositoryInfo = document.createElement("div");
        repositoryInfo.classList.add("repository-info");
        repositoryInfo.innerHTML = `
          <h3>${repository.name}</h3>
          <p>${
            repository.updated_at
              ? `Last Updated: ${new Date(
                  repository.updated_at
                ).toLocaleDateString()}`
              : "No update date available"
          }</p>
          <p>Language: ${repository.language}</p>
        `;

        // Create "Add to Favorites" button
        const addToFavoritesButton = document.createElement("button");
        addToFavoritesButton.classList.add("add-to-favorites");
        addToFavoritesButton.textContent = "Add to Favorites";
        addToFavoritesButton.dataset.id = repository.id;
        addToFavoritesButton.addEventListener("click", () =>
          addToFavorites(
            repository.id,
            repository.name,
            repository.updated_at,
            repository.language
          )
        );

        // Append elements to the repository card
        repositoryCard.appendChild(repositoryInfo);
        repositoryCard.appendChild(addToFavoritesButton);

        rowDiv.appendChild(repositoryCard);
      });

      repositoriesContainer.appendChild(rowDiv);
    } catch (error) {
      console.error("Error fetching all repositories:", error);
    }
  }

  async function fetchFavoriteRepositories() {
    try {
      const response = await axios.get("/api/favorites"); // Fetch the list of favorite repositories from the server
      favoriteRepositories = response.data;

      repositoriesContainer.innerHTML = ""; // Clear existing content

      if (favoriteRepositories.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Favorites section is empty.";
        repositoriesContainer.appendChild(emptyMessage);
      } else {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        console.log(favoriteRepositories);
        favoriteRepositories[0].forEach((repository) => {
          console.log(repository);
          const repositoryCard = document.createElement("div");
          repositoryCard.classList.add("repository-card");

          // Create repository info
          const repositoryInfo = document.createElement("div");
          repositoryInfo.classList.add("repository-info");
          repositoryInfo.innerHTML = `
            <h3>${repository.repository_name}</h3>
            <p>${
              repository.repository_last_updated
                ? `Last Updated: ${new Date(
                    repository.repository_last_updated
                  ).toLocaleDateString()}`
                : "No update date available"
            }</p>
            <p>Language: ${repository.repository_language}</p>
          `;

          // Create "Delete from Favorites" button
          const deleteFromFavoritesButton = document.createElement("button");
          deleteFromFavoritesButton.classList.add("add-to-favorites");
          deleteFromFavoritesButton.textContent = "Delete from Favorites";
          deleteFromFavoritesButton.dataset.id = repository.repository_id;
          deleteFromFavoritesButton.addEventListener("click", () =>
            deleteFromFavorites(repository.repository_id)
          );

          // Append elements to the repository card
          repositoryCard.appendChild(repositoryInfo);
          repositoryCard.appendChild(deleteFromFavoritesButton);

          rowDiv.appendChild(repositoryCard);
        });

        repositoriesContainer.appendChild(rowDiv);
      }
    } catch (error) {
      console.error("Error fetching favorite repositories:", error);
    }
  }

  async function addToFavorites(id, name, updatedAt, language) {
    console.log("Adding to favorites:", id, name, updatedAt, language);
    if (!favoriteRepositories.includes(id)) {
      // Check if the repository exists in the database
      const repositoryExists = await axios.get(`/api/repositoryExists/${id}`);

      // if (!repositoryExists.data.exists) {
      //   console.log(`Repository with ID ${id} does not exist.`);
      //   return;
      // }

      favoriteRepositories.push(id);

      const addToFavoritesButton = document.querySelector(
        `.add-to-favorites[data-id="${id}"]`
      );
      addToFavoritesButton.disabled = true;
      addToFavoritesButton.classList.add("added-to-favorites");

      try {
        const response = await axios.post("/api/addRepoToFav", {
          repositoryId: id,
          repositoryName: name,
          repositoryUpdatedAt: updatedAt,
          repositoryLanguage: language,
        });
        console.log(response.data);
        console.log(
          `${name} added to favorites and repository info saved to the database.`,
          favoriteRepositories
        );
      } catch (error) {
        console.error(
          "Error adding repository to favorites and saving repository info to the database:",
          error
        );
      }
    }
  }

  function showAllRepositories() {
    repositoriesContainer.innerHTML = "";
    allRepositoriesLink.classList.add("active");
    favoritesLink.classList.remove("active");
    fetchAllRepositories(); // Fetch and display all repositories again
  }

  showAllRepositories();

  favoritesLink.addEventListener("click", () => {
    fetchFavoriteRepositories(); // Fetch and display favorite repositories
    repositoriesContainer.innerHTML = "";
    favoritesLink.classList.add("active");
    allRepositoriesLink.classList.remove("active");

    if (favoriteRepositories.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Favorites section is empty.";
      repositoriesContainer.appendChild(emptyMessage);
    } else {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      favoriteRepositories.forEach((repository) => {
        const repositoryCard = document.createElement("div");
        repositoryCard.classList.add("repository-card");

        // Create repository info
        const repositoryInfo = document.createElement("div");
        repositoryInfo.classList.add("repository-info");
        repositoryInfo.innerHTML = `
          <h3>${repository.repository_name}</h3>
          <p>${
            repository.repository_last_updated
              ? `Last Updated: ${new Date(
                  repository.repository_last_updated
                ).toLocaleDateString()}`
              : "No update date available"
          }</p>
          <p>Language: ${repository.language || "Not specified"}</p>
        `;

        // Create "Delete from Favorites" button
        const deleteFromFavoritesButton = document.createElement("button");
        deleteFromFavoritesButton.classList.add("add-to-favorites");
        deleteFromFavoritesButton.textContent = "Delete from Favorites";
        deleteFromFavoritesButton.dataset.id = repository.repository_id;
        deleteFromFavoritesButton.addEventListener("click", () =>
          deleteFromFavorites(repository.repository_id)
        );

        // Append elements to the repository card
        repositoryCard.appendChild(repositoryInfo);
        repositoryCard.appendChild(deleteFromFavoritesButton);

        rowDiv.appendChild(repositoryCard);
      });

      repositoriesContainer.appendChild(rowDiv);
    }
  });

  function deleteFromFavorites(id) {
    console.log("hello");
    const index = favoriteRepositories.findIndex(
      (repo) => repo === parseInt(id)
    );
    axios.delete(`/api/deleteRepoFromFav/${id}`).then((res) => {
      fetchFavoriteRepositories();
    });
    if (index !== -1) {
      // favoriteRepositories.splice(index, 1);
      console.log(
        `Repository with ID ${id} deleted from favorites.`,
        favoriteRepositories
      );
    }
  }

  async function clearFavorites() {
    try {
      await axios.delete("/api/clearFavorites");
      favoriteRepositories = []; // Clear the local array
      checkAndDisableFavoritesButtons(); // Reset buttons
      console.log("Favorites cleared.");
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  }

  signOutButton.addEventListener("click", async () => {
    try {
      await axios.get("/api/signOut");
      await clearFavorites(); // Clear favorites on the server and client
      console.log("Sign out successful.");
      // You can also redirect to the login page here
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });

  allRepositoriesLink.addEventListener("click", () => {
    repositoriesContainer.innerHTML = ""; // Clear existing content
    allRepositoriesLink.classList.add("active");
    favoritesLink.classList.remove("active");
    fetchAllRepositories(); // Fetch and display all repositories again
  });

  function checkAndDisableFavoritesButtons() {
    const addToFavoritesButtons =
      document.querySelectorAll(".add-to-favorites");
    addToFavoritesButtons.forEach((button) => {
      const id = button.dataset.id;
      if (favoriteRepositories.includes(id)) {
        button.disabled = true;
        button.classList.add("added-to-favorites");
      }
    });
  }

  await fetchAllRepositories();
  checkAndDisableFavoritesButtons();
});
