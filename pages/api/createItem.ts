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

      let data = req.body;

      return collection.insert({
        version:                    data.version,
        supportedHardwareVersions:  data.supportedHardwareVersions,
        minimumAppVersion:          data.minimumAppVersion,
        dependsOnFirmwareVersion:   data.minimumFirmwareVersion,
        dependsOnBootloaderVersion: data.minimumBootloaderVersion,
        sha1hash:                   data.sha1hash,
        downloadUrl:                data.downloadUrl,
        releaseNotes: {
          en : data.releaseNotesEN,
          nl : data.releaseNotesNL,
          de : data.releaseNotesDE,
          es : data.releaseNotesFR,
          it : data.releaseNotesES,
          fr : data.releaseNotesIT,
        },
        releaseLevel: data.releaseLevel,
      })
    })
    .then((result) => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      mongo.close()
      res.end(JSON.stringify({}))
    })
}