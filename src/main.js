

// 取出localStorage里寄放在x里面的hashMap字符串
const x=localStorage.getItem('x')
// 转为对象：XObject记录包含打开的网页的hashMap对象
const xObject=JSON.parse(x)
console.log(xObject)
// hashMap来存储网站（li标签）：初始存A站、B站；但当要从打开的网页返回时，hashMap取XObject
const hashMap=xObject || [
    {logo:'A',url:'https://www.acfun.cn'},
    {logo:'B',url:'https://www.bilibili.com'}
]
console.log(hashMap)
const $siteList=$('.siteList')
const $lastLi=$siteList.find('.lastLi')
/* <li>
        <a href="https://www.bilibili.com/">
            <div class="site">
                <div class="logo">
                    <img src="./images/bilibili.png" alt="">
                </div>
                <div class="link">bilibili.com</div>
            </div>
        </a>
</li> */


const simplifyUrl=(url)=>{
    return url.replace('http://','')
            .replace('https://','')
            .replace('www.','')
            .replace(/\/.*/,'')  
            // 最后，配合正则表达式删除 com 之后 以 / 开头的所有字符
}

// 遍历渲染hashMap的每个网点对象：插入到.siteList，且插在新增按钮前面
const render=()=>{
    // hashMap元素渲染到.siteList之前，把.siteList现有的除最后 新增按钮 以外的 li 全删除，再渲染hashMap
    $siteList.find('li:not(.lastLi)').remove()
    hashMap.forEach((node,index)=>{ 
        const $li=$(`
        <li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="close">
                    <svg class="icon-close">
                    <use href="#close-small"></use>
                </svg>
                </div>
            </div>
        </li>
        `).insertBefore($lastLi)
        $li.on('click',()=>{
            window.open(node.url)
        })
        // 点击.close，阻止冒泡
        $li.on('click','.close',(e)=>{
            e.stopPropagation()
            hashMap.splice(index,1)
            // 对hashMap删除站点，故删除后要重新渲染hashMap
            render()
        })
    })    
}
// 用render提交hashMap初始存储的网站
render()

// 处理新增站点
$('.addButton')
    .on('click',()=>{
        let url=window.prompt('请问想添加的网址是啥')
        // 若http在URL里出现的位置不是从0开始
        if(url.indexOf('http')!==0){
            url='https://'+url
        }
        hashMap.push({
            logo:simplifyUrl(url)[0].toUpperCase(),
            url:url
        })
        render()
    })

// 用localStorage存储hashMap，当从打开的网页返回的时候，可以再读取localStorage里的hashMap，防止丢失站点
window.onbeforeunload=()=>{
    // localStorage只能存字符串，故先把hashMap对象转为字符串
    const string=JSON.stringify(hashMap)
    // 在本地存储localStorage里设置x存string
    localStorage.setItem('x',string)
}

$(document).on('keypress',(e)=>{
    const key=e.key
    for(let i=0;i<hashMap.length;i++){
        if(key===hashMap[i].logo || key.toUpperCase()===hashMap[i].logo){
            window.open(hashMap[i].url)
        }
    }
})


