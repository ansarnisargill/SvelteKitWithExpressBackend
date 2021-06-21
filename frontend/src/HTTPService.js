export async function SendGetRequest(url) {
    try {
        let response = await fetch(url,
            {
                method: 'GET'
            });
        let json = await response.json();
        return json;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
export async function SendPostRequest(url, data) {
    try {
        data.method="POST";
        let response = await fetch(url,data);
        let json = await response.json();
        return json;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}