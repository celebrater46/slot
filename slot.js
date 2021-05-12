"use strict";

{
  // main の中にセクションを配置し、画像とストップボタンを入れる
  class panel {
    constructor() {
      const section = document.createElement("section");
      section.classList.add("panel");

      this.img = document.createElement("img");
      // this.img.src = "img/bell.png";
      
      // リロードするごとにランダム画像を表示する。
      // getRandomImage 前のthisを取ると動かなくなった
      this.img.src = this.getRandomImage();

      this.timeoutId = undefined;

      this.stop = document.createElement("div");
      // this.stop.classList.add("stop");

      // SPINを押さずとも stop が反応してしまうバグを修正するため、
      // 予め stopped クラスを加えておく
      this.stop.classList.add("stop", "stopped");
      this.stop.textContent = "STOP";

      // timeoutId スロットの連続画像表示処理を停止（clear）する
      this.stop.addEventListener("click", () => {

        // 同じstopボタンを3回押すと結果判定処理に移行するのを防ぐ処理
        if (this.stop.classList.contains("stopped")) {
          return;
        }
        this.stop.classList.add("stopped");

        clearTimeout(this.timeoutId);
        spinLeft--;
        if (spinLeft === 0) {

          // 3つめのstopが押されたらspinボタンをアンロック
          spin.classList.remove("spinning");
          spinLeft = 3;
          
          // 各パネル同士を比較するので、panel クラスの外へ配置する
          checkResult();
        }
      });

      section.appendChild(this.img);
      section.appendChild(this.stop);

      const main = document.querySelector("main");
      main.appendChild(section);
    }

    // ランダムイメージのソースを出力する
    getRandomImage() {
      const images = [
        "img/bell.png",
        "img/seven.png",
        "img/cherry.png",
      ];
      return images[Math.floor(Math.random() * images.length)]
    }

    // 出力されたランダムイメージを img タグに仕込む
    // spin() {
    //   this.img.src = this.getRandomImage();
    // }

    // spin()の処理を 50ミリ秒ごとに繰り返す
    spin() {
      this.img.src = this.getRandomImage();
      // setTimeout(() => {
      //   this.spin();
      // }, 50);

      // setTimeout 処理は timeoutId に記憶される
      this.timeoutId = setTimeout(() => {
        this.spin();
      }, 50);
    }

    isUnmatched(p1, p2) {
      // このイメージソースがp1イメージソースと違い
      // なおかつp2イメージソースとも違う場合は true
      // そうでなければ false
      // && は両方の条件を満たすという論理演算子
      // || はどちらか一方を満たすという論理演算子
      // if (this.img.src !== p1.img.src && this.img.src !== p2.img.src) {
      //   return true;
      // } else {
      //   return false;
      // }

      // 上の if 文は以下のように省略可能。
      // この条件があってりゃ true 、そうでなければ false
      return this.img.src !== p1.img.src && this.img.src !== p2.img.src;
    }

    unmatch() {
      this.img.classList.add("unmatch");
    }

    activate() {
      this.img.classList.remove("unmatch");
      this.stop.classList.remove("stopped");
    }
  }

  // スロットが揃ってるかチェック
  function checkResult() {
    // 0番目のパネルが1、2とマッチしてなければ、関数unmatchを実行
    if (panels[0].isUnmatched(panels[1], panels[2])) {
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0], panels[2])) {
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[0], panels[1])) {
      panels[2].unmatch();
    }
  }

  // 画像とストップボタンを入れる処理を3つ含んだ配列。
  const panels = [
    new panel(),
    new panel(),
    new panel(),
  ];

  // 回ってるスロットの数
  let spinLeft = 3;

  // SPINをクリックしたら……
  // ランダムのイメージ src を img タグに仕込む（spin()）のを
  // panels 配列の数ぶん、繰り返す（forEach）！
  const spin = document.getElementById("spin");
  spin.addEventListener("click", () => {

    // SPINを連打した時に処理が重なるのを防ぐ
    if (spin.classList.contains("spinning")) {
      return;
    }
    spin.classList.add("spinning");

    panels.forEach(panel => {
      panel.activate();
      panel.spin();
    });
  });
}