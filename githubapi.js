window.onload = retrieveUserInfo("dwarfmoss");

async function retrieveUserInfo(userLogin) {
    let output = "";
    let usersRepos;
    let user = await retrieveUsersName(userLogin);
    
    document.getElementById("headline").innerHTML = `<h1>${user.name}</h1>`;
    usersRepos = await retrieveUsersRepos(user.repos_url);
    
    // console.log(usersRepos);
    
    output = '<h2>Public Repositories</h2>';
    output += '<ul>';
    usersRepos.forEach(repo => {
        output += `
            <li>
                <span class="repo-name-link"><a href="${repo.html_url}">${repo.full_name}</a></span>
                ${repo.parent ?
                    `<span class="repo-forked">Forked from <a href="${repo.parent.url}">${repo.parent.full_name}</a></span>`
                    : `<span class="repo-forked"></span>`}
                <ul>
                    <li class="repo-description">Description: ${repo.description}</li>
                    ${repo.languages ? `
                    <li class="repo-languages">Languages:
                        <ul class="repo-languages-ul" id="repo-${repo.id}-languages">
                        </ul>
                    </li>`
                    : ``
                        }
                    <li class="repo-watches-count">Watches: ${repo.watchers_count}</li>
                    <li class="repo-forks-count">Forks: ${repo.forks_count}</li>
                </ul>
            </li>
        `;
    });
    output += '</ul>';
    
    document.getElementById("repositories").innerHTML = output;
    
    usersRepos.forEach(repo => {
        let output2 = "";
        if (repo.languages) {
            let totalBytes = 0;
            for(const value of Object.values(repo.languages)) {totalBytes += value;}
            Object.getOwnPropertyNames(repo.languages).forEach(lang => {
                let percentTotal = Math.round(((repo.languages[lang] / totalBytes) * 100) * 10) / 10;
                output2 += `<li class="repo-language">${lang} ${percentTotal}%</li>`;
            });
        }
        
        document.getElementById("repo-" + repo.id + "-languages").innerHTML = output2;
    });
}

async function retrieveUsersName (userLogin) {
    let response;
    try {
        response = await fetch(`https://api.github.com/users/${userLogin}`);
        response = await response.json();
    } catch (error) {
        console.log(
            `The following error occured while retrieving the user's name.
            ${error}`
        );
        response = error;
    }
    
    return await response;
}

async function retrieveUsersRepos (reposUrl) {
    let response;
    try {
        response = await fetch(reposUrl + "?sort=updated");
        response = await response.json();
        // console.log(response);
        response = await response.map(async repo => await retrieveRepoDetails(repo.url));
        response = await Promise.allSettled(response);
        response = response.map(value => value.value);
    } catch (error) {
        console.log(
            `The following error occured while retrieving the user's repos.
            ${error}`
        );
        response = error;
    }
    // console.log(response);
    return await response;
}

async function retrieveRepoDetails (repoUrl) {
    let response;
    try {
        response = await fetch(repoUrl);
        response = await response.json();
        let langRes = await fetch(response.languages_url);
        langRes = await langRes.json();
        // console.log(response.name);
        // console.log(langRes);
        response.languages = langRes;
    } catch (error) {
        console.log(
            `The following error occured while retrieving the repo's details.
            ${error}`
        );
        response = error;
    }
    
    // console.log(response);
    return await response;
}