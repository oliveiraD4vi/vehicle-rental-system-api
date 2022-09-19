module.exports = {
  getRandomList: async function(list) {
    let randomList = [];

    for (let i = 0; i < 5; i++) {
      const item = list[Math.floor(Math.random() * list.length)];
      randomList.push(item);
    }

    return randomList;
  }
}
