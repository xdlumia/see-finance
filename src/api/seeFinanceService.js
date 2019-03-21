/**
 * @author yanchao 高鹏
 * @description  see-bill-service 的url
 * @date 2018/7/30
 * @update 2018.8.8
 * host:8105
 */

import {
    Api
} from 'see-web-basic'
let baseURL = window.g.ApiUrl

const apiURL = {
    /**
     * @description  获取oss凭证信息
     */

    //根据房源编号、业务编码查询账单信息
    bill: '/fbill/bill',

    //根据业务类型、业务编码查询账单列表（不分页）
    billList: '/fbill/billList',
    getFinanceStat: '/fincomerecord/stat', //流水统计
    getFinanceTableList: '/fincomerecord/list', //流水表格列表默认查询
    saveNewFinance: '/fincomerecord/save', //保存新增流水
    getFurnoverInfo: '/fincomerecord/info', //流水详细信息
    getFinanceBillInfo: '/fincomerecord/listMatch', //流水详细信息账单信息
    deleateItem: '/fincomerecord/deleteBatch', //单个删除
    inFinance: '/fincomerecord/import', //导入流水
    exportFinance: '/fincomerecord/export', //导出流水

    getBillList: '/fbill/queryListPage', //账单列表分类查询
    getBillOrderList: '/fbill/queryListPageOrderBy', //账单列表分类查询
    getQueryItemList: '/fbill/queryByCondition', //账单筛选查询
    getChoiceContract: '/fbill/queryContractByNameOrContractCode', //合同查询
    getSaveNewBill: '/fbill/save', //保存新增
    getBillInfo: '/fbill/queryBillByBillCode', //查询详细信息
    delBillList: '/fbill/delete', //删除
    getBillChangeList: '/fbilladjust/list', //账单调整列表
    saveBillChangeInfo: '/fbilladjust/save', //保存账单调整
    getBillInfoListOfBillId: '/fincomerecord/listByBill', //根据账单id获取流水列表
    saveMatchFinance: '/fincomerecord/saveMatch', //账单新增流水保存
    delBillChangeItem: '/fbilladjust/delete', //账单调整删除
    getMatchChoiceList: '/fincomerecordmatch/list', //匹配选择列表
    delBillFinanceItem: '/fincomerecordmatch/deleteByIncomeIdAndBillId', //账单流水删除
    getExportExcelData: '/fbill/export', //导出表格
    saveMatchItem: '/fincomerecordmatch/saveMatchFromIncomes', //匹配
    queryBillByContractCode: '/fbill/queryBillByContractCode', //根据合同编号查询账单
    queryFbillByHouseCode: '/fbill/queryFbillByHouseCode' // 根据房源code,账单列表
};


