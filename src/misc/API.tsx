async function loadData(url: string): Promise<any> {
    const response: Response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
    });

    if (response.ok) {
        return response.json();
    }

    switch (response.status) {
        case 403:{
            console.log('seems like requests limit exceeded');
            break;
        }
        case 404:{
            console.log('something went wrong in loadData()');
            break;
        }
    } 
    return null;
}

async function getRawDataPerPage(urlPart: string) {
    const itemPerPage: number = 100;
    let currentPage: number = 1;
    const resultArray: any = [];
    while (true) {
        const url: string = `${urlPart}?per_page=${itemPerPage}&page=${currentPage}`;
        const result = await loadData(url);
        if (!result) {
            break
        }
        resultArray.push(...result);
        currentPage++;
        if (result.length < itemPerPage) {
            break;
        }
    }
    return resultArray;
}

export async function getRawContributers(owner: string, repos: string): Promise<any> {
    const url = `https://api.github.com/repos/${owner}/${repos}/contributors`
    return getRawDataPerPage(url);
}

export async function getRawUserRepos(owner: string): Promise<any> {
    const url = `https://api.github.com/users/${owner}/repos`
    return getRawDataPerPage(url);
}
