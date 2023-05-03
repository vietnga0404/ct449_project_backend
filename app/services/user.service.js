const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }
  extractUserData(payload) {
    const user = {
      _id: payload.account.username,
      name: payload.name ?? payload.account.username,
      phone: payload.phone??"",
      address: payload.address??"",
      account: {
        username: payload.account.username,
        password: payload.account.password,
        permission: payload.account.permission ?? 1,
      },
    };

    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractUserData(payload);
    const salt = await bcrypt.genSalt(10);
    user.account.password = await bcrypt.hash(user.account.password, salt);
    const isExist = await this.User.findOne({ _id: user._id });
    if (!isExist) {
      const result = await this.User.insertOne(user);
      return result;
    }
  }

  async login(payload){
    const user = await this.User.findOne({ "account.username": payload.username });
    if (user) {
      const validPassword = await bcrypt.compare(payload.password, user.account.password);
      if (validPassword) {
        return user;
    } else {
        return false;
    }

  }}

  async find(filter) {
    var cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: id,
    });
    return result.value;
  }
}

module.exports = UserService;
