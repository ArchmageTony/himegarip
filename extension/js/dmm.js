(function(){

  setInterval(function(){
    if(document.getElementById("game_frame")) {
      var osapiLink = document.getElementById("game_frame").getAttribute("src")
      window.open(osapiLink, "_blank", "width=853,height=480,toolbar=no,scrollbars=no,resizable=no,titlebar=no,status=no")
      window.close()
    }
  }, 1000)

})()