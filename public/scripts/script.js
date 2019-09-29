const sendNotification = () => {
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    // const role = document.querySelector("#role").value;
    const userRole = "student";

    fetch(`/submit`, {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            userRole,
            password,
        })
    })
        .then((response) => {
            console.log(response.status);
        });
};