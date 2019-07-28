
const detectUrls = [
  '*://pc-play.games.dmm.co.jp/play/himegari*',
  '*://osapi.dmm.com/gadgets/ifr?*&aid=759269&*'
]

const listen = function(){
  chrome.tabs.query({ url: detectUrls }, function(tabs){
    if (tabs && tabs.length) {
      chrome.debugger.attach({ tabId: tabs[0].id }, '1.3', function(){
        chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Network.enable', {}, function(){
          chrome.debugger.onEvent.addListener(function(source, method, params){
            if (method == 'Network.responseReceived') {
              if (params.response.url.indexOf('/ab/WebGL/') > -1) {
                // ASSET BUNDLE
                let hash = params.response.url.split('/').pop()
                if (detectedHashes.indexOf(hash) === -1) {
                  detectedHashes.push(hash)
                  if (data.ignore.indexOf(hash) > -1) {
                    $("#hashes").append(`
                      <div style="color:#c0c0c0;"><span class="hash">` + hash + `</span></div>
                    `)
                  } else if (data.hashes[hash]) {
                    $("#hashes").append(`
                      <div style="color:#339933;"><span class="hash">` + hash + `</span> (` + data.hashes[hash] + `)</div>
                    `)
                  } else {
                    $("#hashes").append(`
                      <div style="">
                        <a href="http://himegari.cdn.dmmgames.com/ab/WebGL/` + hash + `" target="_blank"><span class="hash">` + hash + `</span></a>
                        <span class="saved" id="saved-` + hash + `"></span>
                        <span id="controls-` + hash + `">
                          <button class="ignore" data-hash="` + hash + `">ignore</button>
                          <input type="text" class="charname" id="name-` + hash + `" />
                          <button class="charify" data-hash="` + hash + `">char</button>
                        </span>
                      </div>
                    `)
                  }
                }
              }
            }
          })
        })
      })
    } else {
      alert('No himegari tabs open...');
    }
  })
}

const detach = function(){
  chrome.tabs.query({ url: detectUrls }, function(tabs){
    if (tabs && tabs.length) {
      chrome.debugger.detach({ tabId: tabs[0].id });
    }
  })
}

const updateData = function(){
  $.ajax({
    dataType: "json",
    url: 'data.json',
    success: function(response){
      data = response
      $("#codes textarea").val(JSON.stringify(data, null, ' ', 2))
    }
  })
}

let data = {}
let detectedHashes = []

updateData();

$(document).ready(function(){

  $("#on").on('click', function(){
    $(this).hide();
    $("#off").show();
    listen();
  })

  $("#off").on('click', function(){
    $(this).hide();
    $("#on").show();
    detach();
  })

  $("#updata").on('click', function(){
    updateData();
  })

  $("#hashes").on('click', '.ignore', function(){
    let hash = $(this).data('hash')
    data.ignore.push(hash)
    $("#codes textarea").val(JSON.stringify(data, null, 2))
    $("#controls-"+hash).hide()
    $("#saved-"+hash).html('Ignored')
  })

  $("#hashes").on('click', '.charify', function(){
    let hash = $(this).data('hash')
    data.hashes[hash] = $("#name-"+hash).val()
    $("#codes textarea").val(JSON.stringify(data, null, 2))
    $("#controls-"+hash).hide()
    $("#saved-"+hash).html('Saved: ' + $("#name-"+hash).val())
  })

})