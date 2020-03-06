import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import './style.scss'
import axios from 'axios'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, Modal } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  constructor(props) {
    super(props);


    this.state = {
      BlockNumber: '',
      txdata:[]
    }
}

  async componentDidMount() {
    this.show()
    
    
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>
        <div className="ebp-page">
          <h3 className="text-center">Find data</h3>
          <Row>
            <Col span={3} />
            <Col span={4}>
              Insert block number:
            </Col>
            <Col span={8}>
              <Input className="maxWidth"
                defaultValue={0}                
                onChange = {this.onChangeBL}
              />
            </Col>
            <Col span={1} />
            <Col span={2}>
              <Button type="primary" 
                className="btn-margin-top submit-button maxWidth">Submit</Button>
            </Col>
          </Row>
          <div className="ebp-header-divider dashboard-rate-margin">
          </div>
          <h3 className="text-center">History</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
              <div className="h_Table">
                      
                      <div className="h_Top">
                      <h4>BlockNumber</h4>
                      </div>
                      <div className="h_Top">
                        <h4>Action</h4>
                      </div>                     
                    </div>
              <div>
                {this.state.txdata.map((data, index) => {
                    return (
                      <div className="h_Table">
                        <div className="h_BlockNumber">
                        {data.blockNumber}
                        </div>
                        <div className="h_Action">
                        {data.event.name}<br/>
                        &emsp;&emsp;&emsp;{data.event.param1}<br/>
                        &emsp;&emsp;&emsp;{data.event.param2}<br/>
                        &emsp;&emsp;&emsp;{data.event.param3}<br/>
                        &emsp;&emsp;&emsp;{data.event.param4}<br/>
                        &emsp;&emsp;&emsp;{data.event.param5}
                        </div>                     
                      </div>
                    ) 
                })}
              </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
  

  show=()=>{
    const url = "http://localhost:8888/show"

    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({
        txdata: data
      });
    });
  }
  
  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>History</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
  
  onChangeBL(e) {
    this.setState({
        BlockNumber: e.target.value
    });
  }


  _handleKeyDown = evt => {
    if (evt.key === 'Enter') {
      this.setState({
        // valueInput: evt.target.value
      }, () => {
        // this.connect()
      })
    }
  }

  historiesRender() {
    


    // const columns = [
    //   {
    //     title: 'Block Number',
    //     dataIndex: 'blockNumber',
    //     key: 'blockNumber',
    //   },
    //   {
    //     title: 'event',
    //     dataIndex: 'event',
    //     key: 'blockNumber'
    //   },
    // ]
    // return (<div>
    //   <Table rowKey="seq"
    //     dataSource={Object.values(this.state.txdata)}
    //     columns={columns} />
    // </div>)
  }

}
