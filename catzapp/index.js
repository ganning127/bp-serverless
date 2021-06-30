function y1k3s() {
    const textToUse = document.getElementById("text").value;

    
    
    const base64 = getCat(textToUse);
}

async function getCat(textQuery) {
    const endpoint = `https://song4u.azurewebsites.net/api/twocatz?code=u9Bd5sJvQQOWxXzUpdcRXy4V8tAGAIhC4pOKCUuC9XwFA1yBceoqRQ==`;

    const options = {
        headers: {
            text: textQuery
        }
    }
    fetch(endpoint, options)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            console.log(data)
            let imgTag = "data:image/png;base64, ";
            document.getElementById("image").src = imgTag + data.cat1
        })
}