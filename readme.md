Capstone Project - RepoLite

RepoLite is a web application designed to streamline your GitHub repository management process. With a user-friendly interface and seamless integration with GitHub APIs, RepoLite offers features like viewing repositories, adding them to favorites, and managing your favorite repository list.

Features
Fetch GitHub Token
RepoLite provides secure access to your GitHub repositories by fetching and utilizing your GitHub Personal Access Token (PAT). This token is used to authenticate your account and allow access to your repositories.

Manage Repositories
RepoLite enables you to view a list of your repositories from GitHub. The application fetches repository data using the GitHub API, displaying essential information such as repository name, last update date, and language. This feature helps you keep track of your repositories and their key details.

Favorites Management
With RepoLite, you can mark repositories as favorites. You can easily add repositories to your favorites list, view your favorite repositories, and even remove them from your favorites. This feature makes it convenient to access repositories that are important to you.


Technologies Used
RepoLite is built using modern web technologies, including:

Node.js: The backend of the application is powered by Node.js, which allows for efficient server-side processing and handling of API requests.

Express.js: The Express.js framework is used to create a web server and define routes for various endpoints in the application.

GitHub API: The GitHub API is integrated to authenticate users using Personal Access Tokens and fetch the repository data.

PostgreSQL Database: The application uses a PostgreSQL database to store user data, repository details, and favorites information.

HTML/CSS/JavaScript: The frontend of RepoLite is designed using HTML for structuring the content, CSS for styling, and JavaScript to create dynamic interactions and handle API requests.

Getting Started
To use RepoLite, simply follow these steps:

Sign In with GitHub: Click the "Sign in with GitHub" button to authenticate your GitHub account and grant RepoLite access to your repositories.

View Repositories: After signing in, you'll be able to view a list of your repositories along with essential details.

Add to Favorites: To add a repository to your favorites, click the "Add to Favorites" button next to the repository. This will save the repository to your favorites list.

View Favorites: Click on the "Favorites" section to view your list of favorite repositories. You can also access this list from the navigation bar.

Remove from Favorites: To remove a repository from your favorites, click the "Delete from Favorites" button next to the repository.

Sign Out: When you're done using RepoLite, click the "Sign Out" button to securely log out of your account.

Contributors
RepoLite is developed by Roshan Neupane.

For any questions, issues, or suggestions, please reach out to roshanneupane01@gmail.com. Thank you!