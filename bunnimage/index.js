function getImage(event) {
    event.preventDefault()
    let nameInput = document.getElementById("name");
    if (nameInput.value != '') {
        $('#output').text("Thanks!")
    }
    else {
        alert("No name error.")
    }
}