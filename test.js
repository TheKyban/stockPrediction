let n = 500
let total = 3000
let days = 22;

import scaler from "minmaxscaler";

let sum = 0

// for (let i = 500; i < 3000; i += days) {
//     console.log(sum++)
//     console.log(i)
// }

// console.log((total-500)/days)



// console.log(transform([1,515,51,2,5]))

// const data = scaler.fit_transform([1, 3, 5, 7]);
const X_test = scaler.transform([1.5, 2.3]);
const X_test_inverse = scaler.inverse_transform(X_test);

// console.log(data);
console.log(X_test);
console.log(X_test_inverse);
console.log(scaler.get_params());