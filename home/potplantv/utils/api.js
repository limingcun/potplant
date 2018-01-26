const https = 'https://pot.find360.cn/'
const api = {
	https: https,
	// 前端路由
    homeIndex: https + 'home/plant',
    homeOperate: https + 'home/operate',
    homeMange: https + 'home/mange',
    homeLookCheck: https + 'home/look/check',
    homeList: https + 'home/list',
    // 后端路由
    adminPlant: https + 'admin/plant',
    adminPlantImg: https + 'admin/plant/img',
    adminOperate: https + 'admin/operate',
    adminOperateImg: https + 'admin/operate/img',
    adminMange: https + 'admin/mange',
    adminMangeImg: https + 'admin/mange/img',
    setQrcode: https + 'set/qrcode',
    adminApply: https + 'admin/apply',
    adminApplyState: https + 'admin/apply/state',
    // 特色路由
    webInvit: https + 'web/invit',
    webClg: https + 'web/clg',
    wxLogin: https + 'web/wxlogin',
    applyFor: https + 'web/apply'
}
module.exports = api;