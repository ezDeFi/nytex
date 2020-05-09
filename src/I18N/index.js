import en from './en'
import vn from './vn'
import kr from './kr'
import cn from './cn'

import _ from 'lodash'

const all = _.extend({}, {
  en,
  vn,
  kr,
  cn
})

let lang = 'en'
export default {
  setLang (str) {
    console.log(str)
    if (_.includes(['en','vn', 'kr', 'cn'], str)) {
      lang = str
    } else {
      throw new Error('invalid lang : ' + str)
    }
  },
  getLang () {
    return lang
  },

  get (key) {
    return _.get(all[lang], key, _.get(all['en'], key, key))
  }
}
