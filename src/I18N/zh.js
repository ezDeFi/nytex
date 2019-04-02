import {TASK_STATUS, CVOTE_STATUS} from '@/constant'
import council from './zh/council'

const zh = {
    // Header
    '0000': 'ALPHA版本',
    '0001': '奖励计划',
    '0002': '社区',
    '0003': '主办单位',
    '0004': '帐户',
    '0005': '小组',
    '0006': '任务',
    '0007': '如何获得ELA',
    '0008': '关于我们',
    '0009': '常见问题',
    '0010': '联系方式',
    '0011': '加入Discord',

    '0100': '开发者',
    '0101': '活动',
    '0102': '社区',
    '0104': '我的Republic',
    '0105': 'CR100',
    '0106': 'CRcles',
    '0107': '大使计划',
    '0108': '筹委会',
    '0109': '提交',
    '0110': '博客',

    '0200': '简介',
    '0201': '登录',
    '0202': '注册',
    '0203': '管理员',
    '0204': '登出',

    '0300': '语言',
    '0301': '英语',
    '0302': '简体中文',

    // Admin breadcrumb
    '1100': '管理员',

    // Admin users
    '1200': '编号',
    '1201': '用户名',
    '1202': '电子邮件',
    '1203': '默认语言',
    '1204': '职能',
    '1205': '活跃',
    '1206': 'ELA',
    '1207': '创建日期',
    '1208': '全名',
    '1209': '国家',

    // Admin navigator
    '1300': '任务',
    '1301': '社区',
    '1302': '用户',
    '1303': '小组',
    '1304': '问题',
    '1305': '表格',

    // Profile navigator
    '2300': '我的资讯',
    '2301': '我的任务',
    '2302': '我的小组',
    '2303': '我的问题',
    '2304': '我的社区',
    '2305': '我的项目',

    'mentions.notFound': '用户不存在',

    'comments': '评论',
    'comments.posts': '动态',
    'comments.post': 'Post',
    'comments.noComments': '还没有评论，抢沙发！',
    'comments.commentsOrUpdates': 'Comments or updates',
    // Admin tasks
    'admin.tasks.status': '状态',

    // Home
    'home.title': 'Elastos - 网络共享',
    'home.developers': '开发者',
    'home.developers.help_1': '编写代码，找出错误，获得ELA',
    'home.developers.help_2': '通过为Elastos生态系统做点点滴滴贡献即可获取ELA',
    'home.developers.help_3': '从示例应用程序到企业App开发。',
    'home.developers.help_4': '您还可以通过发现错误和提交问题赚取ELA。',
    'home.developers.action': '是的，我对Elastos的开发很感兴趣。',
    'home.organizers': '组织者和贡献者',
    'home.organizers.help_1': '帮助组织聚会和推广Elastos',
    'home.organizers.help_2': '无论您是否已成为社区的一员或者想要加入，',
    'home.organizers.help_3':'您在线上、线下或者全球推广Elastos所做出贡献都会获得奖励。',
    'home.organizers.help_4': '您也可以通过成功推荐贡献者以获取ELA。',
    'home.organizers.action_1': '申请成为组织者',
    'home.organizers.action_2': '查看我可以参与的活动和任务',
    'home.summary_1':'我们是由领导者，开发者，组织者和设计师组成的一个多元化民主团体',
    'home.summary_2': '宗旨是在我们的社区推广Elastos，我们欢迎所有人加入。',

    // LoginForm
    'login.label_username': '请输入用户名或邮箱',
    'login.username': '用户名或邮箱',
    'login.label_password': '请输入您的密码',
    'login.password': '密码',
    'login.logged': '保持登录状态',
    'login.forget': '忘记密码',
    'login.submit': '登录',
    'login.reset': '重置密码',
    'login.title': '登录 Cyber Republic',
    'login.description_1': '输入密码',

    // Logout
    'logout.title': '确定登出吗?',

    // ApplyForm
    'apply.form.attachment': '附加档案上传',
    'apply.form.suited': '你觉得你比较适合的理由是什么?',
    'apply.form.prompt': '你最想申请的目的是什么?',

    // RegisterFrom
    'register.title': '成为贡献者',
    'register.description_1': '仅仅需要花费您几秒钟',
    'register.description_2': '作为会员，您可以在CR上申领任务用来获取奖励',
    'register.required': '必填项',
    'register.error.code': '您输入的代码不匹配',
    'register.error.passwords': '您两次输入的密码不匹配',
    'register.error.password_length_1': '您输入的密码必须至少',
    'register.error.password_length_2': '位字母.',
    'register.form.input_code': '请输入您的验证码',
    'register.form.confirmation_code': '验证码',
    'register.form.label_last_name': '请输入您的姓氏',
    'register.form.last_name': '姓氏',
    'register.form.label_first_name': '请输入您的名字',
    'register.form.first_name': '名字',
    'register.form.label_username': '请输入您的用户名',
    'register.error.username': '用户名必须多于6个字符',
    'register.form.username': '用户名',
    'register.form.label_email': '请输入您的邮箱',
    'register.error.email': '无效邮箱',
    'register.error.duplicate_email': '邮箱已被注册',
    'register.form.email': '邮箱',
    'register.form.label_password': '请输入密码',
    'register.form.password': '密码',
    'register.form.label_password_confirm': '请再次输入密码',
    'register.form.password_confirm': '确认密码',
    'register.form.label_country': '请选择你的国家',
    'register.form.option': '请选择一个选项',
    'register.form.about_section': '请简单介绍一下您自己。',
    'register.form.organizer': '你想成为一名活动组织者吗？',
    'register.form.yes': '是的',
    'register.form.no': '不',
    'register.form.developer': '您是软件开发者或者工程师?',
    'register.form.hear': '你从什么渠道知道我们的？',
    'register.code': '我们已向您的电子邮箱发送了确认码。',
    'register.submit': '注册',
    'register.welcome': '欢迎成为Cyber Republic的公民!',
    'register.join_circle': '加入一个圈子并获取ELA',
    'register.join': '加入',
    '3533': '可选项',
    '3534': '国家',
    'register.code.title': '成为公民',

    // Forgot / Reset Password Form
    'forgot.title': '忘记密码？输入邮箱来重置密码',
    'forgot.form.label_email': '请输入邮箱',
    'forgot.form.email': '邮箱',
    'forgot.form.submit': '重置密码',
    'forgot.sent_email': '重置密码邮件已发送',
    'forgot.new_password': '请输入新密码',
    'forgot.success': '修改密码成功',

    // UserEditForm
    'user.edit.form.label_email': '邮箱不能为空',
    'user.edit.form.label_role': '请选择一名角色',
    'user.edit.form.role': '角色',
    'user.edit.form.section.general': '基本资料',
    'user.edit.form.section.social': '社交',
    'user.follow': '关注',
    'user.unfollow': '取消关注',

    // Circle Detail
    'circle.title': '圈子详情',
    'circle.header.join': '加入',
    'circle.header.leave': '离开',
    'circle.header.maxReached': '加入圈子数达到上限',
    'circle.createPost': '发动态',
    'circle.joinToPost': '加入圈子发动态',
    'circle.registerToPost': '注册账号就可以加入CRcle，发动态',
    'circle.members': '成员',
    'circle.tasks': '任务',
    'circle.posts': '动态',
    'circle.uploadtext': '如果您已经准备好了白皮书, 请将它拖到这里。',
    'circle.uploadhint': '用下面的评论功能与项目负责人对话，并查找更多信息。',

    // General
    'select.placeholder': '请选择',
    '.ok': '确定',
    '.apply': '申请',
    '.cancel': '取消',
    '.edit': '编辑',
    '.upload': '通过点击上传',
    '.yes': '是的',
    '.no': '不是',
    '.loading': '加载中...',
    'ela': 'ELA',


    // Role
    'role.member': '普通会员',
    'role.organizer': '组织者',
    'role.admin': '管理员',

    // Profile
    'profile.localTime': '本地时间',
    'profile.sendMessage': '发送消息',
    'profile.viewProfile': '查看个人资料',
    'profile.editProfile': '编辑个人资料',
    'profile.showPublicProfile': '显示公开的资料',
    'profile.crContributors': 'CR 贡献者',
    'profile.followers': '粉丝',
    'profile.edit': '编辑',
    'profile.publicProfile': '公开的资料',
    'profile.save': '保存',
    'profile.projectsTasks': '项目/任务',
    'profile.view': '查看',
    'profile.community.leave.success': '您已经成功离开了社区',
    'profile.community.table.name': '名称',
    'profile.community.table.geolocation': '地理位置',
    'profile.community.table.type': '类型',
    'profile.community.table.actions': '操作',
    'profile.community.title': '社区名称',
    'profile.community.joincommunity': '加入社区',
    'profile.info.title': '资讯',
    'profile.submission.create': '创建事项',
    'profile.tasks.table.name': '名称',
    'profile.tasks.table.owner': '负责人',
    'profile.tasks.table.category': '分类',
    'profile.tasks.table.type': '类型',
    'profile.tasks.table.date': '日期',
    'profile.tasks.table.created': '已创建',
    'profile.tasks.table.community': '社区',
    'profile.tasks.table.status': '状态',
    'profile.tasks.create.task': '创建任务',
    'profile.detail.thankforinterest': '感谢您的兴趣。',
    'profile.detail.selectoption': '请从下面选出最符合您的情况的选项',
    'profile.detail.complookup': '您想要多少ELA？',
    'profile.detail.solo': '告诉我们您为什么想要加入',
    'profile.detail.form.bid.required': '投标是必需的',
    'profile.detail.upload.whitepaper': '如果您已经准备好了白皮书, 请将它拖到这里。',
    'profile.detail.upload.comment': '用下面的评论功能与项目负责人对话，并查找更多信息。',
    'profile.detail.table.name': '名称',
    'profile.detail.table.action': '操作',
    'profile.detail.noapplications': '还没有任何申请',
    'profile.detail.finding': '资金支持：100k美金或5%的股权或代币/令牌',
    'profile.detail.sendmessage': 'Send Message',
    'profile.detail.comingsoon': 'Coming soon...',

    // Validate Form
    'ambassadors.form.required': '必填项目',
    'ambassadors.form.reason.max': '原因太长',
    'ambassadors.form.suitedreason.max': '适合原因太长',

    // Module Profile
    'profile.detail.requiredlogin': '要发出信息，你必须先登录/注册',
    'profile.detail.columns.type': '类型',
    'profile.detail.columns.name': '名字',
    'profile.detail.columns.date': '日期',
    'profile.detail.profile.title': '你的档案',
    'profile.detail.public': '公共档案',
    'profile.detail.button.edit': '编辑',
    'profile.detail.username': '用户名',
    'profile.detail.role': '角色',
    'profile.detail.email': '邮箱',
    'profile.detail.firstname': '名字',
    'profile.detail.lastname': '姓氏',
    'profile.detail.bio': '履历',
    'profile.detail.gender': '性别',
    'profile.detail.avatar': '头像',
    'profile.detail.country': '国家',
    'profile.detail.timezone': '时区',
    'profile.detail.walletaddress': '钱包地址',
    'profile.detail.tobeorganizer': '你是否相当组织者？',
    'profile.detail.tobeengineer': '你是否软件开发者或工程师？',
    'profile.detail.yes': '是',
    'profile.detail.no': '否'
}