export default {
    /**
     * @description  获取oss凭证信息
     */

    bill(params) {
        return Api.get(baseURL.seeFinanceService + apiURL.bill, params);
    },
    billList(params) {
        return Api.get(baseURL.seeFinanceService + apiURL.billList, params);
    },
    getFinanceStat(params) { //流水统计
        return Api.get(baseURL.seeFinanceService + apiURL.getFinanceStat, params)
    },
    getFinanceTableList(params) { //流水表格列表默认查询
        return Api.get(baseURL.seeFinanceService + apiURL.getFinanceTableList, params)
    },
    saveNewFinance(params) { //保存新增流水
        return Api.post(baseURL.seeFinanceService + apiURL.saveNewFinance, params)
    },
    getFurnoverInfo(params) { //流水详细信息
        return Api.get(baseURL.seeFinanceService + apiURL.getFurnoverInfo + '/' + params)
    },
    deleateItem(params) { //删除
        return Api.del(baseURL.seeFinanceService + apiURL.deleateItem, params)
    },
    inFinance(params) { //导入流水
        return Api.post(baseURL.seeFinanceService + apiURL.inFinance, params)
    },
    exportFinance(params) { //道出流水
        return Api.get(baseURL.seeFinanceService + apiURL.exportFinance, params)
    },
    getFinanceBillInfo(params) { //流水账单详细信息
        return Api.get(baseURL.seeFinanceService + apiURL.getFinanceBillInfo + '/' + params)
    },


    /**
     * @description  账单管理
     */
    getBillList(params) { //账单列表分类查询
        return Api.get(baseURL.seeFinanceService + apiURL.getBillList, params)
    },
    getBillOrderList(params) { //账单列表排序查询
        return Api.get(baseURL.seeFinanceService + apiURL.getBillOrderList, params)
    },
    getQueryItemList(params) { //筛选查询
        return Api.get(baseURL.seeFinanceService + apiURL.getQueryItemList, params)
    },
    getChoiceContract(params) { //查询合同
        return Api.get(baseURL.seeFinanceService + apiURL.getChoiceContract, params)
    },
    getBillInfo(params) { //详细合同信息
        return Api.get(baseURL.seeFinanceService + apiURL.getBillInfo, params)
    },
    getSaveNewBill(params) { //保存账单流水
        return Api.post(baseURL.seeFinanceService + apiURL.getSaveNewBill, params)
    },
    delBillList(params) { //删除账单匹配流水
        return Api.del(baseURL.seeFinanceService + apiURL.delBillList, params)
    },
    getBillChangeList(params) { //调整账单列表
        return Api.get(baseURL.seeFinanceService + apiURL.getBillChangeList, params)
    },
    saveBillChangeInfo(params) { //保存调整账单
        return Api.post(baseURL.seeFinanceService + apiURL.saveBillChangeInfo, params)
    },
    getBillInfoListOfBillId(params) { //根据账单id获取流水列表
        return Api.get(baseURL.seeFinanceService + apiURL.getBillInfoListOfBillId + '/' + params)
    },
    saveMatchFinance(params) { //账单新增流水保存
        return Api.post(baseURL.seeFinanceService + apiURL.saveMatchFinance, params)
    },
    delBillChangeItem(params) { //账单调整删除
        return Api.del(baseURL.seeFinanceService + apiURL.delBillChangeItem, params)
    },
    getMatchChoiceList(params) { //流水匹配列表查询
        return Api.get(baseURL.seeFinanceService + apiURL.getMatchChoiceList, params)
    },
    delBillFinanceItem(params) { //账单流水删除
        return Api.del(baseURL.seeFinanceService + apiURL.delBillFinanceItem, params)
    },
    getExportExcelData(params) { //导出表格
        return Api.get(baseURL.seeFinanceService + apiURL.getExportExcelData, params)
    },
    saveMatchItem(params) { //保存匹配
        return Api.post(baseURL.seeFinanceService + apiURL.saveMatchItem, params)
    },
    queryBillByContractCode(params) {
        return Api.get(baseURL.seeFinanceService + apiURL.queryBillByContractCode, params)
    },

    //账单催缴信息查询
    getFbillDunning(params) {
        return Api.get(baseURL.seeFinanceService + '/fbill/queryFbillDunning', params)
    },
    //账单催缴打印预览
    previewDunningFbill(params) {
        return Api.post(baseURL.seeFinanceService + '/fbill/previewDunningFbill', params)
    },
    queryFbillByHouseCode(params) {
        return Api.get(baseURL.seeFinanceService + apiURL.queryFbillByHouseCode, params)
    },
    //关闭账单
    closeFbill(params) {
        return Api.post(baseURL.seeFinanceService + '/fbill/closeFbill', params)
    },
    //添加滞纳金
    saveLateFee(params) {
        return Api.post(baseURL.seeFinanceService + '/fbill/saveLateFee', params)
    },
    //账单催缴(打印)
    dunningFbill(params) {
        return Api.post(baseURL.seeFinanceService + '/fbill/dunningFbillExport', params)
    },
    // 查询账单数据统计信息
    querybillStatistics(params) {
        return Api.get(baseURL.seeFinanceService + '/fbill/queryFillStatistics', params)
    },
    //根据条件统计客户账单数量
    queryFbillClientTypeStatistics(params) {
        return Api.get(baseURL.seeFinanceService + '/fbill/queryFbillClientTypeStatistics', params)
    },
    //未结清快捷检索条件账单数量统计
    getFbillUnclearedStatistics(params) {
        return Api.get(baseURL.seeFinanceService + '/fbill/getFbillUnclearedStatistics', params)
    },
    // 批量打印账单催缴
    betchPrintBill(params) {
        return Api.post(baseURL.seeFinanceService + '/fbill/printFileFbillBatch', params)
    },



    /**
     * @description  发票管理
     */
    //获取发票列表
    getFinvoiceList(params) {
        return Api.get(baseURL.seeFinanceService + '/finvoice/list', params)
    },
    //查看发票列表详细信息
    getFinvoiceInfo(params) {
        return Api.get(baseURL.seeFinanceService + '/finvoice/info/' + params)
    },
    //删除发票列表
    delFinvoiceList(params) {
        return Api.del(baseURL.seeFinanceService + '/finvoice/delete', params)
    },
    //逻辑删除发票列表
    logicdelFinvoiceList(params) {
        return Api.del(baseURL.seeFinanceService + '/finvoice/logicDelete', params)
    },
    //发票合并
    mergeFinvoice(params) {
        return Api.post(baseURL.seeFinanceService + '/finvoice/mergeFinvoice', params)
    },
    //发票打印
    printFinvoice(params) {
        return Api.get(baseURL.seeFinanceService + '/finvoice/printFinvoice', params)
    },
    //发票保存
    saveFinvoice(params) {
        return Api.post(baseURL.seeFinanceService + '/finvoice/save', params)
    },
    //发票拆分
    splitFinvoice(params) {
        return Api.post(baseURL.seeFinanceService + '/finvoice/splitFinvoice', params)
    },
    //发票修改
    updateFinvoice(params) {
        return Api.post(baseURL.seeFinanceService + '/finvoice/update', params)
    },
    // 查询合同发票信息
    getContractInvoice(params) {
        return Api.get(baseURL.seeFinanceService + '/finvoice/getContractInvoice', params)
    },

    /**
     * @description  收据管理
     */
    //获取收据列表
    getFreceiptList(params) {
        return Api.get(baseURL.seeFinanceService + '/freceipt/list', params)
    },
    //查看收据列表详细信息
    getFreceiptInfo(params) {
        return Api.get(baseURL.seeFinanceService + '/freceipt/info/' + params)
    },
    //删除收据列表
    delFreceiptList(params) {
        return Api.del(baseURL.seeFinanceService + '/freceipt/delete', params)
    },
    //逻辑删除收据列表
    logicdelFreceiptList(params) {
        return Api.del(baseURL.seeFinanceService + '/freceipt/logicDelete', params)
    },
    //收据打印
    printFreceipt(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/printFreceipt', params)
    },
    //收据预览
    viewFreceipt(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/viewFreceipt', params)
    },
    //收据保存
    saveFreceipt(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/save', params)
    },
    //收据修改
    updateFreceipt(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/update', params)
    },
    //收据作废 /审核 /驳回
    updateInvalidAudit(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/updateInvalidAudit', params)
    },
    //收据状态变更  收据回收
    updateAuditFreceipt(params) {
        return Api.post(baseURL.seeFinanceService + '/freceipt/updateaudit', params)
    },

}
