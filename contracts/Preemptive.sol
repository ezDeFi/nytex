pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "./dex.sol";
import "./Initializer.sol";

contract Preemptive is Initializer {
    using dex for dex.Order;
    using dex for dex.Book;

    // TODO: mapping (hash(haveTokenAddres,wantTokenAddress) => dex.Book)
    mapping(bool => dex.Book) internal books;

    // Minimum amount bump percentage to overwrite the current non-active premptive
    uint256 constant AMOUNT_BUMP = 10;
    uint256 constant LOCK_DURATION = 2 weeks;
    uint256 constant SLASHING_RATE = 10 minutes;
    address constant ZERO_ADDRESS = address(0x0);

    // current best premptive proposal
    Proposal internal currentProposal;

    // current active preemptive
    Absorption internal currentAbsorption;

    struct Proposal {
        // address who make the preemptive initization
        address payable initiator;

        // amount of stable coin will be absorbed
        // positive value mean upper anchor price prediction
        // negative value mean lower anchor price prediction
        int256 amount;

        // NTY amount need to be locked for the preemptive initization
        uint256 value;

        // slashing rate
        uint256 slashingRate;

        // lockdown duration
        uint256 lockdownDuration;
    }

    struct Absorption {
        // address of who initilize the premptive
        // and also the address to receive premptive absorb
        address payable initiator;

        // unlock block number of current active premetive
        // equal to 0 mean non-active premptive
        uint256 unlockBlockNumber;

        // amount of stable coin will be absorbed
        // positive value mean upper anchor price prediction
        // negative value mean lower anchor price prediction
        int256 amount;

        // the final balance that will be released to initiator at unlock time
        // before activing a new premptive
        uint256 balance;

        // slashing rate
        uint256 slashingRate;

        // lockdown duration
        uint256 lockdownDuration;
    }

    modifier unlockable() {
        require(block.number > currentAbsorption.unlockBlockNumber, "is in lock duration of current premptive");
        _;
    }

    modifier activable() {
        require(currentAbsorption.initiator == ZERO_ADDRESS && currentAbsorption.unlockBlockNumber == 0, "current premptive is not finished yet");
        _;
    }

    event AbsorptionActivation(address indexed _initator, int256 _amount, uint256 _value);
    event AbsorptionUnlock(address indexed _initiator, uint256 _amount);
    event AbsorptionAbsorption(address indexed _initiator, uint256 _stb, uint256 _vol);


    // Absorption absorb

    /**
     * @dev anyone can propose a preemptive absorption at anytime
     */
    function propose(int256 amount) external payable {
        uint256 _amount = Math.abs(amount);
        address payable _initiator = currentProposal.initiator;
        uint256 _value = currentProposal.value;
        uint256 _currentAmount = Math.abs(currentProposal.amount);
        if (_amount < _currentAmount.add(_currentAmount.mul(AMOUNT_BUMP).div(100))) {
            revert("your premptive is not good enough compare to current premptive");
        }

        // make new proposal as current proposal
        currentProposal.initiator = msg.sender;
        currentProposal.amount = amount;
        currentProposal.value = msg.value;
        currentProposal.slashingRate = SLASHING_RATE;
        currentProposal.lockdownDuration = LOCK_DURATION;

        // refund for the previous initiator
        if (_value > 0) {
            _initiator.transfer(_value);
        }
    }

    /**
     * @dev cleanup the current premptive lock data,
     * and refund remaining locked amount to premptive initiator after slashing if any.
     */
    function unlockAbsorption() external unlockable {
        uint256 _value = currentAbsorption.balance;
        address payable _receiver = currentAbsorption.initiator;
        currentAbsorption = Absorption(ZERO_ADDRESS, 0, 0, 0, 0, 0);
        if (_value > 0) {
            _receiver.transfer(_value);
        }
        emit AbsorptionUnlock(_receiver, _value);
    }

    /**
     * @dev move current best proposal as current active premptive
     * then clean up the current proposal to accept new proposal for next premptive.
     *
     * Only consensus can call this function.
     * At consensus level, blochchain core will check some conditions
     * (a.k.a initiator deposited enough NTY for slashing) before calling this method.
     */
    function activateAbsorption() external activable returns (bool) {
        require(msg.sender == address(this), "consensus only");
        if (currentProposal.initiator == ZERO_ADDRESS || currentProposal.amount == 0) {
            return false;
        }
        currentAbsorption.initiator = currentProposal.initiator;
        currentAbsorption.amount = currentProposal.amount;
        currentAbsorption.balance = currentProposal.value;
        currentAbsorption.unlockBlockNumber = block.number + currentProposal.lockdownDuration;
        currentAbsorption.slashingRate = currentProposal.slashingRate;
        currentAbsorption.lockdownDuration = currentProposal.lockdownDuration;

        // clean up current proposal to receive proposals for new premtive
        currentProposal = Proposal(ZERO_ADDRESS, 0, 0, 0, 0);

        emit AbsorptionActivation(currentAbsorption.initiator, currentAbsorption.amount, currentAbsorption.balance);
        return true;
    }

    /**
     * @dev return true if there's an active premptive; otherwise, return false
     */
    function hasActiveAbsorption() public view returns (bool) {
        if (currentAbsorption.initiator != ZERO_ADDRESS || currentAbsorption.unlockBlockNumber > 0) {
            return true;
        }
        return false;
    }

    /**
     * @dev the current atmost premptive proposal
     */
    function getCurrentProposal() public view returns (address, int256, uint256) {
        return (currentProposal.initiator, currentProposal.amount, currentProposal.value);
    }

    /**
     * @dev get current active premptive
     */
    function getCurrentAbsorption() public view returns (address, int256, uint256, uint256, uint256, uint256) {
        return (currentAbsorption.initiator, currentAbsorption.amount,
            currentAbsorption.balance, currentAbsorption.unlockBlockNumber, currentAbsorption.slashingRate, currentAbsorption.lockdownDuration);
    }

    /**
     * @dev perform an equivalent premptive absorption (if any) whenever an active/passive absorbs occurs.
     */
    function absorbPreemptive(
        bool inflate,
        uint256 stableTokenTarget
    )
        external
        returns(uint256 totalVOL, uint256 totalSTB)
    {
        require(msg.sender == address(0x0), "consensus only");
        bool orderType = inflate ? Ask : Bid; // inflate by filling NTY sell orders
        dex.Book storage book = books[orderType];
        bool useHaveAmount = book.haveToken == StablizeToken;
        return book.absorbPreemptive(useHaveAmount, stableTokenTarget);
    }

    /**
     * @dev slash the initiator whenever the price is moving in
     * opposition direction with the initiator's direction,
     * the initiator's deposited balance will be minus by _amount
     *
     * _amount is the NTY value need to be burn, calculate in the consensus level
     * _amount = |d/D|*SlashingRate/LockdownDuration
     * d = MedianPriceDeviation
     * D = X/S, X is the amount of NewSD will be absorbed, S is the current NewSD total supply
     * consensus need to update the balance to burn amount return from calling slash function
     *
     * @return the actual NTY amount will be burn
     */
    function slash(uint256 _amount) external returns (uint256) {
        require(msg.sender == address(this), "consensus only");
        if (!hasActiveAbsorption()) {
            revert("no on-going premptive");
        }
        uint256 _balance = currentAbsorption.balance;
        if (_balance < _amount) {
            currentAbsorption.balance = 0;
            return _balance;
        }
        currentAbsorption.balance -= _amount;
        return _amount;
    }
}
