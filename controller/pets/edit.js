const { Pets, PetsImages } = require("../../models");
const { s3 } = require("../../routes/multer");
// const fs = require("fs");

module.exports = async (req, res) => {
  // const test = fs.readdir("uploads", filelist);
  // console.log("test:", test);

  // const { id } = req.user;

  // const {
  //   title,
  //   petname,
  //   missingDate,
  //   description,
  //   species,
  //   reward,
  // } = req.body;

  // await Pets.update(
  //   {
  //     title,
  //     petname,
  //     missingDate,
  //     description,
  //     species,
  //     reward,
  //   },
  //   {
  //     where: {
  //       userid: id,
  //     },
  //   }
  // );

  // const updatePet = await Pets.findOne({
  //   where: { userid: id },
  // });

  // const imageRegister = req.files.reduce((acc, file) => {
  //   const fileObj = {
  //     imagePath: file.path,
  //     petId: updatePet.id,
  //   };
  //   acc.push(fileObj);
  //   return acc;
  // }, []);

  // const checkPetImg = await PetsImages.findAll({
  //   where: { petId: updatePet.id },
  // });

  // // const test = checkPetImg.map((obj) => obj.dataValues.imagePath);

  // // petsImages 테이블 imagePath에 담겨진 이미지 저장 경로를 가져와서 앞에 uploads 없애고 새로운 배열로
  // const serchImg = checkPetImg.map((obj) => obj.dataValues);
  // const newArr = [];
  // serchImg.filter((el) => {
  //   newArr.push(el.imagePath.replace("uploads/", ""));
  // });

  // console.log("newArr:", newArr);

  // // 올리려는 이미지 개수에 따라 다르게 처리
  // if (imageRegister.length === 3) {
  //   await PetsImages.destroy({
  //     where: { petId: updatePet.id },
  //   });

  //   // uploads 폴더에 있는 이미지 삭제
  //   for (let i = 0; i < 3; i++) {
  //     fs.unlinkSync(`uploads/${newArr[i]}`);
  //   }

  //   await PetsImages.bulkCreate(imageRegister);
  //   return res.status(201).json({ message: "edit OK" });
  // }
  // if (imageRegister.length === 2 && checkPetImg.length === 3) {
  //   await PetsImages.destroy({
  //     where: { petId: updatePet.id },
  //     limit: 2,
  //   });

  //   for (let i = 0; i < 2; i++) {
  //     fs.unlinkSync(`uploads/${newArr[i]}`);
  //   }

  //   await PetsImages.bulkCreate(imageRegister);
  //   return res.status(201).json({ message: "edit OK" });
  // }
  // if (imageRegister.length === 2 && checkPetImg.length === 2) {
  //   await PetsImages.destroy({
  //     where: { petId: updatePet.id },
  //     limit: 1,
  //   });

  //   for (let i = 0; i < 1; i++) {
  //     fs.unlinkSync(`uploads/${newArr[i]}`);
  //   }

  //   await PetsImages.bulkCreate(imageRegister);
  //   return res.status(201).json({ message: "edit OK" });
  // }
  // if (imageRegister.length === 1 && checkPetImg.length === 3) {
  //   await PetsImages.destroy({
  //     where: { petId: updatePet.id },
  //     limit: 1,
  //   });

  //   for (let i = 0; i < 1; i++) {
  //     fs.unlinkSync(`uploads/${newArr[i]}`);
  //   }

  //   await PetsImages.bulkCreate(imageRegister);
  //   return res.status(201).json({ message: "edit OK" });
  // } else {
  //   await PetsImages.bulkCreate(imageRegister);
  //   res.status(201).json({ message: "edit OK" });
  // }

  const {
    petId,
    title,
    petname,
    area,
    sex,
    missingDate,
    description,
    species,
    reward,
  } = req.body;
  const { id } = req.user;
  const imageFiles = req.files;

  const compareUser = await Pets.findOne({
    where: { userId: id },
  });
  if (compareUser.userId !== id) {
    return res.status(400).json({ message: "not Authorized" });
  }

  const findImages = await PetsImages.findAll({
    where: { petId },
    attributes: ["imagePath"],
  });

  if (req.files.length) {
    const fileUrls = [];
    for (let i = 0; i < findImages.length; i += 1) {
      if (findImages[i].imagePath) {
        const fileUrl = findImages[i].imagePath.split("/");
        const delFileName = fileUrl[fileUrl.length - 1];
        fileUrls.push({ Key: delFileName });
      }
    }

    const params = {
      Bucket: "missing-animals-images",
      Delete: { Objects: fileUrls },
    };
    s3.deleteObjects(params, (err) => {
      if (err) throw err;
    });

    const imageArray = imageFiles.reduce((acc, img) => {
      const obj = {
        petId,
        imagePath: img.location,
      };
      acc.push(obj);
      return acc;
    }, []);

    await PetsImages.destroy({ where: { petId } });
    await PetsImages.bulkCreate(imageArray);
    await Pets.update(
      { thumbnail: imageArray[0].imagePath },
      { where: { id: petId } }
    );
  }

  await Pets.update(
    {
      title,
      petname,
      area,
      sex,
      missingDate,
      description,
      species,
      reward,
    },
    { where: { id: petId } }
  );

  res.status(201).json({ message: "edit OK" });
};
