function getImage() {
    let codeInput = document.getElementById("name");
    if (codeInput.value != '') {
        $('#output').text(codeInput.value + "❤️")
    }
    else {
        $("#output").text("Bruh enter something will you");
    }
}