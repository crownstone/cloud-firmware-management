/**
 * The hardware version is constructed as follows
 *
 *  type + productionRun + housingId + reserved + nordicChipVersion
 *
 * Type is separated into plug, builtin and guidestone at the moment and will be probably expanded in the future
 */
export const hardwareVersions = {
  hardwareVersionElements : {
    types : {
      plugVersions: [
        "10102000100", // ACR01B2A :: CROWNSTONE PLUG
        "10102000200", // ACR01B2B :: CROWNSTONE PLUG
        "10102010000", // ACR01B2C :: CROWNSTONE PLUG
        "10102010300", // ACR01B2G :: CROWNSTONE PLUG
      ],

      builtinVersions: [
        "10103000100", // ACR01B1A :: CROWNSTONE BUILTIN
        "10103000200", // ACR01B1B :: CROWNSTONE BUILTIN
        "10103000300", // ACR01B1C :: CROWNSTONE BUILTIN
        "10103000400", // ACR01B1D :: CROWNSTONE BUILTIN
        "10103010000", // ACR01B1E :: CROWNSTONE BUILTIN
        "10103000500", // ACR01B1E :: CROWNSTONE BUILTIN // renamed by marc
      ],
      guidestoneVersions: [
        "10104010000", // GUIDESTONE
      ],
      dongleVersions: [
        "10105000000",
      ],
      builtinOneVersions: [
        "10106000000", // ACR01B10B
        "10106000100", // ACR01B10C
      ]
    }
  },
  util: {
    getAllVersions() {
      // get all types
      let allTypes = [];
      let categorizedTypes = hardwareVersions.hardwareVersionElements.types;
      let productTypes = Object.keys(categorizedTypes);
      productTypes.forEach((type) => {
        allTypes = allTypes.concat(categorizedTypes[type])
      });

      return allTypes;
    },

    getAllPlugs() {
      return hardwareVersions.hardwareVersionElements.types.plugVersions;
    },

    getAllBuiltIns() {
      return hardwareVersions.hardwareVersionElements.types.builtinVersions;
    },

    getAllBuiltInOnes() {
      return hardwareVersions.hardwareVersionElements.types.builtinOneVersions;
    },

    getAllGuideStones() {
      return hardwareVersions.hardwareVersionElements.types.guidestoneVersions;
    },

    getAllDongles() {
      return hardwareVersions.hardwareVersionElements.types.dongleVersions;
    }
  }
};

/**
 * combine all production numbers with the provided types
 * @param types
 * @returns {Array}
 */
function combineAll(types) {
  let result = [];
  let elements : any = hardwareVersions.hardwareVersionElements;
  types.forEach((type) => {
    elements.productionRuns.forEach((productionRun) => {
      elements.housingIds.forEach((housingId) => {
        elements.reservedData.forEach((reserved) => {
          elements.nordicChipVersions.forEach((nordicChipVersion) => {
            result.push(type + productionRun + housingId + reserved + nordicChipVersion);
          });
        });
      });
    });
  });

  return result;
}



export const checkSemVer = function(str) {
  if (!str) { return false; }

  // a git commit hash is longer than 12, we pick 12 so 123.122.1234 is the max semver length.
  if (str.length > 12) {
    return false;
  }

  let A = str.split('.');

  // further ensure only semver is compared
  if (A.length !== 3) {
    return false;
  }

  return true;
};