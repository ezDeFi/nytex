import React, {useState} from 'react';
import userService       from "../../service/UserService"
import {useSelector}     from "react-redux";

userService.fetchData()

const Tx = () => {
  const selector = useSelector(state => {
    return {
      walletAddress: state.user.walletAddress,
      balance: state.user.balance
    }
  })

  const [valueToSend, setValueToSend] = useState(0);

  return (
    <div>
      <p><span>balance:</span><span>{selector.walletAddress}</span></p>
      <p><span>address:</span><span>{selector.balance}</span></p>
      {valueToSend}
      <div>
        <input type="text" value={valueToSend} onChange={(e) => setValueToSend(e.target.value)} />
        <button type="primary" onClick={() => userService.sendTx(valueToSend)} >send</button>
        <br/>
        <button type="primary" onClick={() => userService.getTransactionHistory()} >getTransaction</button>
      </div>
    </div>
  )
}

export default Tx;

// export default connect(mapStateToProps)(Transaction)
