// app.js
App({
  onLaunch() {
    
  },
  globalData: {
      a:[]
  },
  push(ob){
    this.globalData.a.push(ob);
    if(this.globalData.a.length == 2){
      console.log(this.globalData.a[0] === this.globalData.a[1])
    }
  }
})
