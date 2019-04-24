import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import ReferService from '@/service/ReferService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.member.users_loading,
        is_admin: state.user.is_admin,
        list: state.refer.list || [],
        loading_refer: state.refer.loading
    }
}, () => {
    const referService = new ReferService()

    return {
        async getList(params) {
            return referService.getList(params)
        }
    }
})
