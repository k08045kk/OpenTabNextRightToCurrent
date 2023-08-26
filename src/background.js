/**
 * バックグラウンド処理
 */

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
    // アクティブタブ（ウィンドウ・タブコンテキストメニュー・ショートカット）
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
  
  // 備考：原則として、 Firefox のタブ挙動を模倣します。
  // 備考：新規タブを生成しないページ移動は、影響を受けません。
  //       新規タブが以前に開いたタブの場合、影響を受けません。
  //       新規タブが親のいないタブの場合、影響を受けません。
  //       新規タブがアクティブタブの場合、影響を受けません。
  //       上記以外の場合、カレントタブの右隣に開きます。
  // 備考：次の動作は、影響を受けます。
  //         カレントタブからの新規タブは、カレントタブの右隣に開きます。
  //         ２つめ以降の新規タブも、カレントタブの右隣に開きます。
  //         ピン留めされている場合、最後のピン留めタブの右隣に開きます。
  //       次の動作は、影響を受けません。
  //         ウィンドウからの新規タブは、ウィンドウの右端に開きます。
  //         ショートカットからの新規タブは、ウィンドウの右端に開きます。
  //         ブックマークからの新規タブは、ウィンドウの右端に開きます。
  //         リーディングリストからの新規タブは、ウィンドウの右端に開きます。
  //         履歴からの新規タブは、ウィンドウの右端に開きます。
  //         タブコンテキストメニューからの新規タブは、カレントタブの右端に開きます。
  //         閉じたタブを開くは、元の場所に開きます。
  //         ウィンドウの復元は、元の状態で開きます。
  //       他の拡張機能または設定と干渉する場合は、この限りではありません。
};


chrome.tabs.onCreated.addListener(moveTab);

