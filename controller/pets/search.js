const axios = require("axios");

module.exports = (req, res) => {
  res.status(200).json({
    filteredList: [
      {
        petsId: "petsId",
        thumbnail: "thumbnail",
        title: "title",
        petname: "petname",
        description: "description",
      },
      {
        petsId: "petsId",
        thumbnail: "thumbnail",
        title: "title",
        petname: "petname",
        description: "description",
      },
    ],
  });
};
