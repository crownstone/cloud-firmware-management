import {MongoDbConnector} from "../../src/logic/MongoDBConnector";
import {mongoConfig} from "./sensitive/mongo";
var ObjectID = require('mongodb').ObjectID;

export default (req, res) => {
  let mongo = new MongoDbConnector();
  mongo.connect(mongoConfig)
    .then(() => {
      let collection = null
      if (req.body.type === 'firmware') {
        collection = mongo.dataDb.collection("Firmware");
      }
      else {
        collection = mongo.dataDb.collection("Bootloader");
      }

      return collection.updateOne(
        {_id:ObjectID(req.body.id)},
        { $set: {
            releaseLevel : Number(req.body.releaseLevel),
          },
        },
      )
    })
    .then((result) => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      mongo.close()
      res.end(JSON.stringify({}))
    })
}