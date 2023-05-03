const { ObjectId } = require("mongodb");

class ProductService {
  constructor(client) {
    this.Product = client.db().collection("products");
  }
  extractProductData(payload) {
    const product = {
      type_id: payload.type_id,
      name: payload.name,
      price: parseInt(payload.price) ,
      image: payload.image,
    };
    Object.keys(product).forEach(
      (key) => product[key] === undefined && delete product[key]
    );
    return product;
  }
  
  async create(file, payload) {
    const product = this.extractProductData({...payload,image:file.name});
    const result = await this.Product.insertOne(
      product
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Product.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Product.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id,file, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    var update={};
    if(!file){
      update = this.extractProductData(payload);
    }else{
      update= this.extractProductData({...payload,image:file.name});
    }
    const result = await this.Product.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Product.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}

module.exports = ProductService;
