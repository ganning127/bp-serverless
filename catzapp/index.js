function y1k3s() {

    let texts = [];

    for (var i=1; i<5; i++) {
        let value = document.getElementById(`name${i}`).value;
        texts.push(value);
    }

    console.log(texts)
    
    const base64 = getCat(texts);
}

async function getCat(textQuery) {
    const endpoint = `https://song4u.azurewebsites.net/api/twocatz?code=u9Bd5sJvQQOWxXzUpdcRXy4V8tAGAIhC4pOKCUuC9XwFA1yBceoqRQ==`;

    const options = {
        headers: {
            name1: textQuery[0],
            name2: textQuery[1],
            name3: textQuery[2],
            name4: textQuery[3]
        }
    }
    fetch(endpoint, options)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            console.log(data)
            console.log(data.length)

            let imgBase = "data:image/png;base64, ";

            for (var i=1; i<5; i++) {
                console.log(imgBase + data[`name${i}`])
                document.getElementById(`image${i}`).src = imgBase + data[`name${i}`]
            }
            
        })
}