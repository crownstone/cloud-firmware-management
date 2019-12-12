# cloud-firmware-management
firmware-management in NextJS GUI for releases of the firmware

```
npm install
```

or 

```
yarn
```

 to install the requirements.

```
npm run dev
```

to run the server.


Yes. You will need to manually put the mongodb keys in the ./pages/api/sensitive folder or this does nothing.

Create a file called mongo.ts and use this format for the content:

```js
export const mongoConfig = {
  mongoDs: { // LOCAL
    "connector": "loopback-connector-mongodb",
    "name": "data_v1",
    "url": "mongodb://127.0.0.1:27017/data_v1",
  },
  filesDs: { // LOCAL
    "connector": "loopback-component-storage-gridfs",
    "name": "files_v1",
    "url": "mongodb://127.0.0.1:27017/files_v1",
  },
  userDs: { // LOCAL
    "connector": "loopback-connector-mongodb",
    "name": "users_v1",
    "url": "mongodb://127.0.0.1:27017/users_v1",
  },
}
```

The URLs should be enough for the mongodb client to connect to.


Enjoy!