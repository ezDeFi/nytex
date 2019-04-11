import {TASK_STATUS, CVOTE_STATUS} from '@/constant'
import council from './en/council';

const en = {
    // Header
    '0000': 'ALPHA',
    '0001': 'Bounty Programs',
    '0002': 'Community',
    '0003': 'Organizers',
    '0004': 'Account',
    '0005': 'Teams',
    '0006': 'Tasks',
    '0007': 'Help',
    '0008': 'About',
    '0009': 'FAQ',
    '0010': 'Contact',
    '0011': 'Join Discord',

    '0100': 'Developers',
    '0101': 'Events',
    '0102': 'Community',
    '0104': 'Profile',
    '0105': 'CR100',
    '0106': 'CRcles',
    '0107': 'Ambassadors',
    '0108': 'Council',
    '0109': 'Submissions',
    '0110': 'Blog',

    '0200': 'Profile',
    '0201': 'Login',
    '0202': 'Register',
    '0203': 'Admin',
    '0204': 'Logout',

    '0300': 'Language',
    '0301': 'English',
    '0302': 'Chinese',

    // Admin breadcrumb
    '1100': 'Admin',

    // Admin users
    '1200': 'No',
    '1201': 'Username',
    '1202': 'Email',
    '1203': 'Default language',
    '1204': 'Role',
    '1205': 'Active',
    '1206': 'Ela',
    '1207': 'Created Date',
    '1208': 'Full Name',
    '1209': 'Country',

    // Admin navigator
    '1300': 'Tasks',
    '1301': 'Community',
    '1302': 'Users',
    '1303': 'Teams',
    '1304': 'Issues',
    '1305': 'Forms',

    // Profile navigator
    '2300': 'My Profile',
    '2301': 'My Tasks',
    '2302': 'My Teams',
    '2303': 'My Issues',
    '2304': 'My Communities',
    '2305': 'My Projects',

    'profile.skillsets': 'My Skillsets',

    'mentions.notFound': 'User not found',

    'comments': 'Comments',
    'comments.posts': 'Posts',
    'comments.post': 'Post',
    'comments.noComments': 'No comments yet. Be the first to post!',
    'comments.commentsOrUpdates': 'Comments or updates',
    // Admin tasks
    'admin.tasks.status': 'Status',

    // Home
    'home.title': 'Lottery game run by smart contract on Ethereum',
    'home.developers': 'Developers',
    'home.developers.help_1': 'Write code, find bugs, earn ELA',
    'home.developers.help_2': 'Earn ELA for contributing to the Elastos ecosystem through everything',
    'home.developers.help_3': 'from example apps to enterprise App development.',
    'home.developers.help_4': 'You can also earn ELA for finding bugs and submitting issues.',
    'home.developers.action': 'Yes I am interested in Developing for Elastos',
    'home.organizers': 'Organizers & Contributors',
    'home.organizers.help_1': 'Help organize meetups and promote Elastos',
    'home.organizers.help_2': 'Whether you\'re already part of the community or want to join,',
    'home.organizers.help_3': 'we reward you for various things you do to promote Elastos either online, locally or worldwide.',
    'home.organizers.help_4': 'You can also earn ELA for referring potential contributors.',
    'home.organizers.action_1': 'Apply to be an Organizer',
    'home.organizers.action_2': 'View Events & Tasks I can contribute to',
    'home.summary_1': 'We are a diverse democratic group of leaders, developers, organizers and designers',
    'home.summary_2': 'formed to promote Elastos in our communities. Membership is open to everyone.',

    // LoginForm
    'login.label_username': 'Please input your email address or username',
    'login.username': 'Email',
    'login.label_password': 'Please input your password',
    'login.password': 'Password',
    'login.logged': 'Remember me',
    'login.forget': 'Forgot password',
    'login.submit': 'Go',
    'login.reset': 'Reset password',
    'login.title': 'Login to Cyber Republic',
    'login.description_1': 'Input your credentials below.',

    // Logout
    'logout.title': 'Are you sure you want to logout?',

    // ApplyForm
    'apply.form.attachment': 'Supporting Attachment',
    'apply.form.suited': 'What Makes You Most Suited?',
    'apply.form.prompt': 'What Makes You Like To Apply?',

    // RegisterFrom
    'register.title': 'Become a Contributor',
    'register.description_1': 'This will only take a few seconds.',
    'register.description_2': 'As a member you can sign up for bounties on Cyber Republic.',
    'register.required': 'Required Fields',
    'register.error.code': 'The code you entered does not match',
    'register.error.passwords': 'Two passwords you entered do not match',
    'register.error.password_length_1': 'The password must be at least',
    'register.error.password_length_2': 'characters.',
    'register.form.input_code': 'Please input your code',
    'register.form.confirmation_code': 'Confirmation code',
    'register.form.label_first_name': 'Please input your first name',
    'register.form.first_name': 'First name',
    'register.form.label_last_name': 'Please input your last name',
    'register.form.last_name': 'Last name',
    'register.form.label_username': 'Please input your username',
    'register.error.username': 'Username must be more than 6 characters',
    'register.form.username': 'Username',
    'register.form.label_email': 'Please input your email',
    'register.error.email': 'Invalid email',
    'register.error.duplicate_email': 'This email is already taken, please use other email!',
    'register.error.duplicate_wallet': 'This wallet is already taken, please use other wallet!',
    'register.error.invalid_wallet': 'Invalid wallet address',
    'register.error.duplicate_username': 'This username is already taken, please use other username!',
    'register.form.email': 'Email',
    'register.form.label_password': 'Please input a Password',
    'register.form.password': 'Password',
    'register.form.label_password_confirm': 'Please input your password again',
    'register.form.password_confirm': 'Password confirm',
    'register.form.label_country': 'Please select your country',
    'register.form.option': 'Where are you from?',
    'register.form.about_section': 'Tell us a bit about yourself.',
    'register.form.organizer': 'Do you want to be an organizer?',
    'register.form.yes': 'Yes',
    'register.form.no': 'No',
    'register.form.developer': 'Are you a software developer or engineer?',
    'register.form.hear': 'Where did you hear about us?',
    'register.code': 'We have sent a confirmation code to ',
    'register.submit': 'Register',
    'register.welcome': 'Welcome to the Cyber Republic!',
    'register.join_circle': 'Join a CRcle and earn ELA',
    'register.join': 'Join',
    '3533': 'More about you',
    '3534': 'Country',
    'register.code.title': 'Become a citizen',
    'register.form.walletAddress': 'ERC20 wallet address',
    'register.form.walletAddress.label': 'Please input your ERC20 wallet address',

    // Forgot / Reset Password Form
    'forgot.title': 'Forgot your password? Enter your email to be sent a reset password link.',
    'forgot.form.label_email': 'Please input a email',
    'forgot.form.email': 'Email',
    'forgot.form.submit': 'Reset password',
    'forgot.sent_email': 'Success, if the email matches your user you should receive an email',
    'forgot.new_password': 'Please enter a new password',
    'forgot.success': 'Password changed successfully',

    // UserEditForm
    'user.edit.form.label_email': 'Email is required',
    'user.edit.form.label_role': 'Please select a role',
    'user.edit.form.role': 'Role',
    'user.edit.form.section.general': 'General',
    'user.edit.form.section.social': 'Social',
    'user.follow': 'Follow',
    'user.unfollow': 'Unfollow',

    // Circle Detail
    'circle.title': 'Crcle Detail',
    'circle.header.join': 'Join',
    'circle.header.leave': 'Leave',
    'circle.header.maxReached': 'You can only join 2 CRcles',
    'circle.createPost': 'Create Post',
    'circle.joinToPost': 'Join the CRcle to post',
    'circle.registerToPost': 'Register to join the CRcle and post',
    'circle.members': 'Members',
    'circle.tasks': 'Tasks',
    'circle.posts': 'Posts',
    'circle.uploadtext': 'If you have a whitepaper ready, drag it or click here.',
    'circle.uploadhint': 'Use the Comments below to speak to the Project Owner and find out more.',
    // General
    'select.placeholder': 'Please select',
    '.ok': 'Ok',
    '.apply': 'Apply',
    '.cancel': 'Cancel',
    '.edit': 'Edit',
    '.upload': 'Click to Upload',
    '.yes': 'Yes',
    '.no': 'No',
    '.loading': 'Loading...',
    'ela': 'ELA',

    // Role
    'role.member': 'Member',
    'role.organizer': 'Organizer',
    'role.admin': 'Admin',

    // Profile
    'profile.localTime': 'Local time',
    'profile.sendMessage': 'Send Direct Message',
    'profile.viewProfile': 'View Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.showPublicProfile': 'Public Profile',
    'profile.crContributors': 'CR Contributors',
    'profile.followers': 'Followers',
    'profile.edit': 'Edit',
    'profile.publicProfile': 'Public Profile',
    'profile.save': 'Save',
    'profile.projectsTasks': 'Projects/Tasks',
    'profile.view': 'View',
    'profile.community.leave.success': 'You left community successfully',
    'profile.community.table.name': 'Name',
    'profile.community.table.geolocation': 'Geolocation',
    'profile.community.table.type': 'Type',
    'profile.community.table.actions': 'Actions',
    'profile.community.title': 'Communities',
    'profile.community.joincommunity': 'Joined Communities',
    'profile.info.title': 'Info',
    'profile.submission.create': 'Create Issue',
    'profile.tasks.table.name': 'Name',
    'profile.tasks.table.owner': 'Owner',
    'profile.tasks.table.category': 'Category',
    'profile.tasks.table.type': 'Type',
    'profile.tasks.table.date': 'Date',
    'profile.tasks.table.created': 'Created',
    'profile.tasks.table.community': 'Community',
    'profile.tasks.table.status': 'Status',
    'profile.tasks.create.task': 'Create Task',
    'profile.detail.thankforinterest': 'Thanks for your interest.',
    'profile.detail.selectoption': 'Please select below the option which describes you best.',
    'profile.detail.complookup': 'How much ELA do you want?',
    'profile.detail.solo': 'Tell us why do you want to join',
    'profile.detail.form.bid.required': 'Bid is required',
    'profile.detail.upload.whitepaper': 'If you have a whitepaper ready, drag it or click here.',
    'profile.detail.upload.comment': 'Use the Comments below to speak to the Project Owner and find out more.',
    'profile.detail.table.name': 'Name',
    'profile.detail.table.action': 'Action',
    'profile.detail.noapplications': 'No applications yet',
    'profile.detail.finding': 'Funding: 100k for 5% of the equity or coins/tokens',
    'profile.detail.sendmessage': 'Send Message',
    'profile.detail.comingsoon': 'Coming soon...',

    // Module Profile
    'profile.detail.requiredlogin': 'You must login/register first to send a message',
    'profile.detail.columns.type': 'Type',
    'profile.detail.columns.name': 'Name',
    'profile.detail.columns.date': 'Date',
    'profile.detail.profile.title': 'Your Profile',
    'profile.detail.public': 'Public Profile',
    'profile.detail.button.edit': 'Edit',
    'profile.detail.username': 'Username',
    'profile.detail.role': 'Role',
    'profile.detail.email': 'Email',
    'profile.detail.firstname': 'First Name',
    'profile.detail.lastname': 'Last Name',
    'profile.detail.bio': 'Bio',
    'profile.detail.gender': 'Gender',
    'profile.detail.avatar': 'Avatar',
    'profile.detail.country': 'Country',
    'profile.detail.timezone': 'Timezone',
    'profile.detail.walletaddress': 'Wallet Address',
    'profile.detail.tobeorganizer': 'Do you want to be an organizer?',
    'profile.detail.tobeengineer': 'Are you a software developer or engineer?',
    'profile.detail.yes': 'Yes',
    'profile.detail.no': 'No',

    'from.UserEditForm.username.required': 'Username is required',
    'from.UserEditForm.firstName.required': 'First name is required',
    'from.UserEditForm.lastName.required': 'Last name is required',
    'from.UserEditForm.country.required': 'Please select your country',
    'from.UserEditForm.walletAddress.len': 'Address length error',
    'from.UserEditForm.timezone.placeholder': 'Select Timezone...',
    'from.UserEditForm.telegram.min': 'please enter at least 4 characters',
    'from.UserEditForm.label.firstName': 'First Name',
    'from.UserEditForm.label.lastName': 'Last Name',
    'from.UserEditForm.label.password': 'Password',
    'from.UserEditForm.label.confirm': 'Confirm Password',
    'from.UserEditForm.label.gender': 'Gender',
    'from.UserEditForm.label.wallet': 'Wallet',
    'from.UserEditForm.label.country': 'Country',
    'from.UserEditForm.label.timezone': 'Timezone',
    'from.UserEditForm.label.skillset': 'Skillset',

    'from.UserProfileForm.firstName.required': 'First name is required',
    'from.UserProfileForm.lastName.required': 'Last name is required',
    'from.UserProfileForm.bio.required': 'Biography is required',
    'from.UserProfileForm.upload.avatar': 'Upload Avatar',
    'from.UserProfileForm.upload.banner': 'Upload Banner',
    'from.UserProfileForm.text.firstName': 'First Name',
    'from.UserProfileForm.text.lastName': 'Last Name',
    'from.UserProfileForm.text.slogan': 'Profile Slogan',
    'from.UserProfileForm.text.motto': 'Profile Motto',
    'landing.footer.contacts': 'Contact',
    'landing.footer.termsAndConditions': 'Terms And Conditions'
};

