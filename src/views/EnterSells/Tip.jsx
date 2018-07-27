import React from 'react';

const Tip = () => (
  <div className="ant-table ant-table-small ant-table-bordered ant-table-scroll-position-left">
    <div className="ant-table-content">
      <div className="ant-table-body">
        <table>
          <tbody className="ant-table-tbody">
            <tr className="ant-table-row">
              <td rowSpan="4" width="72">期初</td>
              <td>期初正库存数量</td>
              <td>时间为查询时间开始的当天账面库存&gt;0的数量总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td>期初正库存金额</td>
              <td>时间为查询时间开始的当天账面库存&gt;0的金额总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td>期初负库存数量</td>
              <td>时间为查询时间开始的当天账面库存&lt;0的数量总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td>期初负库存金额</td>
              <td>时间为查询时间开始的当天账面库存&lt;0的金额总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td rowSpan="4">进货</td>
              <td>自行进货数量</td>
              <td>单据类型为自行收货的进货数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>自行进货金额</td>
              <td>单据类型为自行收货的进货金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td>收货数量</td>
              <td>单据类型为提单收货的进货数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>收货金额</td>
              <td>单据类型为提单收货的进货金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td height="180" rowSpan="6">销售</td>
              <td>同级理货数量</td>
              <td width="379">
                单据类型为：零售单、零售退货单、批发单、批发退货单，并且往来单位为经销商的销售数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>同级理货金额</td>
              <td width="379">
                单据类型为：零售单、零售退货单、批发单、批发退货单，并且往来单位为经销商的销售金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td>批发数量</td>
              <td width="379">往来单位是伞下店的零售和批发数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>批发金额</td>
              <td width="379">往来单位是伞下店的零售和批发金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td>零售数量</td>
              <td width="379">往来单位是：对销售单零售、工程客户、企业客户的零售和批发数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>零售金额</td>
              <td width="379">往来单位是：对销售单零售、工程客户、企业客户的零售和批发金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td height="220" rowSpan="6">期末</td>
              <td>期末正库存数量</td>
              <td>时间为查询时间结束的当天账面库存&gt;0的数量总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td>期末正库存金额</td>
              <td>时间为查询时间结束的当天账面库存&gt;0的金额总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td>期末负库存数量</td>
              <td>时间为查询时间结束的当天账面库存&lt;0的数量总和。</td>
            </tr>
            <tr height="22">
              <td height="22">期末负库存金额</td>
              <td>时间为查询时间结束的当天账面库存&lt;0的金额总和。</td>
            </tr>
            <tr className="ant-table-row">
              <td width="131">周转天数（数量）</td>
              <td width="379">
                期末库存数量/倒推30天销售正品的日均销数量。注：如果查询期末日期-开账日期&lt;30天，按照
                期末库存数量/（查询期末日期-开账日期）天销售正品的日均销数量 计算。</td>
            </tr>
            <tr className="ant-table-row">
              <td>周转天数（金额）</td>
              <td width="379">
                期末库存金额/倒推30天销售正品的日均销金额。注：如果查询期末日期-开账日期&lt;30天，按照
                期末库存金额/（查询期末日期-开账日期）天销售正品的日均销金额 计算。</td>
            </tr>
            <tr className="ant-table-row">
              <td height="108" rowSpan="4">其它入库</td>
              <td>报溢数量</td>
              <td width="379">单据类型为报溢单进货数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>报溢金额</td>
              <td width="379">单据类型为报溢单进货金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td>其他数量</td>
              <td width="379">
                单据类型不是提单收货、报溢单、自行收货、期初导入的其他类型的进货数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>其他金额</td>
              <td width="379">
                单据类型不是提单收货、报溢单、自行收货、期初导入的其他类型的进货金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td rowSpan="4">其他出库</td>
              <td>报损数量</td>
              <td width="379">单据类型为报损单的销售数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>报损金额</td>
              <td width="379">单据类型为报损单的销售金额。</td>
            </tr>
            <tr className="ant-table-row">
              <td>其他数量</td>
              <td width="379">单据类型为赠送单、委托发货单的销售数量。</td>
            </tr>
            <tr className="ant-table-row">
              <td>其他金额</td>
              <td width="379">单据类型为赠送单、委托发货单的销售金额。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
export default Tip;
