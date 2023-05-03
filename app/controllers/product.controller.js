const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(500).send({ msg: "File is not found" });
    }
    const productService = new ProductService(MongoDB.client);
    const document = await productService.create(req.files.file, req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "Error create")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const productService = new ProductService(MongoDB.client);
    documents = await productService.find({});
  } catch (error) {
    return next(
      new ApiError(500, "Error findAll")
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const document = {};
    const productService = new ProductService(MongoDB.client);
    if(!req.files){
       document = await productService.update(req.params.id,null, req.body);
      
    }else{
       document = await productService.update(req.params.id,req.files.file, req.body);

    }
    if (!document) {
      return next(new ApiError(404, "Not found"));
    }
    return res.send({ message: "Updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Not found"));
    }
    return res.send({ message: "Deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete with id=${req.params.id}`)
    );
  }
};
