const form = document.getElementById("signupForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pwd = passwordInput.value || "";

  if (name === ""){
  alert("Name is required")
    return ;
  }
 if(email ==+ ""){
  alert("Email is required")
  return;
 }
  if (pwd.length < 6){
    alert("Password contain minimum 6 character")
    return;
  
    }

  alert("Registration successfull");

  form.reset();
});
