var $ = require("jquery");
window.$ = $
require('popper.js');
require('bootstrap');
var ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host:'ipfs.infura.io', protocol:'https'});

let tokenURI_state = {
  name: "",
  description: "",
  image: ""
};

$('#selectImage').on('change', function(e){
  var file = e.target.files[0];
  $(this).next('.custom-file-label').html(file.name);
})


$('#uploadImage').on('click', function(){
  const name = $('#tokenName').val();
  const description = $('#description').val();
  const file = $('#selectImage')[0].files[0];

  if (file == undefined) {
    alert('select the image')
  } else if (name == '') {
    alert('Enter the name')
  } else if (description == '') {
    alert('Enter the description')
  } else {
    tokenURI_state.name = name;
    tokenURI_state.description = description;
    const reader = new FileReader();

    reader.addEventListener('load', async function(){
      //upload image
      let results = await upload(reader.result);
      tokenURI_state.image = "https://ipfs.io/ipfs/"+results[0].hash;

      //upload tokenURI_state
      tokenURI_state = JSON.stringify(tokenURI_state);
      results = await upload(tokenURI_state);

      $('#tokenURI').val("https://ipfs.io/ipfs/" + results[0].hash);
      $('#tokenURIGroup').slideDown('normal')
    })

    reader.readAsArrayBuffer(file);
  }
})

async function upload(value) {
  const buffer = ipfs.types.Buffer.from(value);
  const results = await ipfs.add(buffer);
  return results;
}

//TODO:自動的に戻ってしまうから、調整する
$('#tokenURI').hover(function(){
  $('#copy').slideDown('normal')
})

$('#copy').hover(function(){}, function(){
  $('#copy').slideUp('normal');
})

$('#copy').on('click', function(){
  //select copy_tartget
  $('#tokenURI').select();
  //copy to clipboad
  document.execCommand("Copy");

  alert("コピーできました！");
})
