//add random method to arrays
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const apis = [
    "a6cf3dc7820565270b3e5024a5136261",
    "d48a2de02f7e9d806d3f2e38d6d102a8",
    "4fa6f16a8fa5434934db9a1f4cebcc51",
    "eddd17b45325fa570028a6227f4389b9",
    "4883a6ad4ed77ebfe457acf902771f1e",
    "ef9644d07fea0bce04d9fe02509f5e0b",
    "ac2ab451b4f3b43cb5d23bb8056f2c96",
    "d9a3cd4c8cb265b0c52383180e884820",
    "4388ae289e484c4a9b512b23a6d2945e",
    "6fe6ef4a13e1a7b03386449623f4a2c0"
];
export const key = apis.random();