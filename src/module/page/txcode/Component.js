import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToMNTY, weiToNUSD, compileTxCode } from '@/util/help.js'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Input } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
    code:
`IERC20 ntf = IERC20(0x2c783AD80ff980EC75468477E3dD9f86123EcBDa);
NextyGovernance gov = NextyGovernance(0x12345);

uint status = gov.getStatus(msg.sender);
if (status == 1) { // ACTIVE
    gov.leave();
}
uint balance = gov.getBalance(msg.sender);
if (balance < 500 * 10**18) {
    uint need = 500 * 10**18 - balance;
    uint remain = ntf.balanceOf(msg.sender);
    if (remain < need) {
        revert("not enough mineral");
    }
    ntf.approve(address(gov), need);
    gov.deposit(need);
}
gov.join(0x0249528Dccd19bc5E906Fba1A8BB646d3Db73dF0);`,
    functions:
`function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
  if (_i == 0) {
    return "0";
  }
  uint j = _i;
  uint len;
  while (j != 0) {
    len++;
    j /= 10;
  }
  bytes memory bstr = new bytes(len);
  uint k = len - 1;
  while (_i != 0) {
    bstr[k--] = byte(uint8(48 + _i % 10));
    _i /= 10;
  }
  return string(bstr);
}`,
    interfaces:
`interface NextyGovernance {
  function getBalance(address _address) external view returns(uint256);
  function deposit(uint256 _amount) external returns (bool);
  function join(address _signer) external returns (bool);
  function leave() external returns (bool);
  function getStatus(address _address) external view returns(uint256);
}

interface IERC20 {
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address who) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}`,
  }

  async componentDidMount() {
    // this.reload()
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Wallet</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>

            <Row>
              <Col span={6}>
                Wallet:
              </Col>
              <Col span={6}>
                {this.props.wallet}
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Balance:
              </Col>
              <Col span={18}>
                {thousands(weiToMNTY(this.props.balance))} Million NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Token:
              </Col>
              <Col span={18}>
                {thousands(weiToMNTY(this.props.volatileTokenBalance))} MNTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                StableCoin:
              </Col>
              <Col span={18}>
                {thousands(weiToNUSD(this.props.stableTokenBalance))} NEWSD
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <h3 className="text-center">Transaction Code</h3>

            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={4}>Max Value</Col>
              <Col span={20}>
                <Input className="maxWidth"
                  placeholder="maximum coin to spent by this tx code"
                  value={this.state.maxValue}
                  onChange={this.maxValueChange.bind(this)}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                Binary
              </Col>
              <Col span={20}>
                <Input.TextArea className="maxWidth"
                  placeholder="runtime binary can be compiled from the code above"
                  value={this.state.binary}
                  onChange={this.binaryChange.bind(this)}
                  rows={3}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={5} />
              <Col span={6}>
                <Button onClick={() => this.compile()}
                  className="btn-margin-top submit-button maxWidth">⇑ Compile</Button>
              </Col>
              <Col span={2} />
              <Col span={6}>
                <Button onClick={() => this.call()}
                  className="btn-margin-top submit-button maxWidth">Call</Button>
              </Col>
              <Col span={2} />
              <Col span={6}>
                <Button type="primary" onClick={() => this.submit()}
                  className="btn-margin-top submit-button maxWidth">Send</Button>
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                Code
              </Col>
              <Col span={20}>
                <Input.TextArea className="maxWidth"
                  value={this.state.code}
                  onChange={this.codeChange.bind(this)}
                  rows={13}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                Functions
              </Col>
              <Col span={20}>
                <Input.TextArea className="maxWidth"
                  value={this.state.functions}
                  onChange={this.functionsChange.bind(this)}
                  rows={13}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                Interfaces
              </Col>
              <Col span={20}>
                <Input.TextArea className="maxWidth"
                  value={this.state.interfaces}
                  onChange={this.interfacesChange.bind(this)}
                  rows={6}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>txcode</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

call() {
  this.props.call(this.state.binary, this.state.maxValue);
}
  
send() {
  this.props.send(this.state.binary, this.state.maxValue);
}

compile() {
  
}

reload() {
  this.props.reload();
}

maxValueChange(e) {
  this.setState({
    maxValue: e.target.value
  })
}

binaryChange(e) {
  this.setState({
    binary: e.target.value
  })
}

codeChange(e) {
  this.setState({
    code: e.target.value
  })
}

functionsChange(e) {
  this.setState({
    functions: e.target.value
  })
}

intefacesChange(e) {
  this.setState({
    intefaces: e.target.value
  })
}

}
