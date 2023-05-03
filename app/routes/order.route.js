const express = require("express");
const orders = require("../controllers/order.controller");
const router = express.Router();

router
  .route("/")
  .get(orders.findAll)
  .post(orders.create)
router
  .route("/:id")
  .put(orders.update)
router
  .route("/:phone")
  .get(orders.findByPhone)

module.exports = router;

