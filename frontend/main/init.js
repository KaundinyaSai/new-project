document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("JWT");

  if (token) {
    console.log("User logged in", token);

    const payload = jwt_decode(token);
    const expiresIn = payload.exp * 1000; // seconds to milliseconds
    const timeToExpire = new Date(expiresIn);

    console.log(`Token expires in ${timeToExpire}`);

    if (Date.now() >= expiresIn) {
      localStorage.removeItem("JWT");
      window.location.href = "/login.html";
    }
  } else {
    console.log("User not logged in");
    window.location.href = "/frontend/login.html";
  }
});
