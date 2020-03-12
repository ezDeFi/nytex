import React         from 'react';
import {useSelector} from "react-redux";

// userService.fetchData()

const Tx = () => {
  const selector = useSelector(state => {
    return {
      walletAddress: state.user.walletAddress,
      balance: state.user.balance
    }
  })

  return (
    <div>
      <p><span>balance:</span><span>{selector.walletAddress}</span></p>
      <p><span>address:</span><span>{selector.balance}</span></p>
      <div>
        <input type="text" />
        <button type="primary">send</button>
      </div>
    </div>
  )
}

export default Tx;

// export default connect(mapStateToProps)(Transaction)
