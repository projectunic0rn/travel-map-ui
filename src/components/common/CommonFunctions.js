export default function logoutClicked(setUserLoggedIn) {
  localStorage.removeItem("token");
  setUserLoggedIn(false);
}
