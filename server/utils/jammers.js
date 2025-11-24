// jammers.js
const jammers = []; 

const jammerJoin = (id, username, jamName) => {

  const user = { id, username, jamName };

  const existingUser = jammers.find(j => j.username === username);

  if (existingUser) {
    existingUser.id = id;
  } else {
    jammers.push(user);
  }

  console.log("Current jammers:", jammers);
  return user;
};

module.exports = jammerJoin;
