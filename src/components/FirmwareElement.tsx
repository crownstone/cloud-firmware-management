import {hardwareVersions} from "../util/HardwareVersions";
import {colors} from "../util/colors";
import {Button} from "@material-ui/core";
let oldPlugArray = [...hardwareVersions.util.getAllPlugs()];
oldPlugArray.pop();
let oldPlugs            = oldPlugArray;
let allPlugs            = hardwareVersions.util.getAllPlugs();
let allBuiltIns         = hardwareVersions.util.getAllBuiltIns();
let allBuiltInOnes      = hardwareVersions.util.getAllBuiltInOnes();
let allGuideStones      = hardwareVersions.util.getAllGuideStones();
let allDongles          = hardwareVersions.util.getAllDongles();
let all                 = hardwareVersions.util.getAllVersions();

export const tableStyle = {
  borderSpacing:0,
  padding:10
}

export function Firmwares({data, selectCallback, copyCallback, addFirmare}) {
  let count = 0;
  return (
    <table style={tableStyle} cellPadding={10}>
      <tbody>
        <tr>
          <th>Version</th>
          <th>Supported Hardware</th>
          <th>Required App Version</th>
          <th>Depends on Firmware</th>
          <th>Depends on Bootloader</th>
          <th>Download</th>
          <th>Release Notes</th>
          <th>Release Level</th>
          <th></th>
          <th></th>
        </tr>
        { data.map((firmware) => { count++; return ItemRow({data: firmware, shaded: count % 2, isFirmware:true, selectCallback: selectCallback, copyCallback: copyCallback}); }) }
        <tr>
          <td colSpan={9}>
            <div style={{textAlign:'right'}}>
              <Button variant="contained" style={{backgroundColor: colors.green.hex, color: colors.white.hex}}  onClick={() => { addFirmare() }}>
                Add
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function Bootloaders({data, selectCallback, addBootloader, copyCallback}) {
  let count = 0;
  return (
    <table style={tableStyle} cellPadding={10}>
      <tbody>
        <tr>
          <th>Version</th>
          <th>Supported Hardware</th>
          <th>Required App Version</th>
          <th>Depends on Bootloader</th>
          <th>Download</th>
          <th>Release Notes</th>
          <th>Release Level</th>
          <th>Change</th>
        </tr>
        { data.map((firmware) => { count++; return ItemRow({data: firmware, shaded: count % 2, isFirmware:false, selectCallback: selectCallback, copyCallback: copyCallback}); }) }
        <tr>
          <td colSpan={8}>
            <div style={{textAlign:'right'}}>
              <Button variant="contained" style={{backgroundColor: colors.green.hex, color: colors.white.hex}}  onClick={() => { addBootloader() }}>
                Add
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function ItemRow({data, shaded, isFirmware, selectCallback, copyCallback}) {
  let releaseLevel = getReleaseLevel(data.releaseLevel)
  let releaseLevelColor = "#fff"
  switch (releaseLevel) {
    case RELEASE_LEVELS.PUBLIC:
      releaseLevelColor = colors.white.hex; break;
    case RELEASE_LEVELS.BETA:
      releaseLevelColor = colors.menuTextSelected.hex; break;
    case RELEASE_LEVELS.ALPHA:
      releaseLevelColor = colors.csOrange.hex; break;
    case RELEASE_LEVELS.NOBODY:
      releaseLevelColor = colors.red.hex; break;
  }

  return (
    <tr key={data._id} style={{backgroundColor: releaseLevelColor}}>
      <td>{data.version}</td>
      <td>{getDescriptiveHardwareString(data.supportedHardwareVersions)}</td>
      <td>{data.minimumAppVersion}</td>
      {isFirmware && <td>{data.dependsOnFirmwareVersion === null ? "null" : data.dependsOnFirmwareVersion}</td>}
      <td>{data.dependsOnBootloaderVersion === null ? "null" : data.dependsOnBootloaderVersion}</td>
      <td><a href={data.downloadUrl} target="_blank">Link</a></td>
      <td><span style={{width:400}}>{data.releaseNotes && data.releaseNotes.en || ""}</span></td>
      <td>{getReleaseLevel(data.releaseLevel)}</td>
      <td>
        <Button
          variant="contained"
          style={{backgroundColor: colors.csBlue.hex, color: colors.white.hex}}
          onClick={() => { selectCallback(data._id)}}
        >
          Edit
        </Button>
      </td><td>
        <Button
          variant="contained"
          style={{backgroundColor: colors.menuTextSelected.hex, color: colors.white.hex}}
          onClick={() => { copyCallback(data._id)}}
        >
          Copy
        </Button>
      </td>
    </tr>
  )
}

function hasValues(candidate, compareWith) {
  let map = {};
  for (let i = 0; i < candidate.length; i++) { map[candidate[i]] = true}
  for (let i = 0; i < compareWith.length; i++) {
    if (map[compareWith[i]] === undefined) {
      return false
    }
  }
  return true
}
function hasValuesDestructive(candidate, compareWith) {
  let mapOfCandidate = {};
  let mapOfSource = {};
  let result = true;
  for (let i = 0; i < candidate.length; i++) { mapOfCandidate[candidate[i]] = true}
  for (let i = 0; i < compareWith.length; i++) {
    mapOfSource[compareWith[i]] = true;
    if (mapOfCandidate[compareWith[i]] === undefined) {
      result = false
    }
  }


  if (result === true) {
    for (let i = candidate.length-1; i >= 0; i--) {
      if (mapOfSource[candidate[i]] !== undefined) {
        candidate.splice(i,1);
      }
    }
  }


  return result;
}

export function getDescriptiveHardwareString(supportedHardwareVersions) {
  let hardwareArray = []
  let lossyCopy = [];

  if (hasValues(supportedHardwareVersions, all)) { hardwareArray = ['All devices']; }
  else {
    lossyCopy = [...supportedHardwareVersions];
    if      (hasValuesDestructive(lossyCopy, allPlugs ))      { hardwareArray.push('Plugs'); }
    else if (hasValuesDestructive(lossyCopy, oldPlugs ))      { hardwareArray.push('Plugs(ex G)'); }
    if      (hasValuesDestructive(lossyCopy, allBuiltIns   )) { hardwareArray.push('Builtin Zero'); }
    if      (hasValuesDestructive(lossyCopy, allBuiltInOnes)) { hardwareArray.push('Builtin One'); }
    if      (hasValuesDestructive(lossyCopy, allGuideStones)) { hardwareArray.push('Guidestones'); }
    if      (hasValuesDestructive(lossyCopy, allDongles    )) { hardwareArray.push('USB'); }
  }
  let hardwareString = hardwareArray.sort().join(", ");
  if (lossyCopy.length !== 0) {
    if (hardwareArray.length == 0) {
      hardwareString = lossyCopy.sort().join(", ");
    }
    else {
      hardwareString += " and " + lossyCopy.sort().join(", ");
    }
  }
  return hardwareString;
}



export function getReleaseLevel(releaseLevel) {
  if (releaseLevel == 0) {
    return RELEASE_LEVELS.PUBLIC;
  }
  else if (releaseLevel === 50) {
    return RELEASE_LEVELS.BETA;
  }
  else if (releaseLevel === 100) {
    return RELEASE_LEVELS.ALPHA;
  }
  else {
    return RELEASE_LEVELS.NOBODY
  }
}

export const RELEASE_LEVELS = {
  PUBLIC: "Public",
  ALPHA: "ALPHA",
  BETA: "BETA",
  NOBODY: "NOBODY"
}