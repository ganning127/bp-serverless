function getImage(event) {
    event.preventDefault();
    let nameInput = document.getElementById("username");
    let fileInput = document.getElementById("image");

    if (nameInput.value != '') {
        try {

        
        const endpoint = "https://bunnimage-function.azurewebsites.net/api/bunnimage-upload?code=1p6wLhuQBHpe/0gKVFD8i4ogEd2iRewBtWHTovdAejSOIZH7Y0mT/Q==";

        
        const file = fileInput.files[0];
        var bunniForm = document.getElementById("bunniForm") 
        var payload = new FormData(bunniForm);
        payload.append("file", file)

        const options = {
            method: "POST",
            body: payload,
            headers: {
                'codename': nameInput.value,
              },
        }
        const response = fetch(endpoint, options);

        $('#output').text("Your image has been stored successfully!")

        } catch (e) {
            $('#output').text(e)
        }
    }
    else {
        alert("No name error.")
    }
}



function downloadImage() {
    const username = document.getElementById('downloadusername').value;
    const endpoint = "https://bunnimage-download.azurewebsites.net/api/bunnimage-download?code=73UFuMIMIepi5y4cjICtNQB97putXgyrWPO7OKmEf37fydSIWnjahQ==";
    fetch(endpoint, {
        headers: {
            username: username
        }
    })
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            if (data.success) {
                window.open(data.downloadUri, "_self")
            }
            else {
                $('#output').text("No such filename")
            }
        })

}