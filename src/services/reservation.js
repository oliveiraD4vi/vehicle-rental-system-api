module.exports = {
  getTotalValue: async function(d1, d2, value) {
    const diffInMs = new Date(d2) - new Date(d1);
    const diffInDs = diffInMs / (1000 * 60 * 60 * 24);

    return (diffInDs * value).toFixed(2);
  }
}
