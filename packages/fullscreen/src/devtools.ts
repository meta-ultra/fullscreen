/**
 * NOTE:
 * There's no standard solution for allover browsers to detect whether the DevTools is open or not.
 * As the time goes by, the existing and effective solutions would become ineffective.
 */

/**
 * Available for Chrome v64.0.xxxx.xxx and IE11 only.
 * However, Chrome v114.x returns false constantly.
 * @returns {boolean}
 */
function detectChromeV64(): boolean {
  if (navigator.appVersion.indexOf("Chrome") == -1) return false;

  let open = false;
  const el = document.createElement("div");
  Object.defineProperty(el, "id", {
    get: function () {
      open = true;
    },
  });
  console.log("%c", el);
  console.clear && console.clear();
  return open;
}

/**
 * Avaiable for FireFox v58.0.x and IE11 only.
 * @returns {boolean}
 */
function detectFireFoxV58(): boolean {
  if (navigator.appVersion.indexOf("FireFox") == -1) return false;

  let open = false;
  const devTools = /./;
  devTools.toString = function () {
    open = true;
    return "";
  };
  console.log(devTools);
  console.clear && console.clear();
  return open;
}

/**
 * @param {{width: number, height: number}} thresholds
 * @returns {boolean}
 * @see https://github.com/sindresorhus/devtools-detect/blob/main/index.js
 */
function detectByWindowOutInnerSizeRoughly(thresholds = { width: 2, height: 150 }): boolean {
  const dWidth = window.outerWidth - window.innerWidth;
  const dHeight = window.outerHeight - window.innerHeight;
  const open = dWidth > thresholds.width || dHeight > thresholds.height;

  return open;
}

function isDevToolsOpen(thresholds = { width: 2, height: 150 }) {
  return detectChromeV64() || detectFireFoxV58() || detectByWindowOutInnerSizeRoughly(thresholds);
}

export { isDevToolsOpen };
