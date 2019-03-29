var $ = require("jquery");
window.$ = $
require('popper.js');
require('bootstrap');
var ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host:'ipfs.infura.io', protocol:'https'});
console.log(ipfs);

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

  if (file == '') {
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
      console.log(reader.result);
      const buffer =  ipfs.types.Buffer.from(reader.result);
      console.log(buffer);
      const results = await ipfs.add(buffer);
      tokenURI_state.image = "https://ipfs.io/ipfs/"+results[0].hash;
      console.log(tokenURI_state);
    })

    reader.readAsArrayBuffer(file);
  }
})
