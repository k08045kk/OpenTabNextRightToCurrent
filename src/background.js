/**
 * バックグラウンド処理
 */

const moveTab = async (newTab) => {
  //console.log('newTab', newTab);
  
  if (newTab.status === 'unloaded') {
    // 履歴・閉じたタブを開く・ウィンドウの復元
    return;
  }
  if (!newTab.openerTabId) {
    // ブックマーク・リーディングリスト
    return;
  }
  if (newTab.active === true) {
    // アクティブタブ（ウィンドウ・ショートカット・履歴・タブコンテキストメニュー）
    // 備考：Firefox の target="_blank" を除く（この時点では、まだ非アクティブ扱い）
    return;
  }
  
  
  const openerTab = await chrome.tabs.get(newTab.openerTabId);
  //console.log('openerTab', openerTab);
  if (openerTab && openerTab.windowId === newTab.windowId) {
    // 親タブ（過去のカレントタブ）の右隣へ移動する
    let index = openerTab.index + 1;
    if (openerTab.pinned) {
      // 親タブがピン留めタブの場合、最後のピン留めタブの右隣に移動する
      // 備考：ピン留めタブの途中へ移動する場合、動作が異なる。
      //       Firefox は、無効扱いとなり移動しない。
      //       Chrome は、自動で最後のピン留めタブの右隣に移動する。
      const win = await chrome.windows.get(openerTab.windowId, {populate:true});
      if (win) {
        for (const tab of win.tabs) {
          if (!tab.pinned) {
            index = tab.index;
            break;
          }
        }
      }
    }
    if (index !== newTab.index) {
      //console.log('move', newTab.index, '->', index);
      const movedTab = await chrome.tabs.move(newTab.id, {index:index});
      //console.log('movedTab', movedTab);
    }
    // 備考：openerTab がアクティブ（カレントタブ）であるかを考慮しない
    //       Firefox で非アクティブの可能性がある（target="_blank"）
  }
  
  // 備考：新規タブを生成しないページ移動は、影響を受けません。
  //       新規タブが以前に開いたタブの場合、影響を受けません。
  //       新規タブが親のいないタブの場合、影響を受けません。
  //       新規タブがアクティブタブの場合、影響を受けません。（Firefox target="_blank"を除く）
  //       上記以外の場合、カレントタブ（親タブ）の右隣に開きます。
  // 備考：次の動作は、影響を受けます。
  //         カレントタブからの新規タブは、カレントタブ（親タブ）の右隣に開きます。
  //           ２つめ以降の新規タブも、カレントタブ（親タブ）の右隣に開きます。
  //           ピン留めされている場合、最後のピン留めタブの右隣に開きます。
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
  // 備考：target="_blank" の挙動が Chrome と Firefox で異なる。
  //       Chrome は、カレントタブの右隣に新規タブを開く。
  //       Firefox は、直前に開いたタブの右隣に新規タブを開く。
};


chrome.tabs.onCreated.addListener(moveTab);

