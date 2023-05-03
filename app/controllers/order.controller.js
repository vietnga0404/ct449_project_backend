const OrderService = require("../services/order.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.create(req.body);
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
    const orderService = new OrderService(MongoDB.client);
    documents = await orderService.findAll();
  } catch (error) {
    return next(
      new ApiError(500, "Error findAll")
    );
  }
  return res.send(documents);
};

exports.findByPhone = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.findByPhone(req.params.phone);
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
    const orderService = new OrderService(MongoDB.client);
    document = await orderService.update(req.params.id,req.body);
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

