const fileInput = document.getElementById("fileInput");

const originalCanvas =
document.getElementById("originalCanvas");

const encryptedCanvas =
document.getElementById("encryptedCanvas");

const octx =
originalCanvas.getContext("2d");

const ectx =
encryptedCanvas.getContext("2d");

let currentImage = null;

fileInput.addEventListener("change", loadImage);

function loadImage(e){

const file = e.target.files[0];

if(!file) return;

const img = new Image();

img.onload = () => {

currentImage = img;

originalCanvas.width = img.width;
originalCanvas.height = img.height;

encryptedCanvas.width = img.width;
encryptedCanvas.height = img.height;

octx.drawImage(img,0,0);

document.getElementById("width")
.textContent = img.width;

document.getElementById("height")
.textContent = img.height;
};

img.src = URL.createObjectURL(file);
}

function getKey(){

let key =
document.getElementById("secretKey").value;

if(!key){
alert("Enter secret key");
return null;
}

return key.charCodeAt(0);
}

function encryptImage(){

const key = getKey();

if(!key) return;

let imageData =
octx.getImageData(
0,
0,
originalCanvas.width,
originalCanvas.height
);

let data = imageData.data;

for(let i=0;i<data.length;i+=4){

data[i] ^= key;
data[i+1] ^= key;
data[i+2] ^= key;
}

shufflePixels(data,key);

ectx.putImageData(imageData,0,0);

document.getElementById("security")
.textContent="95%";
}

function decryptImage(){

const key = getKey();

if(!key) return;

let imageData =
ectx.getImageData(
0,
0,
encryptedCanvas.width,
encryptedCanvas.height
);

let data = imageData.data;

shufflePixels(data,key);

for(let i=0;i<data.length;i+=4){

data[i] ^= key;
data[i+1] ^= key;
data[i+2] ^= key;
}

ectx.putImageData(imageData,0,0);
}

function shufflePixels(data,key){

for(let i=0;i<data.length-4;i+=4){

let j =
((i/4)*key)%((data.length/4)-1);

j*=4;

for(let k=0;k<4;k++){

let temp=data[i+k];
data[i+k]=data[j+k];
data[j+k]=temp;

}
}
}

function downloadImage(){

const link =
document.createElement("a");

link.download =
"encrypted-image.png";

link.href =
encryptedCanvas.toDataURL();

link.click();
}

function resetTool(){

location.reload();
}