<script>
import {
    onMount,
    tick
} from 'svelte';
import Loader from '../Loader.svelte';
import {
    SendGetRequest,
    SendPostRequest
} from '../HTTPService';
let isLoading = true;
let name;
let author;
let uploadFileResponse = null;
onMount(async () => {
    let res = await SendGetRequest('http://localhost:8000/getData');
    name = res.name;
    author = res.author;
    isLoading = false;
    await tick();
    document.getElementById("date").value = getInputBindableDate(new Date(res.date));
    document.getElementById("image").addEventListener("change", onSelectFile, false);
});

function getInputBindableDate(date) {

    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let data;

    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };

    data = y + "-" + m + "-" + d;
    return data;
}
async function handleSubmit(event) {
    const fd = new FormData(event.target);
    let json = await SendPostRequest("http://localhost:8000/postData", {
        body: fd
    });
    uploadFileResponse = json;
}

function onSelectFile() {
    let file = document.getElementById("image").files[0];
    if (
        !["image/jpeg", "image/gif", "image/png", "image/svg+xml"].includes(
            file.type
        )
    ) {
        alert("Only images are allowed.");
        return false;
    }
};

function cleanUploadResponse() {
    uploadFileResponse = null;
}
</script>
{#if isLoading}
<Loader/>
    {:else}
    {#if uploadFileResponse==null}
    <div class="container" style="margin-top: 5%;">
        <div class="row">
            <div class="column column-50 column-offset-25">
                <form
                    on:submit|preventDefault={handleSubmit}
                    enctype="multipart/form-data">
                    <div class="container">
                        <label for="name"><b>Name</b></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            id="name"
                            bind:value={name}
                            required />

                        <label for="author"><b>Author</b></label>
                        <input
                            type="text"
                            placeholder="Author"
                            name="author"
                            id="author"
                            bind:value={author}
                            required />

                        <label for="date"><b>Date</b></label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required />
                        <label for="image"><b>Image</b></label>
                        <input type="file" name="image" id="image" required />
                        <button type="submit" class="button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {:else}
    <table>
        <thead>
            <tr>
                <th>Property</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Message</td>
                <td>{uploadFileResponse.msg}</td>
            </tr>
            <tr>
                <td>Identifier</td>
                <td>{uploadFileResponse.id}</td>
            </tr>
            <tr>
                <td>File Location</td>
                <td>{uploadFileResponse.fileLocation}</td>
            </tr>
        </tbody>
    </table>
    <button class="button" on:click={cleanUploadResponse}>Upload Again</button>

    {/if}

    {/if}
