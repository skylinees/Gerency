const form = document.querySelector("#form-cliente");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    api.newClientRegister(data)
})