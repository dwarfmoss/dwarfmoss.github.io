function retrieveUserInfo(userLogin) {
    fetch(`https://api.github.com/users/${userLogin}`)
        .then(response => response.json())
        .then(user => document.getElementById("headline").innerHTML = `<h1>${user.name}</h1>`)
        .catch(error => {
            document.getElementById("headline").innerHTML = `<p>There was an error in retrieving the user's name.</p>
            <p>${error}</p>`;
            console.log(error);
        });
    
    fetch(`https://api.github.com/users/${userLogin}/repos?sort=created`)
        .then(response => response.json())
        // .then(repos => console.log(repos));
        .then(repos => {
            output = '<h2>Public Repositories</h2>';
            output += '<ul>';
            repos.forEach(function(repo) {
                output += `
                    <li>
                        <span class="repo-name-link"><a href="${repo.html_url}">${repo.name}</a></span>
                        <ul>
                            <li class="repo-description">Description: ${repo.description}</li>
                            <li class="repo-languages">Languages: 
                                <ul class="repo-languages-list id="repo-${repo.name}"></ul>
                            </li>
                            <li class="repo-watches-count">Watches: ${repo.watchers_count}</li>
                            <li class="repo-forks-count">Forks: ${repo.forks_count}</li>
                        </ul>
                    </li>
                `;
            })
            output += '</ul>';
            document.getElementById("repositories").innerHTML = output;
        })
        .catch(error2 => {
            document.getElementById("repositories").innerHTML = `<p>There was an error in retrieving the user's repositories</p>
            <p>${error2}</p>`;
            console.log(error2);
        });
}