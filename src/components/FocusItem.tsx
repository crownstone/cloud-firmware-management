import {colors} from "../util/colors";
import React from "react";
import {getDescriptiveHardwareString, getReleaseLevel, RELEASE_LEVELS, tableStyle} from "./FirmwareElement";
import {Button} from "@material-ui/core";
import {postData} from "../util/FetchUtil";


export function FocusItem({allElements, id, type, close, refresh}) {
  let data : any = {};
  for (let i = 0; i < allElements.length; i++) {
    if (allElements[i]._id === id) {
      data = allElements[i];
      break;
    }
  }
  let releaseLevel = getReleaseLevel(data.releaseLevel)
  let backgroundColor = releaseLevel == RELEASE_LEVELS.NOBODY ? colors.csOrange.hex : releaseLevel == RELEASE_LEVELS.BETA ? colors.menuTextSelected.rgba(0.6) :'#ddd'

  return (
    <div onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }} style={{margin:'auto', marginTop: 75, width: 1000, height: 600, borderRadius: 20, backgroundColor: colors.white.hex, textAlign:'center'}}>
      <h1>Summary</h1>
      <div style={{display:'inline-block', textAlign:'center'}}>
        <table style={tableStyle} cellPadding={10}>
          <thead>
          <tr>
            <th>Version</th>
            <th>Supported Hardware</th>
            <th>Required App Version</th>
            {type === 'firmware' && <th>Depends on Firmware</th> }
            <th>Depends on Bootloader</th>
            <th>Release Level</th>
          </tr>
          </thead>
          <tbody>
            <tr style={{backgroundColor:backgroundColor}}>
              <td>{data.version}</td>
              <td>{getDescriptiveHardwareString(data.supportedHardwareVersions)}</td>
              <td>{data.minimumAppVersion}</td>
              {type === 'firmware' && <td>{data.dependsOnFirmwareVersion === null ? "null" : data.dependsOnFirmwareVersion}</td>}
              <td>{data.dependsOnBootloaderVersion === null ? "null" : data.dependsOnBootloaderVersion}</td>
              <td>{getReleaseLevel(data.releaseLevel)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{display:'inline-block', textAlign:'center'}}>
        <table style={tableStyle} cellPadding={10}>
          <tbody>
            <tr>
              <th>Release Notes</th>
            </tr>
            <tr>
              <td><span style={{width:400}}>{data.releaseNotes && data.releaseNotes.en || ""}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h1>Release Level</h1>
      <Button variant="contained" style={{backgroundColor: colors.green.hex, color: colors.white.hex, margin:20}}  onClick={() => {
        toLevel(data, type, 0, refresh);
      }}>
        To Public
      </Button>
      <Button variant="contained" style={{backgroundColor: colors.menuTextSelected.hex, color: colors.white.hex, margin:20}}  onClick={() => {
        toLevel(data, type, 50, refresh);
      }}>
        To BETA
      </Button>
      <Button variant="contained" style={{backgroundColor: colors.csOrange.hex, color: colors.white.hex, margin:20}}  onClick={() => {
        toLevel(data, type, 100, refresh);
      }}>
        To ALPHA
      </Button>
      <Button variant="contained" style={{backgroundColor: colors.red.hex, color: colors.white.hex, margin:20}}  onClick={() => {
        toLevel(data, type, 1e7, refresh);
      }}>
        REVOKE
      </Button>
      <h1>DANGER</h1>
      <Button variant="contained" style={{backgroundColor: colors.menuRed.hex, color: colors.white.hex}}  onClick={() => {
        deleteItem(data, type, close, refresh)
      }}>
        DELETE
      </Button>
    </div>
  )
}

function toLevel(data, type, level, refresh) {
  if (confirm("Are you absolutely sure you wish to set \n\n" + type + " v"+data.version + "\n\nTo level:" + getReleaseLevel(level) + "?")) {
    postData('http://localhost:3000/api/setReleaseLevel', {id: data._id, releaseLevel: level, type: type})
      .then(() => {
        refresh()
      })
  }
}


function deleteItem(data, type, close, refresh) {
  if (confirm("Are you absolutely sure you wish to DELETE THIS?")) {
    postData('http://localhost:3000/api/deleteItem', {id: data._id, type: type})
      .then(() => {
        close()
        refresh()
      })
  }
}