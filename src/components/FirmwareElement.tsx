import {hardwareVersions} from "../util/HardwareVersions";
import {colors} from "../util/colors";
import {Button} from "@material-ui/core";

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

export function Firmwares({data, selectCallback, addFirmare}) {
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
        </tr>
        { data.map((firmware) => { count++; return ItemRow({data: firmware, shaded: count % 2, isFirmware:true, selectCallback: selectCallback}); }) }
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

export function Bootloaders({data, selectCallback, addBootloader}) {
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
        { data.map((firmware) => { count++; return ItemRow({data: firmware, shaded: count % 2, isFirmware:false, selectCallback: selectCallback}); }) }
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

function ItemRow({data, shaded, isFirmware, selectCallback}) {
  let releaseLevel = getReleaseLevel(data.releaseLevel)

  return (
    <tr key={data._id} style={{backgroundColor: releaseLevel == RELEASE_LEVELS.NOBODY ? colors.csOrange.hex : (shaded ?
        releaseLevel == RELEASE_LEVELS.BETA ? colors.menuTextSelected.rgba(0.6) :'#ddd' :
        releaseLevel == RELEASE_LEVELS.BETA ? colors.menuTextSelected.rgba(0.3) :"#fff")}}>
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

export function getDescriptiveHardwareString(supportedHardwareVersions) {
  let hardwareArray = []
  if (hasValues(supportedHardwareVersions, all)) { hardwareArray = ['All devices']; }
  else {
    if (hasValues(supportedHardwareVersions, allPlugs      )) { hardwareArray.push('Plugs'); }
    if (hasValues(supportedHardwareVersions, allBuiltIns   )) { hardwareArray.push('Builtin Zero'); }
    if (hasValues(supportedHardwareVersions, allBuiltInOnes)) { hardwareArray.push('Builtin One'); }
    if (hasValues(supportedHardwareVersions, allGuideStones)) { hardwareArray.push('Guidestones'); }
    if (hasValues(supportedHardwareVersions, allDongles    )) { hardwareArray.push('USB'); }
  }
  if (hardwareArray.length == 0) {
    hardwareArray = supportedHardwareVersions;
  }
  let hardwareString = hardwareArray.sort().join(", ");
  return hardwareString;
}



export function getReleaseLevel(releaseLevel) {
  if (releaseLevel == 0) {
    return RELEASE_LEVELS.PUBLIC;
  }
  else if (releaseLevel < 1e6) {
    return RELEASE_LEVELS.BETA;
  }
  else {
    return RELEASE_LEVELS.NOBODY
  }
}

export const RELEASE_LEVELS = {
  PUBLIC: "Public",
  BETA: "BETA",
  NOBODY: "NOBODY"
}