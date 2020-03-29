export default function logUserOut(setUserLoggedIn) {
  localStorage.removeItem("token");
  setUserLoggedIn(false);
}
