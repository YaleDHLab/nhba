module.exports = text => ({
  __html: text.replace(/(?:\r\n|\r|\n)/g, '<br/> '),
});