// lang mappings

// TASK_STATUS
zh[`taskStatus.${TASK_STATUS.CREATED}`] = '我创建的'
zh[`taskStatus.${TASK_STATUS.PENDING}`] = '待审核的'
zh[`taskStatus.${TASK_STATUS.APPROVED}`] = '已批准的'
zh[`taskStatus.${TASK_STATUS.ASSIGNED}`] = '已分配的'
zh[`taskStatus.${TASK_STATUS.SUBMITTED}`] = '已提交的'
zh[`taskStatus.${TASK_STATUS.SUCCESS}`] = '成功'
zh[`taskStatus.${TASK_STATUS.DISTRIBUTED}`] = '已结算'
zh[`taskStatus.${TASK_STATUS.CANCELED}`] = '已取消'
zh[`taskStatus.${TASK_STATUS.EXPIRED}`] = '已过期'

zh[`cvoteStatus.${CVOTE_STATUS.DRAFT}`] = 'DRAFT'
zh[`cvoteStatus.${CVOTE_STATUS.PROPOSED}`] = 'PROPOSED'
zh[`cvoteStatus.${CVOTE_STATUS.ACTIVE}`] = 'ACTIVE'
zh[`cvoteStatus.${CVOTE_STATUS.REJECT}`] = 'REJECT'
zh[`cvoteStatus.${CVOTE_STATUS.FINAL}`] = 'FINAL'
zh[`cvoteStatus.${CVOTE_STATUS.DEFERRED}`] = 'DEFERRED'


export default zh
