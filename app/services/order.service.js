const { ObjectId } = require("mongodb");
class OrderService {
  constructor(client) {
    this.Order = client.db().collection("orders");
  }
  extractOrderData(payload) {
    const order = {
      time_start: new Date().toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh",}),
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      product_name: payload.nameProduct,
      amount: payload.amount,
    };
    Object.keys(order).forEach(
      (key) => order[key] === undefined && delete order[key]
    );
    return order;
  }

  async create(payload) {
    const order = this.extractOrderData(payload);
    const result = await this.Order.insertOne(order);
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const result = await this.Order.findOneAndUpdate(
      filter,
      {
        $set: {
          ...payload,
          time_end: new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
        },
      },
    );
    return result;
  }

  async findAll() {
    const cursor = await this.Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_name",
          foreignField: "name",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);
    return await cursor.toArray();
  }

  async findByPhone(phone) {
    return await this.Order.aggregate([
      {
        $lookup: {
          from: "products",
          let: { nameProduct: "$product_name", phone: "$phone" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$name", "$$nameProduct"] },
                    { $eq: ["$$phone", phone] },
                  ],
                },
              },
            },
          ],
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]).toArray();
  }
}

module.exports = OrderService;
