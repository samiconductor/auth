export default ({
  store: {
    state: { auth }
  },
  route,
  redirect
}) => {
  const login = { name: "login" };
  const onLogin = login.name === route.name;

  if (!auth && !onLogin) {
    return redirect(login);
  }
};
