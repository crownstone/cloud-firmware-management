import {colors} from "../util/colors";
import React, {Component} from "react";
import {getDescriptiveHardwareString, tableStyle} from "./FirmwareElement";
import {Button} from "@material-ui/core";
import {postData} from "../util/FetchUtil";
import {checkSemVer, hardwareVersions} from "../util/HardwareVersions";


export class NewItem extends Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      version: "",
      plugs: false,
      builtinZero: false,
      builtinOne: false,
      guidestones: false,
      dongles: false,
      releaseLevel:1e7,
      minimumAppVersion: '',
      minimumFirmwareVersion: null,
      minimumBootloaderVersion: null,
      sha1Hash: '',
      downloadUrl: '',
      releaseNotesEN: '',
      releaseNotesNL: '',
      releaseNotesDE: '',
      releaseNotesFR: '',
      releaseNotesES: '',
      releaseNotesIT: '',
    }
  }


  release() {
    let hardwareHasBeenChosen = false;
    if (this.state.plugs || this.state.builtinZero || this.state.builtinOne || this.state.guidestones || this.state.dongles) {
      hardwareHasBeenChosen = true;
    }

    let firmwareDependencyExists = true;
    let bootloaderDependencyExists = true;

    // check bootloader dependency
    if (this.state.minimumBootloaderVersion !== null) {
      bootloaderDependencyExists = false;
      for (let i = 0; i < this.props.existingData.bootloader.length; i++) {
        let bootloader = this.props.existingData.bootloader[i];
        if (bootloader.version === this.state.minimumBootloaderVersion && bootloader.releaseLevel <= this.state.releaseLevel) {
          // check if this bootloader supports all the hardware types
          let hardwareVersions = getDescriptiveHardwareString(bootloader.supportedHardwareVersions).split(", ");
          let hardwareCheckPassed = true;
          if (this.state.plugs && hardwareVersions.indexOf('Plugs') == -1) {
            hardwareCheckPassed = false;
          }
          if (this.state.builtinZero && hardwareVersions.indexOf('Builtin Zero') == -1) {
            hardwareCheckPassed = false;
          }
          if (this.state.builtinOne && hardwareVersions.indexOf('Builtin One') == -1) {
            hardwareCheckPassed = false;
          }
          if (this.state.guidestones && hardwareVersions.indexOf('Guidestones') == -1) {
            hardwareCheckPassed = false;
          }
          if (this.state.dongles && hardwareVersions.indexOf('USB') == -1) {
            hardwareCheckPassed = false;
          }

          if (hardwareCheckPassed) {
            bootloaderDependencyExists = true;
            break;
          }
        }
      }
    }

    // check firmware dependency
    if (this.props.type === 'firmware') {
      if (this.state.minimumFirmwareVersion !== null) {
        firmwareDependencyExists = false;
        for (let i = 0; i < this.props.existingData.firmware.length; i++) {
          let firmware = this.props.existingData.firmware[i];

          if (firmware.version === this.state.minimumFirmwareVersion && firmware.releaseLevel <= this.state.releaseLevel) {
            // check if this bootloader supports all the hardware types
            let hardwareVersions = getDescriptiveHardwareString(firmware.supportedHardwareVersions).split(", ");
            let hardwareCheckPassed = true;
            if (this.state.plugs && hardwareVersions.indexOf('Plugs') == -1) {
              hardwareCheckPassed = false;
            }
            if (this.state.builtinZero && hardwareVersions.indexOf('Builtin Zero') == -1) {
              hardwareCheckPassed = false;
            }
            if (this.state.builtinOne && hardwareVersions.indexOf('Builtin One') == -1) {
              hardwareCheckPassed = false;
            }
            if (this.state.guidestones && hardwareVersions.indexOf('Guidestones') == -1) {
              hardwareCheckPassed = false;
            }
            if (this.state.dongles && hardwareVersions.indexOf('USB') == -1) {
              hardwareCheckPassed = false;
            }

            if (hardwareCheckPassed) {
              firmwareDependencyExists = true;
              break;
            }
          }
        }
      }
    }

    if (!hardwareHasBeenChosen) {
      alert("DUDE! Pick a hardware version to run this on. Duh....");
    }
    else if (!this.state.version) {
      alert("HEY! Pick a version. Duh....");
    }
    else if (!this.state.sha1Hash) {
      alert("NO! The hash is required. Duh....");
    }
    else if (!this.state.downloadUrl) {
      alert("NO! WE NEED TO DOWNLOAD THE BLOODY FILE! Put in an url! Duh....");
    }
    else if (!bootloaderDependencyExists) {
      alert("Bootloader dependencies are not fulfilled. Double check if the required release level has access to the required version for all hardware types that we allow here.");
    }
    else if (!firmwareDependencyExists) {
      alert("Firmware dependencies are not fulfilled. Double check if the required release level has access to the required version for all hardware types that we allow here.");
    }
    else {
      let supportedHardware = [];
      if (this.state.plugs)       { supportedHardware = [...supportedHardware, ...hardwareVersions.util.getAllPlugs()] }
      if (this.state.builtinZero) { supportedHardware = [...supportedHardware, ...hardwareVersions.util.getAllBuiltIns()] }
      if (this.state.builtinOne)  { supportedHardware = [...supportedHardware, ...hardwareVersions.util.getAllBuiltInOnes()] }
      if (this.state.guidestones) { supportedHardware = [...supportedHardware, ...hardwareVersions.util.getAllGuideStones()] }
      if (this.state.dongles)     { supportedHardware = [...supportedHardware, ...hardwareVersions.util.getAllDongles()] }

      let dataToSend = {
        ...this.state,
        supportedHardwareVersions: supportedHardware
      }
      // jey!
      postData('http://localhost:3000/api/createItem', {...dataToSend, type: this.props.type})
        .then(() => {
          this.props.close();
          this.props.refresh();
        })

    }

  }

  render() {

    let getSemverColor = (val) : string => {
      if (!val) { return colors.white.hex; }
      return checkSemVer(val) ? colors.green.hex : colors.csOrange.hex;
    }

    return (
      <div style={{margin:'auto', marginTop: 75, padding:20, width: 1000, height: 875, borderRadius: 20, backgroundColor: colors.white.hex, textAlign:'center'}}>
        <h1>{"New " + this.props.type}</h1>
        <div style={{display:'inline-block', textAlign:'left'}}>
          <table style={tableStyle} cellPadding={10}>
            <tbody>
            <tr>
              <th>Version</th>
              <td><input value={this.state.version} onChange={(e) => {
                this.setState({version: e.target.value}); }} style={{backgroundColor: getSemverColor(this.state.version) }} /></td>
            </tr>
            <tr>
              <th>Release Level</th>
              <td>
                <input type="radio" name={"releaseLevel"} checked={this.state.releaseLevel === 0}    onChange={(val) => { this.setState({releaseLevel: 0}); }} />Public<br />
                <input type="radio" name={"releaseLevel"} checked={this.state.releaseLevel === 50}  onChange={(val) => { this.setState({releaseLevel: 50}); }} />Beta<br />
                <input type="radio" name={"releaseLevel"} checked={this.state.releaseLevel === 100} onChange={(val) => { this.setState({releaseLevel: 100}); }} />Alpha<br />
                <input type="radio" name={"releaseLevel"} checked={this.state.releaseLevel > 100}   onChange={(val) => { this.setState({releaseLevel: 1e7}); }} />Nobody
              </td>
            </tr>
            <tr>
              <th>Supported Hardware</th>
              <td>
                <input type={'checkbox'} checked={this.state.plugs}       onChange={(e) => { this.setState({plugs: e.target.checked})}}/>Plug<br />
                <input type={'checkbox'} checked={this.state.builtinZero} onChange={(e) => { this.setState({builtinZero: e.target.checked})}}/>Builtin Zero<br />
                <input type={'checkbox'} checked={this.state.builtinOne}  onChange={(e) => { this.setState({builtinOne: e.target.checked})}}/>Builtin One<br />
                <input type={'checkbox'} checked={this.state.guidestones} onChange={(e) => { this.setState({guidestones: e.target.checked})}}/>Guidestone<br />
                <input type={'checkbox'} checked={this.state.dongles}     onChange={(e) => { this.setState({dongles: e.target.checked})}}/>USB
              </td>
            </tr>
            <tr>
              <th>Minimum App Version</th>
              <td><input value={this.state.minimumAppVersion} onChange={(e) => { this.setState({minimumAppVersion: e.target.value}); }} style={{backgroundColor: getSemverColor(this.state.minimumAppVersion) }} /></td>
            </tr>
            {this.props.type === 'firmware' && <tr>
              <th>Requires Firmware Version</th>
              <td><input value={this.state.minimumFirmwareVersion} onChange={(e) => {
                if (e.target.value == "") {
                  this.setState({minimumFirmwareVersion: null})
                  return
                }

                this.setState({minimumFirmwareVersion: e.target.value});
              }} style={{backgroundColor: getSemverColor(this.state.minimumFirmwareVersion) }}/></td>
            </tr>
            }
            <tr>
              <th>Requires Bootloader Version</th>
              <td><input value={this.state.minimumBootloaderVersion} onChange={(e) => {
                if (e.target.value == "") {
                  this.setState({minimumBootloaderVersion: null})
                  return
                }

                this.setState({minimumBootloaderVersion: e.target.value}); }} style={{backgroundColor: getSemverColor(this.state.minimumBootloaderVersion) }} /></td>
            </tr>
            <tr>
              <th>Sha1 Hash</th>
              <td><input value={this.state.sha1Hash} onChange={(e) => { this.setState({sha1Hash: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Download URL</th>
              <td><input value={this.state.downloadUrl} onChange={(e) => { this.setState({downloadUrl: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes English</th>
              <td><input value={this.state.releaseNotesEN} onChange={(e) => { this.setState({releaseNotesEN: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes Nederlands</th>
              <td><input value={this.state.releaseNotesNL} onChange={(e) => { this.setState({releaseNotesNL: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes Deutsch</th>
              <td><input value={this.state.releaseNotesDE} onChange={(e) => { this.setState({releaseNotesDE: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes Franzosisch</th>
              <td><input value={this.state.releaseNotesFR} onChange={(e) => { this.setState({releaseNotesFR: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes Espanyol</th>
              <td><input value={this.state.releaseNotesES} onChange={(e) => { this.setState({releaseNotesES: e.target.value}); }} /></td>
            </tr>
            <tr>
              <th>Release Notes Italiano</th>
              <td><input value={this.state.releaseNotesIT} onChange={(e) => { this.setState({releaseNotesIT: e.target.value}); }} /></td>
            </tr>
            </tbody>
          </table>
          <Button variant="contained" style={{backgroundColor: colors.red.hex, color: colors.white.hex, width: 500}}  onClick={() => { this.release() }}>
            RELEASE
          </Button><br /><br />
          <Button variant="contained" style={{backgroundColor: colors.green.hex, color: colors.white.hex, width: 500}}  onClick={() => { this.props.close(); }}>
            Cancel...
          </Button>
        </div>
      </div>
    )
  }
}