// lang mappings

// TASK_STATUS
en[`taskStatus.${TASK_STATUS.CREATED}`] = 'Created'
en[`taskStatus.${TASK_STATUS.PENDING}`] = 'Pending'
en[`taskStatus.${TASK_STATUS.APPROVED}`] = 'Approved'
en[`taskStatus.${TASK_STATUS.ASSIGNED}`] = 'Assigned'
en[`taskStatus.${TASK_STATUS.SUBMITTED}`] = 'Submitted'
en[`taskStatus.${TASK_STATUS.SUCCESS}`] = 'Success'
en[`taskStatus.${TASK_STATUS.DISTRIBUTED}`] = 'Distributed'
en[`taskStatus.${TASK_STATUS.CANCELED}`] = 'Canceled'
en[`taskStatus.${TASK_STATUS.EXPIRED}`] = 'Expired'

en[`cvoteStatus.${CVOTE_STATUS.DRAFT}`] = 'DRAFT'
en[`cvoteStatus.${CVOTE_STATUS.PROPOSED}`] = 'PROPOSED'
en[`cvoteStatus.${CVOTE_STATUS.ACTIVE}`] = 'ACTIVE'
en[`cvoteStatus.${CVOTE_STATUS.REJECT}`] = 'REJECT'
en[`cvoteStatus.${CVOTE_STATUS.FINAL}`] = 'FINAL'
en[`cvoteStatus.${CVOTE_STATUS.DEFERRED}`] = 'DEFERRED'

export default en
