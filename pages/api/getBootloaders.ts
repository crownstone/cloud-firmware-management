import {MongoDbConnector} from "../../src/logic/MongoDBConnector";
import {mongoConfig} from "./sensitive/mongo";

export default (req, res) => {

  let mongo = new MongoDbConnector();
  mongo.connect(mongoConfig)
    .then(() => {
      let firmwareCollection = mongo.dataDb.collection("Bootloader");

      return firmwareCollection.find().toArray();
    })
    .then((result) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      mongo.close()
      res.end(JSON.stringify(result));
    })

}