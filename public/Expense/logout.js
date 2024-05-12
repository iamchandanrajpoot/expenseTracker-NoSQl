const logoutElm = document.getElementById("logout");

logoutElm.addEventListener('click', ()=>{
    localStorage.removeItem('authToken');
    window.location.href = "../Login/login.html"
})