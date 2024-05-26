const nav=document.querySelector('.navbar')
fetch('./components/header.html')
.then(res=>res.text())
.then(data=>{
    nav.innerHTML=data
});
  

const footer=document.querySelector('.footer')
fetch('./components/footer.html')
.then(res=>res.text())
.then(data=>{
    footer.innerHTML=data
});
