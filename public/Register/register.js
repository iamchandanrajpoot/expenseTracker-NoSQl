
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", function handleRegister(e) {
  e.preventDefault();
  console.log("ftfytibf")
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    fetch("http://localhost:4000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log(response);
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
            alert(data.message)
            window.location.href = "../Login/login.html"
        }
      })
      .catch((err) => console.log(err));
}
  );

