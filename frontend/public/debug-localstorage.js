// Debug localStorage changes
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;

localStorage.setItem = function (key, value) {
  if (key.includes("auth") || key.includes("Token") || key.includes("user")) {
    console.log("🔵 LOCALSTORAGE SET:", key, "=", value);
    console.trace("Set by:");
  }
  return originalSetItem.call(this, key, value);
};

localStorage.removeItem = function (key) {
  if (key.includes("auth") || key.includes("Token") || key.includes("user")) {
    console.log("🔴 LOCALSTORAGE REMOVE:", key);
    console.trace("Removed by:");
  }
  return originalRemoveItem.call(this, key);
};

localStorage.clear = function () {
  console.log("🔴 LOCALSTORAGE CLEAR: All data cleared");
  console.trace("Cleared by:");
  return originalClear.call(this);
};

console.log("🔍 LocalStorage monitoring enabled");
