import BaseService from '../../model/BaseService'
import _ from 'lodash'
import team from '../../store/redux/team';

export default class extends BaseService {
    // Send
    async bet(_team, _betAmount) {
        const store = this.store.getState()
        let methods = store.contract.serc.methods
        let balance = store.user.balance
        console.log('current balance', balance)
        let toDeposit = _betAmount > balance ? _betAmount - balance : 0
        console.log('to deposit:', toDeposit)
        let uintTeam = _team === true ? 1 : 0
        console.log('team', uintTeam)
        let diceAddress = store.contract.dapps.simpleDice._address
        console.log('dice address', diceAddress)
        let wallet = store.user.walletAddress
        return await methods.transfer(diceAddress, _betAmount.toString(), [uintTeam]).send({from: wallet, value: toDeposit})
    }

    async endRound() {
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let wallet = store.user.walletAddress
        return await methods.endRound().send({from: wallet})
    }

    async forcedEndRound() {
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let wallet = store.user.walletAddress
        return await methods.forcedEndRound().send({from: wallet})
    }

    async playagain() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        this.resetBets()
        await this.dispatch(simpleDiceRedux.actions.pause_update(false))
    }

    // Call

    async getCurRoundId() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let curRoundId = await methods.curRoundId().call()
        await this.dispatch(simpleDiceRedux.actions.curRoundId_update(curRoundId))
        return await curRoundId
    }

    async getAddress() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let diceAddress = store.contract.dapps.simpleDice._address
        console.log('dice address', diceAddress)
        await this.dispatch(simpleDiceRedux.actions.address_update(diceAddress))
        return await diceAddress
    }

    async getBetSum() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let betSum = [await methods.betSum(true).call(), await methods.betSum(false).call()]
        await this.dispatch(simpleDiceRedux.actions.betSum_update({true: betSum[0], false: betSum[1]}))
        return await betSum
    }

    async getKeyBlock() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let keyBlock = await methods.keyBlock().call()
        await this.dispatch(simpleDiceRedux.actions.keyBlock_update(keyBlock))
        return await keyBlock
    }

    async getEndTime() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let endTime = await methods.endTime().call()
        await this.dispatch(simpleDiceRedux.actions.endTime_update(endTime))
        return await endTime
    }

    async getStarted() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let started = await methods.started().call()
        await this.dispatch(simpleDiceRedux.actions.started_update(started))
        return await started
    }

    async getLocked() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let locked = await methods.locked().call()
        await this.dispatch(simpleDiceRedux.actions.locked_update(locked))
        if (await locked) {
            console.log('pause')
            await this.dispatch(simpleDiceRedux.actions.pause_update(true))
        } else {
            //console.log('not pause')
        }
        return await locked
    }

    async getPause() {
        const store = this.store.getState()
        return store.simpleDice.pause
    }

    async getFinalized() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let finalized = await methods.finalized().call()
        await this.dispatch(simpleDiceRedux.actions.finalized_update(finalized))
        return await finalized
    }

    async getWinTeam() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let winTeam = await methods.winTeam().call()
        await this.dispatch(simpleDiceRedux.actions.winTeam_update(winTeam))
        return await winTeam
    }

    async getBetLeng() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        let betLength = await methods.getBetLength().call()
        betLength = {true: betLength[0], false: betLength[1]}
        await this.dispatch(simpleDiceRedux.actions.betLength_update(betLength))
        return await betLength
    }

    async getBetByTeamId(_team, _id) {
        const store = this.store.getState()
        let methods = store.contract.dapps.simpleDice.methods
        return await methods.getBetByTeamId(_team, _id).call()
    }

    async resetBets() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        this.dispatch(simpleDiceRedux.actions.bets_reset())
    }

    async loadFullBets() {
        const simpleDiceRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        if (store.simpleDice.teamLoading === true) return
        await this.dispatch(simpleDiceRedux.actions.teamLoading_update(true))
        let betLength = await this.getBetLeng()
        let loadedTo = store.simpleDice.loadedTo
        let bets = store.simpleDice.bets
        for (let uteam = 0; uteam < 2; uteam++) {
            let team = Boolean(uteam)
            let id = team ? loadedTo.true : loadedTo.false
            while (id < await betLength[team]) {
                let _newBet = await this.getBetByTeamId(team, id)
                let _isCitizen = await store.contract.citizen.methods.isCitizen(await _newBet[0]).call()
                if (await _isCitizen) {
                    let _username = await store.contract.citizen.methods.getUsername(await _newBet[0]).call()
                    _newBet[0] = _username
                }
                team ? bets.true.push(await _newBet) : bets.false.push(await _newBet)
                id++
            }
        }

        this.dispatch(simpleDiceRedux.actions.playersTails_update(bets.true.length))
        this.dispatch(simpleDiceRedux.actions.playersHeads_update(bets.false.length))
        await this.dispatch(simpleDiceRedux.actions.bets_update(await bets))
        await this.dispatch(simpleDiceRedux.actions.betLength_update(await betLength))
        await this.dispatch(simpleDiceRedux.actions.loadedTo_update(await betLength))
        await this.dispatch(simpleDiceRedux.actions.teamLoading_update(false))
        // let methods = store.contract.dapps.simpleDice.methods
        // let loadedTo = store.simpleDice.loadedTo
        // let betLength = await this.getBetLeng()
        // let loadedBets = store.simpleDice.bets
        // console.log('loadedTo', loadedTo)
        // console.log('betLength', betLength)
        // for (let uteam = 0; uteam < 2; uteam++) {
        //     let team = Boolean(1 - uteam)
        //     let id = store.simpleDice.loadedTo[team]
        //     //console.log('test', loadedTo[team], await betLength[team])
        //     while (id < betLength[team]) {
        //         let newBet = await methods.bets(team, id).call()
        //         await console.log('bet', uteam, id, await newBet)
        //         id++
        //         await loadedBets[team].push(newBet)
        //         if (team) {
        //             console.log('updating loadTo', uteam, id)
        //             await this.dispatch(simpleDiceRedux.actions.loadedTo_update({true: id}))
        //         } else {
        //             await this.dispatch(simpleDiceRedux.actions.loadedTo_update({false: id}))
        //         }
        //     }
        // }


        // //let bets = [await methods.bets(true).call(), await methods.bets(false).call()]
        // await console.log('bets', loadedBets)
        // await console.log('loadedTo', store.simpleDice.loadedTo)
        // await this.dispatch(simpleDiceRedux.actions.bets_update({true: loadedBets[true], false: loadedBets[false]}))
        // return await loadedBets
    }
}
