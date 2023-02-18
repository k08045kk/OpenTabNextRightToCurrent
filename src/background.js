/**
 * バックグラウンド処理
 */
'use strict'


const moveTab = async (newTab) => {
  //console.log('newTab', newTab);
  
  if (newTab.status != 'loading') {
    // 履歴・閉じたタブを開く・ウィンドウの復元
    // complete / unloaded
    return;
  }
  if (!newTab.openerTabId) {
    // ブックマーク・リーディングリスト
    return;
  }
  if (newTab.active === true) {
    // アクティブタブ（ウィンドウ・コンテキストメニュー・ショートカット）
    return;
  }
  
  
  const windowId = newTab.windowId;
  const info = {populate:true};
  const win = await chrome.windows.get(windowId, info);
  if (!win) {
    return;
  }
  //console.log('win', win);
  
  
  let currentTab = null;
  for (const tab of win.tabs) {
    if (tab.active) {
      currentTab = tab;
      break;
    }
  }
  if (!currentTab) {
    return;
  }
  //console.log('currentTab', currentTab);
  
  
  const newIndex = currentTab.index + 1;
  if (newTab.index !== newIndex) {
    //console.log('move', newTab.index, '->', newIndex);
    const movedTab = await chrome.tabs.move(newTab.id, {index:newIndex});
    //console.log('movedTab', movedTab);
  }
  
  // 備考：原則として、 Firefox のタブ挙動に合わせます。
  // 備考：タブを生成しないページ移動は、影響を受けません。
  //       新規タブが以前に開いたタブの場合、影響を受けません。
  //       新規タブが親のいないタブの場合、影響を受けません。
  //       新規タブがアクティブタブの場合、影響を受けません。
  //       新規タブが非アクティブタブの場合、カレントタブの右隣に開きます。
  // 備考：カレントタブからの新規タブは、カレントタブの右隣に開きます。
  //       ２つめ以降の新規タブも、カレントタブの右隣に開きます。
  //       ピン留めされている場合、最後のピン留めタブの右隣に開きます。
  //       ただし、アクティブで開く設定の場合、この限りではありません。
  // 備考：ウィンドウからの新規タブは、ウィンドウの右端に開きます。
  //       コンテキストメニューからの新規タブは、ウィンドウの右端に開きます。
  //       ショートカットからの新規タブは、ウィンドウの右端に開きます。
  //       ただし、非アクティブで開く設定の場合、この限りではありません。
  // 備考：ブックマークからの新規タブは、ウィンドウの右端に開きます。
  //       リーディングリストからの新規タブは、ウィンドウの右端に開きます。
  // 備考：履歴からの新規タブは、ウィンドウの右端に開きます。
  //       閉じたタブを開くは、元の場所に開きます。
  //       ウィンドウの復元は、元の状態で開きます。
};


chrome.tabs.onCreated.addListener(moveTab);

