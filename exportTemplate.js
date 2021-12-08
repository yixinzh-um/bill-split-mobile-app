import { getMemberModel } from './MemberModel';
import { getItemModel } from './ItemModel';

export function getBillsExportHTML(group) {
  const memberModel = getMemberModel(group);
  const itemModel = getItemModel(group.groupId);
  let memberList = memberModel.getMemberList();
  let itemList = itemModel.itemList

  let summaryTableBody = "";
  let detailTableBody = "";
  for (let member of memberList) {
    let tr = `
      <tr>
        <td>${member.email} </td>
        <td>${member.balance}</td>
      </tr>
    `;
    summaryTableBody += tr;
  }
  for (let item of itemList) {
    let tr = `
      <tr>
        <td>${item.name} </td>
        <td>${item.value}</td>
        <td>${item.payer}</td>
      </tr>
    `;
    detailTableBody += tr;
  }

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body style="text-align: center;">
      <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
        ${group.name} Bills
      </h1>
      <h2 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
        Balance Summary
      </h2>
      <Table style="text-align:center; font-size: 20px; font-family: Helvetica Neue; font-weight: normal; margin: 0 auto;">
        <tr>
          <th>Email</th>
          <th>Balance</th>
        </tr>
        ${summaryTableBody}
      </Table>         
      <h2 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">Details</h2>
      <Table style="text-align:center; font-size: 20px; font-family: Helvetica Neue; font-weight: normal; margin: 0 auto;">
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Payer</th>
        </tr>
        ${detailTableBody}
      </Table> 
    </body>
  </html>
  `;

  return html;
}