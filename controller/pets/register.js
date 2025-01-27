const { Pets, PetsImages } = require("../../models");

module.exports = async (req, res) => {
  const { id } = req.user;
  const {
    title,
    petname,
    area,
    sex,
    missingDate,
    description,
    species,
    reward,
    latitude,
    longitude,
  } = req.body;

  const register = await Pets.create({
    title,
    petname,
    area,
    sex,
    missingDate,
    description,
    species,
    reward,
    latitude,
    longitude,
    thumbnail: req.files[0].location,
    userId: id,
  });

  const imageRegister = req.files.reduce((acc, file) => {
    const fileObj = {
      imagePath: file.location,
      petId: register.id,
    };
    acc.push(fileObj);
    return acc;
  }, []);

  await PetsImages.bulkCreate(imageRegister);

  res.status(201).json({ redirectUrl: `pets/detail/${register.id}` });
};
