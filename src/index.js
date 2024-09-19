const btn = document.createElement("button");
btn.innerHTML = "测试按钮";
document.body.appendChild(btn);
console.log(123);
async function getAsyncComponent() { 
    await import('./ceshi.js');
}


btn.addEventListener('click',()=>{
    getAsyncComponent();
})