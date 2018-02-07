/**
 * Helper function that returns an object specifying
 * the style for a full container background image
 *
 * @args:
 *   {str} url: the url to an image file
 * @returns:
 *   {obj}: a style object that creates a background image
 *     given that url
 **/

module.exports = url => {
  return {
    backgroundImage: "url(" + url + ")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
  };
};
