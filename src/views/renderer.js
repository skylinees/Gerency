const form = document.querySelector("#form-cliente");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    api.newClientRequest(data)
    let newClient;
    api.newClientResponse((event, data) => console.log(data));
    console.log(newClient);
})