pragma solidity ^0.5.2;

import "./Preemptivable.sol";

/**
 * Seigniorage Shares Stablecoin
 */
contract Seigniorage is Preemptivable {
    constructor (
        address volatileToken,
        address stablizeToken,
        uint initialLockdownDuration,
        uint initialSlashingDuration,
        uint expiration,
        uint duration
    )
        Preemptivable(
            volatileToken,
            stablizeToken,
            initialLockdownDuration,
            initialSlashingDuration,
            expiration,
            duration
        )
        public
    {
        if (volatileToken != address(0)) {
            registerVolatileToken(volatileToken);
        }
        if (stablizeToken != address(0)) {
            registerStablizeToken(stablizeToken);
        }
    }

    function registerTokens(
        address volatileToken,
        address stablizeToken
    )
        public
    {
        registerVolatileToken(volatileToken);
        registerStablizeToken(stablizeToken);
        super.registerTokens(volatileToken, stablizeToken);
    }

    function registerVolatileToken(address token)
        public
    {
        // SellType false
        require(address(VolatileToken) == address(0), "already set");
        VolatileToken = IToken(token);
    }

    function registerStablizeToken(address token)
        public
    {
        // BuyType true
        require(address(StablizeToken) == address(0), "already set");
        StablizeToken = IToken(token);
    }
}