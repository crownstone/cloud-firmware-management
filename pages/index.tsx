import React, {Component} from 'react'
import fetch from "isomorphic-unfetch"
import {Bootloaders, Firmwares} from "../src/components/FirmwareElement";
import {colors} from "../src/util/colors";
import {FocusItem} from "../src/components/FocusItem";
import {Button} from "@material-ui/core";
import {NewItem} from "../src/components/NewItem";

class IndexPage extends Component<any, any> {

  static async getInitialProps({ req }) {
    const firmwareRequest = await fetch('http://localhost:3000/api/getFirmwares')
    const firmwareData = await firmwareRequest.json()
    const bootloaderRequest = await fetch('http://localhost:3000/api/getBootloaders')
    const bootloaderData = await bootloaderRequest.json()
    return { firmwares: firmwareData, bootloaders: bootloaderData };
  }

  constructor(props) {
    super(props);

    this.state = {
      firmwares: props.firmwares,
      bootloaders: props.bootloaders,
      selectedId: null,
      selectedType: null,
      createNew: false,
      createNewType: null,
    }
  }

  async _refreshData() {
    console.log("REFRESHIGN")
    const firmwareRequest = await fetch('http://localhost:3000/api/getFirmwares')
    const firmwareData = await firmwareRequest.json()
    const bootloaderRequest = await fetch('http://localhost:3000/api/getBootloaders')
    const bootloaderData = await bootloaderRequest.json()
    console.log("GOT THE THING")
    this.setState({firmwares: firmwareData, bootloaders: bootloaderData})
  }

  render() {
    return (
      <div>
        <div
          style={{
            width:'100%', height:'100%',
            position:'absolute', top:0, left:0,
            backgroundColor: colors.csBlue.rgba(0.4),
            display: this.state.selectedId === null ? 'none' : 'block'}}
          onClick={() => { this.setState({selectedId: null})}}
        >
          { this.state.selectedId &&
          <FocusItem
            allElements={this.state.selectedType === 'firmware' ? this.state.firmwares : this.state.bootloaders}
            id={this.state.selectedId}
            type={this.state.selectedType}
            close={() => { this.setState({selectedId: null})}}
            refresh={() => { this._refreshData() }}
          />}
        </div>
        <div style={{width:'100%', height:'100%', position:'absolute', top:0, left:0, backgroundColor: colors.csBlue.rgba(0.4), display: this.state.createNew  ? 'block' : "none"}}>
          { this.state.createNew &&
          <NewItem
            type={this.state.createNewType}
            existingData={{firmware: this.state.firmwares, bootloader: this.state.bootloaders }}
            close={() => { this.setState({createNew: false, createNewType:null})}}
            refresh={() => { this._refreshData() }}
          />}
        </div>
        <div style={{marginLeft:'auto', marginRight:'auto', width: 1500, textAlign:'center'}}>
          <h1 className="title">Firmware</h1>

          <div style={{display:'inline-block', textAlign:'center'}}>
            <Firmwares
              data={this.state.firmwares}
              addFirmare={() => { this.setState({createNew: true, createNewType:'firmware'})}}
              selectCallback={(id) => {
                this.setState({selectedId: id, selectedType: 'firmware'})
              }} />
          </div>
          <br/>
          <br/>
          <br/>
          <h1 className="title">Bootloader</h1>
          <div style={{display:'inline-block', textAlign:'center'}}>
            <Bootloaders
              data={this.state.bootloaders}
              addBootloader={() => { this.setState({createNew: true, createNewType:'bootloader'})}}
              selectCallback={(id) => {
                this.setState({selectedId: id, selectedType: 'bootloader'})
              }} />
          </div>
        </div>
      </div>
    );
  }
}

export default IndexPage
